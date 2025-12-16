---
layout: page
title: About
---

<img src="/assets/img/profile.jpeg" alt="Enzo" style="width: 96px; height: 96px; border-radius: 16px; object-fit: cover; float: left; margin-right: 24px; margin-bottom: 16px;">

# Enzo Incutti

Building code review agents at [Recurse](https://www.recurse.ml/)

<div style="clear: both;"></div>

[GitHub](https://github.com/enzo-inc) | [LinkedIn](https://www.linkedin.com/in/vincenzo-incutti/) | [Twitter](https://x.com/enzo__inc) | [Email](mailto:enzo@recurse.ml)

[View Code →](https://github.com/enzo-inc)

---

## Current Focus

I'm currently building code review agents at [Recurse](https://www.recurse.ml/), where I work on infrastructure that helps catch bugs before they ship. I am particularly interested in code models, specifically code review models - think of knowing where a critical bug is introduced the moment you type the wrong keystrokes.

---

## Technical Systems

*Things I helped build from the ground up*

### Agent Infrastructure

- Core agent architecture with context management, tool calling, structured outputs, and observability (h/t [Requesty](https://www.requesty.ai/))
- Evaluation pipelines integrated with [Weights & Biases](https://wandb.ai/) for continuous model improvement
- [Elasticsearch](https://www.elastic.co/elasticsearch)-powered knowledge base with vector embeddings for semantic code search and documentation integration

### Production Systems

- CI/CD pipelines on [GitHub Actions](https://github.com/features/actions), [GCP CloudBuild](https://cloud.google.com/build), and [CloudRun](https://cloud.google.com/run)
- [GitHub App](https://docs.github.com/en/apps) with [FastAPI](https://fastapi.tiangolo.com/) webhooks for real-time PR monitoring and review
- [Redis](https://redis.io/)-based async processing architecture for scalable background analysis
- Terminal UI with [click](https://github.com/pallets/click) that brings code review capabilities directly into the development workflow—catching issues before they reach PR stage

---

## Research That Shapes My Work

- [On Usefulness of the Deep-Learning-Based Bug Localization Models to Practitioners](https://arxiv.org/abs/1907.08588)
- [RepoBench: Benchmarking Repository-Level Code Auto-Completion Systems](https://arxiv.org/abs/2306.03091)
- [Alibaba LingmaAgent: Improving Automated Issue Resolution via Comprehensive Repository Exploration](https://arxiv.org/abs/2406.01422)
- [CoRNStack: High-Quality Contrastive Data for Better Code Retrieval and Reranking](https://arxiv.org/abs/2412.01007)
- [CodeT5: Identifier-aware Unified Pre-trained Encoder-Decoder Models for Code Understanding and Generation](https://arxiv.org/abs/2109.00859)

---

## Projects

{% for project in site.data.projects %}
**[{{ project.name }}]({{ project.url }})**
{{ project.description }}

{% endfor %}

---

## Writings

[View all writings →](/blog/)

More coming soon...
