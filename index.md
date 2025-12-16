---
layout: home
title: Home
---

<div class="hero">
  <img src="/assets/img/profile.jpeg" alt="Enzo Incutti" class="hero-image">
  <h1 class="hero-name">Enzo Incutti</h1>
  <p class="hero-tagline">
    I build systems that catch bugs before humans do. Currently obsessing over code review agents at <a href="https://www.recurse.ml/">Recurse</a> — think <code>git commit</code> that knows you're about to ship a bug.
  </p>
  <div class="social-links">
    <a href="https://github.com/enzo-inc" class="social-link github">
      <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      GitHub
    </a>
    <a href="https://www.linkedin.com/in/vincenzo-incutti/" class="social-link">
      <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      LinkedIn
    </a>
    <a href="https://x.com/enzo__inc" class="social-link">
      <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Twitter
    </a>
    <a href="mailto:enzo@recurse.ml" class="social-link">
      <svg viewBox="0 0 24 24"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>
      Email
    </a>
  </div>
</div>

<div class="section">
  <h2 class="section-title">What I'm Building</h2>
  <div class="content">
    <p>At Recurse, I work on infrastructure that catches bugs before they ship. The vision: your IDE knows you're introducing a critical bug the moment you type the wrong keystrokes — not after three rounds of code review.</p>
    
    <h3>Agent Infrastructure</h3>
    <ul>
      <li>Core agent architecture with context management, tool calling, structured outputs, and observability</li>
      <li>Evaluation pipelines integrated with <a href="https://wandb.ai/">Weights & Biases</a> for continuous model improvement</li>
      <li><a href="https://www.elastic.co/elasticsearch">Elasticsearch</a>-powered knowledge base with vector embeddings for semantic code search</li>
    </ul>
    
    <h3>Production Systems</h3>
    <ul>
      <li>CI/CD on <a href="https://github.com/features/actions">GitHub Actions</a>, <a href="https://cloud.google.com/build">GCP CloudBuild</a>, and <a href="https://cloud.google.com/run">CloudRun</a></li>
      <li><a href="https://docs.github.com/en/apps">GitHub App</a> with <a href="https://fastapi.tiangolo.com/">FastAPI</a> webhooks for real-time PR monitoring</li>
      <li><a href="https://redis.io/">Redis</a>-based async processing for scalable background analysis</li>
      <li>Terminal UI with <a href="https://github.com/pallets/click">click</a> for in-editor code review</li>
    </ul>
  </div>
</div>

<div class="section">
  <h2 class="section-title">Projects</h2>
  <div class="projects-grid">
    <a href="https://github.com/samshapley/NeutralNetwork" class="project-card">
      <div class="project-card-title">Neutral Network</div>
      <p class="project-card-desc">GPT-4 bot that generates contextually-aware YouTube comments. Built to explore how LLMs handle conversational dynamics in adversarial environments.</p>
      <div class="project-card-tech">
        <span class="tech-tag">GPT-4</span>
        <span class="tech-tag">Python</span>
      </div>
    </a>
    <a href="https://github.com/enzo-inc/Tokenised-Collateral-Management" class="project-card">
      <div class="project-card-title">Tokenised Collateral</div>
      <p class="project-card-desc">Automated settlement system on BSV blockchain. Smart contracts for real-time collateral management and margin calls.</p>
      <div class="project-card-tech">
        <span class="tech-tag">BSV</span>
        <span class="tech-tag">Smart Contracts</span>
      </div>
    </a>
    <a href="https://github.com/enzo-inc/XRPLoyalties" class="project-card">
      <div class="project-card-title">XRPLoyalties</div>
      <p class="project-card-desc">Artist royalty distribution on XRPL. Automatic splits and transparent on-chain payment tracking for creators.</p>
      <div class="project-card-tech">
        <span class="tech-tag">XRPL</span>
        <span class="tech-tag">Web3</span>
      </div>
    </a>
    <a href="https://github.com/enzo-inc/BaysOpt-for-Bacterial-ABS" class="project-card">
      <div class="project-card-title">BaysOpt for Bacterial ABS</div>
      <p class="project-card-desc">Bayesian optimization for biological simulations. Efficient parameter search for agent-based bacterial models.</p>
      <div class="project-card-tech">
        <span class="tech-tag">Bayesian Opt</span>
        <span class="tech-tag">Simulation</span>
      </div>
    </a>
  </div>
</div>

<div class="section">
  <h2 class="section-title">Research That Shapes My Work</h2>
  <ul class="research-list">
    <li class="research-item">
      <a href="https://arxiv.org/abs/1907.08588" class="research-link">On Usefulness of Deep-Learning-Based Bug Localization Models</a>
      <p class="research-note">The paper that convinced me automated code review was possible.</p>
    </li>
    <li class="research-item">
      <a href="https://arxiv.org/abs/2306.03091" class="research-link">RepoBench: Benchmarking Repository-Level Code Auto-Completion</a>
      <p class="research-note">How I think about evaluating code understanding at scale.</p>
    </li>
    <li class="research-item">
      <a href="https://arxiv.org/abs/2406.01422" class="research-link">Alibaba LingmaAgent: Automated Issue Resolution</a>
      <p class="research-note">State-of-the-art in agent-driven codebase exploration.</p>
    </li>
    <li class="research-item">
      <a href="https://arxiv.org/abs/2412.01007" class="research-link">CoRNStack: Contrastive Data for Code Retrieval</a>
      <p class="research-note">Better embeddings = better semantic search.</p>
    </li>
    <li class="research-item">
      <a href="https://arxiv.org/abs/2109.00859" class="research-link">CodeT5: Unified Pre-trained Encoder-Decoder for Code</a>
      <p class="research-note">Foundation for understanding code as structured data.</p>
    </li>
  </ul>
</div>

<div class="section">
  <h2 class="section-title">Writing</h2>
  <p class="content"><a href="/blog/">View all posts →</a></p>
</div>
