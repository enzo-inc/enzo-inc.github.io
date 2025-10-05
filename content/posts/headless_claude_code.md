---
title: "Building Headless Claude Code Applications with Micro VMs"
excerpt: "A technical deep dive into running Claude Code as a background agent using E2B microVMs, FastMCP for structured outputs, and practical hacks for headless operation"
publishedAt: "2025-09-30"
---

Most LLM-for-coding companies ship CLI tools that wrap their core models. Claude Code, Aider, Cursor, and Cline all do this. They add reasoning capabilities through context engineering and turn management. If you've used these tools, you've probably noticed something odd: models feel completely different in CLI environments compared to raw API calls. This happens because the models get tuned to work within specific boundaries.

I build coding agents for a living. After months of carefully tuning our agent for specific tasks, I started wondering if I could just skip all that work. What if I spun up one of these battle-tested CLI tools in the background and handed it the same task? Would it nail it in one shot, given all the engineering that frontier labs pour into these CLIs?

So I built a quick prototype. Turns out, there's almost nothing written about running these CLI tools as background jobs. This makes sense because they're built for interactive terminal use where a developer sits in the loop. But I hacked something together anyway.

Here's what I learned.

## The Stack

Three tools make this work:
- [E2B](https://e2b.dev/docs) for microVMs
- [Claude Code CLI](https://docs.claude.com/en/docs/claude-code/overview) for the actual agent
- [FastMCP](https://gofastmcp.com) for getting structured outputs back

## Micro VMs: Fast, Isolated Execution

[E2B](https://e2b.dev/docs) gives you secure sandboxes for AI code execution. These are small isolated VMs that boot in roughly 150ms. AWS originally built [Firecracker microVMs](https://firecracker-microvm.github.io/) for this exact use case: lightweight virtual machines that give you complete isolation for running untrusted code.

I created a [custom E2B template](https://e2b.dev/docs/sandbox-template) with both Claude Code and FastMCP installed:

```dockerfile
FROM e2bdev/code-interpreter:latest 

RUN npm install -g @anthropic-ai/claude-code
RUN pip install fastmcp
```

The [sandbox manager](https://e2b.dev/docs/sdk-reference/python) handles everything from creation to teardown:

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

E2B boots sandboxes in under 200ms and uses only about 5 MiB of memory per microVM. You can pack a lot of these on a single machine. Each sandbox runs a complete Linux environment where Claude Code can execute commands, read files, and run code. All of this happens isolated from your host system.

## Claude Code: Running Without a Terminal

Claude Code has a [headless mode](https://docs.claude.com/en/docs/claude-code/sdk/sdk-headless) through the `--print` flag. This lets you run it from scripts without any UI popping up. Here are the flags that matter for background jobs:

### Flags That Actually Matter

```python
claude_code_cmd = (
    f"cd {work_dir} && "
    f"cat {prompt_file} | "
    f"claude "
    f"--print "  # No UI, just results
    f"--disallowedTools 'Task' 'TodoWrite' "  # Skip task management
    f"--output-format json "  # Get structured logs
    f"--max-turns {max_turns} "  # Cap iterations
    f"--verbose "  # Full execution details
    f"--dangerously-skip-permissions "  # Auto-approve everything
    f"--append-system-prompt {shlex.quote(system_prompt)}"
)
```

### Breaking Down Each Flag

**[`--print`](https://docs.claude.com/en/docs/claude-code/sdk/sdk-headless) (headless mode)**: Runs without terminal interaction and dumps results to stdout. You need this for automation. Without it, Claude Code expects you to sit there and interact with it.

**[`--disallowedTools`](https://docs.claude.com/en/docs/claude-code/cli-reference)**: Task management tools eat up your turn budget fast. A turn is one complete reasoning cycle where the model thinks and acts. For focused tasks, you want the agent working on the actual problem, not making todo lists.

**[`--output-format json`](https://docs.claude.com/en/docs/claude-code/sdk/sdk-headless#json-output-format)**: Returns structured logs instead of pretty terminal output. This makes parsing dead simple:

```python
result = await sandbox.commands.run(claude_code_cmd, timeout=0)
execution_data = json.loads(result.stdout)
total_cost = execution_data[-1]['total_cost_usd']
```

**[`--max-turns`](https://docs.claude.com/en/docs/claude-code/cli-reference)**: A turn in Claude Code represents a complete agentic reasoning cycle. The model thinks, potentially uses tools (reading files, running commands, editing code), and produces output. Each turn can spawn multiple tool calls as the agent iterates toward a solution. I cap at 15 to avoid runaway costs while still leaving room for complex fixes.

**`timeout=0`**: Claude's execution time swings wildly based on what you ask it to do. Setting this to zero means you won't kill the process halfway through a legitimate task.

### The XML Prompt Hack

Bash sees XML tags as command arguments. Not ideal. The fix is stupid simple: pipe your prompt from a file.

```python
prompt_file = f"/tmp/claude_prompt_{hash(prompt)}.txt"
await sandbox.files.write(prompt_file, prompt_text)

claude_code_cmd = f"cat {prompt_file} | claude --print ..."
```

## FastMCP: Getting Structured Data Back

Here's the problem: Claude Code's API doesn't have a `response_format` parameter like OpenAI does. We need the agent to return data in a predictable schema, but there's no built-in way to enforce this.

[FastMCP](https://gofastmcp.com) gives you a clean interface for building Model Context Protocol servers. These servers expose [tools to LLMs](https://gofastmcp.com/servers/tools). The trick is to create an MCP tool that becomes the output mechanism itself.

### The MCP Server

Let's say we want Claude Code to analyze a codebase and return findings in a structured format. Here's how we'd build that with FastMCP:

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

### Getting It Running

The MCP server runs inside the E2B sandbox and [registers itself with Claude Code](https://docs.claude.com/en/docs/claude-code/mcp):

```python
async def setup_mcp_server(sandbox, server_path: str) -> None:
    # Copy server script to sandbox
    await sandbox.files.write(
        "/tmp/mcp_server.py", 
        Path(server_path).read_text()
    )
    
    # Register with Claude Code
    result = await sandbox.commands.run(
        f"claude mcp add {MCP_SERVER_NAME} -s user -- python /tmp/mcp_server.py"
    )
```

### Why This Actually Works

MCP tools expose typed functions to LLMs. The [tool signature defines what parameters it accepts](https://gofastmcp.com/servers/tools#type-annotations), and the return type tells you what comes back. When you prompt Claude to call this tool once it's done, you get three things:

1. **Type safety**: The tool signature forces the right schema
2. **Reliable parsing**: File-based output beats regex parsing of markdown or JSON any day
3. **Clear intent**: The tool name and docstring tell Claude exactly when to use it

I tried other approaches first. Prompting for JSON output and parsing it with regex? Total disaster. The model forgets formatting rules, wraps output in markdown code blocks, or just makes up fields that don't exist.

### Reading the Results

After Claude Code finishes, we just read the file:

```python
async def read_analysis_results(sandbox) -> dict:
    content = await sandbox.files.read("/tmp/analysis_results.json")
    data = json.loads(content)
    return data  # {"summary": ..., "issues_found": ..., "recommendations": [...]}
```

## How It All Fits Together

The workflow looks like this:

1. Spin up an E2B sandbox with Claude Code and the MCP server
2. Set up your working directory with any files Claude Code needs to access
3. Install and register the MCP server with Claude Code
4. Run Claude Code headlessly with your task prompt
5. Claude calls the MCP tool when it finishes the task
6. Read the structured output from the file
7. Tear down the sandbox

Here's a complete example that analyzes code quality:

```python
from e2b_code_interpreter import AsyncSandbox

async def analyze_code(code_files: dict[str, str]) -> dict:
    # 1. Create sandbox with our custom template
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

The real insight here? By turning normal Python functions into MCP tools through decorators, FastMCP handles all the protocol machinery. You get a reliable output channel from what's normally an interactive CLI tool.

## Key Takeaways

**MicroVMs solve the isolation problem**: E2B's 150ms cold starts mean you can spin up sandboxes on demand. Each sandbox is a complete Linux environment that's fully isolated from your host.

**Headless mode unlocks automation**: The `--print` flag with JSON output makes Claude Code scriptable. Combine this with turn limits and tool restrictions to keep costs predictable.

**MCP tools beat prompt engineering**: Using typed MCP tools for outputs is way more reliable than clever prompting. The tool signatures give you schema enforcement that raw prompts can't provide.

The pattern works for any scenario where you need Claude Code to run autonomously and return structured results. Whether it's code analysis, automated refactoring, or documentation generation, the core principles stay the same: isolate the execution, run headlessly, and use MCP tools for structured outputs.