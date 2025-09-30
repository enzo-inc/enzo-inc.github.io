import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import { getAllPosts, getPostBySlug } from "@/lib/blog"
import "./blog-styles.css"

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return {
      title: "Post not found"
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/writings">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to writings
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <header className="mb-8 pb-8 border-b border-border">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-gray dark:prose-invert max-w-none"
            style={{
              ['--tw-prose-headings' as any]: 'var(--color-foreground)',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}
