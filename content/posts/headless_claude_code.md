---
title: "Building Headless Claude Code Applications with Micro VMs"
excerpt: "???"
publishedAt: "2025-09-30"
---

Most LLM-for-coding companies are now providing CLI tools (#TODO add examples here) that wrap the core model and enhance its reasoning capabilities through careful context engineering and turn management. If you've ever used one of these tools, you might have been suprised by how different the models feel when running in the CLI environments compared to the responses you receive from the APIs. This is because the models have been optiimzed to reason within the boundaries of a specific environment.

As an engineer building agents for coding myself, a natural question that arose was: "What if I could just spin up one of these CLI tools in the background and give it the task that I spent months carefully tuning our own agent to, will that be able to one-shot it given the magic that the engineers at <your favourite frontier lab> have applied in this CLI tool"? And so I went about implementing a quick prototype meant to showcase how we could use this CLI tools in our own pipelines. 

I was surpised to find out that there aren't many cookbooks (as far as I could search) out there showing how to take these CLI tools and run them as background jobs. And this makes sense, these CLI tools are optimized to be run in an interactive way in the terminal with a developer-in-the loop. But I still went ahead and hacked something together. This post contains some of the hacks I had to come up, and I'm sharing in the hope that anyone wanting to run a quick experiment with headless LLM CLI tools might find them useful.

The tools I've used are:
- E2B for microVMs
- Claude Code CLI for the core agent
- FastMCP to obtain structured outputs

# MicroVMs
#TODO: here talk about e2b and micro vms and how i've used them


# CLaude Code
#TODO: here talk about claude code, describing also the flags I have used them. Specifically
--print for headless mode
- number of turns (here described what a turn counts as)
- the removal of tools related to the todo list as these would quickly eat up the max turns (altho this comes with a tradeoff)
-- output format json so that we can neatly log all the calls and inspect them later
- timeout = 0 as the time required by claude varies massively and we don't want the task to time out

# fastMCP
#TODO: here describe the problem that there is no equivalent of a `response_format` you get when making an api call to ensure that the response of the model conforms to your pydantic models. To get around this, I had to create an mcp server running on the microVM, make it avaiilable to claude to call. The hack lies in the fact that we prompt the model to call this tool when it's done with its task, The model then supplies as arugments to the tool whatever the signature of the tool describes. If we simpliy promped the model to output json and we tried to create custom regex-basd parsing of its output, it would be massively flakier (let alone hope the model remembers to actually follow your output intstruction). Another, realted hack lies in then writing the arugments passed my the model to the MCP tool to a file. The worker process that interacts with the sandbox via the sandbox manager then reads from that file into the pydantic model.