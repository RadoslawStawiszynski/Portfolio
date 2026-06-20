# Local AI Assistant — Ollama + Qwen3-Coder

A local AI development assistant built with Ollama, running a custom-configured Qwen3-Coder model entirely on-device. No cloud, no API costs, no data leaving the machine.

## What it does

- Runs a 30B parameter code-focused LLM locally via Ollama
- Custom `Modelfile` configures the model persona, temperature, and context window (32k tokens)
- Environment diagnostic script (`test_kim_jestem.py`) detects available ML libraries, RAM, CPU, network, and filesystem access — useful for validating AI/ML dev environments
- Designed to integrate with [Continue](https://continue.dev) VS Code extension for in-editor AI assistance

## Stack

| Component | Technology |
|-----------|-----------|
| LLM runtime | [Ollama](https://ollama.com) |
| Base model | `Qwen3-Coder-30B-A3B-Instruct-1M` |
| Language | Python 3.x |
| Key libs | psutil, numpy, pandas, torch, scikit-learn |

## How to run

**Prerequisites:** Ollama installed and running locally.

```bash
# 1. Pull the base model
ollama pull Qwen3-Coder-30B-A3B-Instruct-1M

# 2. Create the custom assistant
ollama create MyAsystent -f MyAsystent.Modelfile

# 3. Start a chat session
ollama run MyAsystent
```

**Run environment diagnostics:**

```bash
pip install -r requirements.txt
python test_kim_jestem.py
```

## What I learned

- How to configure and fine-tune LLM behavior via Ollama Modelfiles (system prompt, temperature, context size)
- How to set up a private, offline-first AI coding assistant with no API costs
- How to audit a Python ML environment programmatically (available GPU/RAM, installed libs, network access)
- Practical difference between cloud LLM APIs and local inference trade-offs (latency vs. privacy vs. cost)

## Tags

`AI` · `LLM` · `Ollama` · `Python` · `Local-first` · `Qwen` · `Developer Tools`
