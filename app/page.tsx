import { Github, Linkedin, Twitter, Mail, Code2, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { getRecentPosts } from "@/lib/blog"

export default async function HomePage() {
  const recentPosts = await getRecentPosts(3)
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="fixed top-6 right-6 z-10">
          <ThemeToggle />
        </div>

        {/* Header */}
        <header className="mb-16">
          <div className="flex items-start gap-8 mb-12">
            <img
              src="/profile.jpeg"
              alt="Enzo"
              className="w-24 h-24 rounded-2xl object-cover shadow-lg flex-shrink-0"
            />
            <div className="flex-1 py-0 my-3">
              <h1 className="text-3xl font-bold text-foreground mb-2">Enzo Incutti</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Building code review agents at{" "}
                <Link href="https://www.recurse.ml/" className="text-accent hover:underline font-medium">
                  Recurse
                </Link>
              </p>
              
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <Link
              href="https://github.com/enzo-inc"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/vincenzo-incutti/"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm">LinkedIn</span>
            </Link>
            <Link
              href="https://x.com/enzo__inc"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="text-sm">Twitter</span>
            </Link>
            <Link
              href="mailto:enzo@recurse.ml"
              className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm">Email</span>
            </Link>
          </div>

          <div className="flex gap-3">
            <Link href="https://github.com/enzo-inc">
              <Button variant="outline" className="rounded-lg bg-transparent">
                View Code →
              </Button>
            </Link>
            <Link href="/writings">
              <Button variant="outline" className="rounded-lg bg-transparent">
                View Writings →
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Current Work */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Current Focus</h2>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-base leading-relaxed text-muted-foreground">
                  I'm currently building code review agents at{" "}
                  <Link href="https://www.recurse.ml/" className="text-accent hover:underline font-medium">
                    Recurse
                  </Link>
                  , where I work on infrastructure that helps catch bugs before they ship. I am particularly interested
                  in code models, specifically code review models - think of knowing where a critical bug is introduced
                  the moment you type the wrong keystrokes.
                </p>
              </div>
            </section>

            {/* Technical Systems */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Technical Systems</h2>
              </div>

              <p className="text-sm text-muted-foreground mb-6 italic">Things I helped build from the ground up</p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3">Agent Infrastructure</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>
                      • Core agent architecture with context management, tool calling, structured outputs, and
                      observability (h/t{" "}
                      <Link href="https://www.requesty.ai/" className="text-accent hover:underline">
                        Requesty
                      </Link>
                      )
                    </li>
                    <li>
                      • Evaluation pipelines integrated with{" "}
                      <Link href="https://wandb.ai/" className="text-accent hover:underline">
                        Weights & Biases
                      </Link>{" "}
                      for continuous model improvement
                    </li>
                    <li>
                      •{" "}
                      <Link href="https://www.elastic.co/elasticsearch" className="text-accent hover:underline">
                        Elasticsearch
                      </Link>
                      -powered knowledge base with vector embeddings for semantic code search and documentation
                      integration
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-3">Production Systems</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground ml-4">
                    <li>
                      • CI/CD pipelines on{" "}
                      <Link href="https://github.com/features/actions" className="text-accent hover:underline">
                        GitHub Actions
                      </Link>
                      ,{" "}
                      <Link href="https://cloud.google.com/build" className="text-accent hover:underline">
                        GCP CloudBuild
                      </Link>
                      , and {" "}
                      <Link href="https://cloud.google.com/run" className="text-accent hover:underline">
                        CloudRun
                      </Link>
                    </li>
                    <li>
                      •{" "}
                      <Link href="https://docs.github.com/en/apps" className="text-accent hover:underline">
                        GitHub App
                      </Link>{" "}
                      with{" "}
                      <Link href="https://fastapi.tiangolo.com/" className="text-accent hover:underline">
                        FastAPI
                      </Link>{" "}
                      webhooks for real-time PR monitoring and review
                    </li>
                    <li>
                      •{" "}
                      <Link href="https://redis.io/" className="text-accent hover:underline">
                        Redis
                      </Link>
                      -based async processing architecture for scalable background analysis
                    </li>
                    <li>
                      • Terminal UI with{" "}
                      <Link href="https://github.com/pallets/click" className="text-accent hover:underline">
                        click
                      </Link>{" "}
                      that brings code review capabilities directly into the development workflow—catching issues before
                      they reach PR stage
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Research */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-6">Research That Shapes My Work</h2>
              <ul className="space-y-2 list-disc pl-4">
                <li className="text-sm">
                  <Link
                    href="https://arxiv.org/abs/1907.08588"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    On Usefulness of the Deep-Learning-Based Bug Localization Models to Practitioners
                  </Link>
                </li>
                <li className="text-sm">
                  <Link
                    href="https://arxiv.org/abs/2306.03091"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    RepoBench: Benchmarking Repository-Level Code Auto-Completion Systems
                  </Link>
                </li>
                <li className="text-sm">
                  <Link
                    href="https://arxiv.org/abs/2406.01422"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    Alibaba LingmaAgent: Improving Automated Issue Resolution via Comprehensive Repository Exploration
                  </Link>
                </li>
                <li className="text-sm">
                  <Link
                    href="https://arxiv.org/abs/2412.01007"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    CoRNStack: High-Quality Contrastive Data for Better Code Retrieval and Reranking
                  </Link>
                </li>
                <li className="text-sm">
                  <Link
                    href="https://arxiv.org/abs/2109.00859"
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    CodeT5: Identifier-aware Unified Pre-trained Encoder-Decoder Models for Code Understanding and
                    Generation
                  </Link>
                </li>
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Projects */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold text-foreground">Projects</h2>
              </div>

              <div className="space-y-4">
                <div className="border-l-2 border-accent/20 pl-4">
                  <h3 className="font-medium text-sm mb-1">
                    <Link href="https://github.com/samshapley/NeutralNetwork" className="text-accent hover:underline">
                      Neutral Network
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground">GPT-4 powered YouTube comment bot</p>
                </div>

                <div className="border-l-2 border-accent/20 pl-4">
                  <h3 className="font-medium text-sm mb-1">
                    <Link
                      href="https://github.com/enzo-inc/Tokenised-Collateral-Management"
                      className="text-accent hover:underline"
                    >
                      Tokenised Collateral Management
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground">BSV blockchain automated settlement</p>
                </div>

                <div className="border-l-2 border-accent/20 pl-4">
                  <h3 className="font-medium text-sm mb-1">
                    <Link href="https://github.com/enzo-inc/XRPLoyalties" className="text-accent hover:underline">
                      XRPLoyalties
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground">XRPL artist royalty distribution</p>
                </div>

                <div className="border-l-2 border-accent/20 pl-4">
                  <h3 className="font-medium text-sm mb-1">
                    <Link
                      href="https://github.com/enzo-inc/BaysOpt-for-Bacterial-ABS"
                      className="text-accent hover:underline"
                    >
                      BaysOpt for Bacterial ABS
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground">Bayesian optimization for biological sims</p>
                </div>
              </div>
            </section>

            {/* Writings */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                <Link href="/writings" className="hover:text-accent transition-colors">
                  Recent Writings →
                </Link>
              </h2>
              
              {recentPosts.length > 0 ? (
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.slug} className="border-l-2 border-accent/20 pl-4">
                      <h3 className="font-medium text-sm mb-1">
                        <Link 
                          href={`/writings/${post.slug}`} 
                          className="text-accent hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <time>{new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}</time>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">More coming soon...</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
