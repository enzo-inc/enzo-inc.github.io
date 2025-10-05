---
title: "Headless Claude Code Applications with Micro VMs"
excerpt: "Running Claude Code as a background agent using E2B and FastMCP"
publishedAt: "2025-09-30"
---

## Context

I build LLM-powered code review agents. After months tuning custom agents for specific tasks, I realized frontier labs already ship battle-tested CLI tools—Claude Code, Aider, Cursor—with extensive context engineering and turn management baked in. The question: could I run these CLIs as background agents instead of building from scratch?

The problem: these tools expect interactive terminal sessions. I spent days searching for documentation on headless automation—nothing. Every tutorial assumes a developer sitting in the loop. The GitHub issues mention headless flags but no one explains how to actually wire it all together: isolation, execution, structured outputs.

So I hacked together a working implementation. This post documents the techniques that should exist somewhere but don't. If you're trying to automate CLI-based coding agents, these patterns will save you the trial and error I went through.

## The Stack

- [E2B](https://e2b.dev/docs) - Firecracker microVMs for isolated execution
- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code/overview) - The agent runtime
- [FastMCP](https://gofastmcp.com) - MCP server framework for structured outputs

## Micro VMs: Fast, Isolated Execution

[E2B](https://e2b.dev/docs) provides Firecracker-based microVMs that boot in ~150ms. Full Linux environments, complete isolation, 5 MiB memory per VM.

Custom [E2B template](https://e2b.dev/docs/sandbox-template) with dependencies:

```dockerfile
FROM e2bdev/code-interpreter:latest 

RUN npm install -g @anthropic-ai/claude-code
RUN pip install fastmcp
```

[Sandbox creation](https://e2b.dev/docs/sdk-reference/python):

```python
from e2b_code_interpreter import AsyncSandbox

async def create_sandbox(
    template: str = "your-template-id",
    envs: dict[str, str] = {"ANTHROPIC_API_KEY": "your-key"},
    timeout: int = 60 * 5,
) -> AsyncSandbox:
    sandbox = await AsyncSandbox.create(
        template,
        envs=envs,
        timeout=timeout,
    )
    return sandbox
```

## Claude Code Headless Configuration

Claude Code supports [headless mode](https://docs.claude.com/en/docs/claude-code/sdk/sdk-headless) via `--print`. Critical flags for automation:

```python
claude_code_cmd = (
    f"cd {work_dir} && "
    f"cat {prompt_file} | "
    f"claude "
    f"--print "  # Headless execution
    f"--disallowedTools 'Task' 'TodoWrite' "  # Skip task management
    f"--output-format json "  # Structured logs
    f"--max-turns {max_turns} "  # Iteration cap
    f"--verbose "  # Full execution details
    f"--dangerously-skip-permissions "  # Auto-approve actions
    f"--append-system-prompt {shlex.quote(system_prompt)}"
)
```

### Flag Details

**[`--print`](https://docs.claude.com/en/docs/claude-code/sdk/sdk-headless)**: Disables terminal UI, outputs to stdout. Required for non-interactive execution.

**[`--disallowedTools`](https://docs.claude.com/en/docs/claude-code/cli-reference)**: Blocks task management tools that consume turns without contributing to the core objective. A turn is one complete reasoning cycle (think → act → observe).

**[`--output-format json`](https://docs.claude.com/en/docs/claude-code/sdk/sdk-headless#json-output-format)**: Returns structured logs for parsing:

```python
result = await sandbox.commands.run(claude_code_cmd, timeout=0)
execution_data = json.loads(result.stdout)
total_cost = execution_data[-1]['total_cost_usd']
```

**[`--max-turns`](https://docs.claude.com/en/docs/claude-code/cli-reference)**: Caps reasoning cycles. Each turn can execute multiple tool calls. Set to 15 for complex tasks while controlling costs.

**`timeout=0`**: Execution time varies significantly by task complexity. Disable timeout to avoid killing legitimate long-running operations.

### XML Prompt Handling

Bash interprets XML tags as arguments. Solution: pipe prompts from files.

```python
prompt_file = f"/tmp/claude_prompt_{hash(prompt)}.txt"
await sandbox.files.write(prompt_file, prompt_text)

claude_code_cmd = f"cat {prompt_file} | claude --print ..."
```

## FastMCP for Structured Outputs

Claude Code lacks `response_format` parameter. [FastMCP](https://gofastmcp.com) solves this by exposing [typed tools](https://gofastmcp.com/servers/tools) via Model Context Protocol—making the output mechanism itself a tool call.

### MCP Server Implementation

```python
from fastmcp import FastMCP

MCP_SERVER_NAME = "CodeAnalyzer"
MCP_OUTPUT_FILE = "/tmp/analysis_results.json"

mcp = FastMCP(MCP_SERVER_NAME)

@mcp.tool
def save_analysis(
    summary: str, 
    issues_found: int, 
    recommendations: list[str]
) -> str:
    """
    Save code analysis results to output file.
    Call this tool once analysis is complete.
    
    Args:
        summary: Brief summary of the analysis
        issues_found: Number of issues identified
        recommendations: List of recommended fixes
    """
    data = {
        "summary": summary,
        "issues_found": issues_found,
        "recommendations": recommendations
    }
    
    with open(MCP_OUTPUT_FILE, "w") as f:
        json.dump(data, f, indent=2)
    
    return f"Analysis saved to {MCP_OUTPUT_FILE}"

if __name__ == "__main__":
    mcp.run()
```

### Server Registration

[Register the MCP server](https://docs.claude.com/en/docs/claude-code/mcp) with Claude Code inside the sandbox:

```python
async def setup_mcp_server(sandbox, server_path: str) -> None:
    await sandbox.files.write(
        "/tmp/mcp_server.py", 
        Path(server_path).read_text()
    )
    
    result = await sandbox.commands.run(
        f"claude mcp add {MCP_SERVER_NAME} -s user -- python /tmp/mcp_server.py"
    )
```

### Why This Works

MCP tools provide:

1. **Type enforcement**: [Function signatures](https://gofastmcp.com/servers/tools#type-annotations) define exact schema requirements
2. **Reliable output**: File-based extraction beats regex parsing of markdown/JSON
3. **Clear invocation semantics**: Tool name and docstring provide explicit usage context

Prompt-based JSON extraction fails consistently—models forget formatting, wrap output in code blocks, or hallucinate fields.

### Result Extraction

```python
async def read_analysis_results(sandbox) -> dict:
    content = await sandbox.files.read("/tmp/analysis_results.json")
    data = json.loads(content)
    return data  # {"summary": ..., "issues_found": ..., "recommendations": [...]}
```

## Complete Implementation

```python
from e2b_code_interpreter import AsyncSandbox

async def analyze_code(code_files: dict[str, str]) -> dict:
    # 1. Create sandbox with custom template
    sandbox = await AsyncSandbox.create(
        template="claude-code-with-mcp",
        envs={"ANTHROPIC_API_KEY": api_key}
    )
    
    # 2. Copy code files to sandbox
    for filename, content in code_files.items():
        await sandbox.files.write(f"/workspace/{filename}", content)
    
    # 3. Setup MCP server
    await sandbox.files.write("/tmp/mcp_server.py", mcp_server_code)
    await sandbox.commands.run(
        "claude mcp add CodeAnalyzer -s user -- python /tmp/mcp_server.py"
    )
    
    # 4. Run Claude Code
    prompt = """Analyze the code in /workspace for:
    - Code quality issues
    - Security vulnerabilities  
    - Performance problems
    
    When done, call the save_analysis tool with your findings."""
    
    await sandbox.files.write("/tmp/prompt.txt", prompt)
    
    result = await sandbox.commands.run(
        "cd /workspace && cat /tmp/prompt.txt | claude --print "
        "--output-format json --max-turns 10 "
        "--dangerously-skip-permissions",
        timeout=0
    )
    
    # 5. Read structured results
    analysis = await sandbox.files.read("/tmp/analysis_results.json")
    data = json.loads(analysis)
    
    # 6. Cleanup
    await sandbox.kill()
    
    return data
```

## Key Implementation Patterns

**MicroVM isolation**: E2B's 150ms cold starts enable on-demand sandbox creation. Full Linux environment, complete isolation from host.

**Headless automation**: `--print` with JSON output makes Claude Code scriptable. Combine with turn limits and tool restrictions for cost control.

**MCP tools for structured output**: Typed tool signatures provide schema enforcement that prompts cannot. FastMCP handles protocol implementation via decorators.

This pattern applies to any autonomous Claude Code execution requiring structured outputs: code analysis, automated refactoring, documentation generation. Core principles: isolated execution, headless operation, MCP-based structured outputs.

---

These techniques exist in fragments across documentation, but no single resource connects them. I burned days figuring out the XML piping hack, discovering that `timeout=0` is mandatory for variable-length tasks, and realizing MCP tools are the only reliable output mechanism. If you're building headless coding agents, you need all three pieces working together—hopefully this saves you the debugging time.