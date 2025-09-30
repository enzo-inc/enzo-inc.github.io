import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import { getAllPosts } from "@/lib/blog"

export default async function WritingsPage() {
  const posts = await getAllPosts()
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">All Writings</h1>
          <p className="text-lg text-muted-foreground">
            Thoughts, ideas and insights from my day-to-day work.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-8">
            {posts.map((post) => (
              <article 
                key={post.slug}
                className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow bg-card"
              >
                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      <Link 
                        href={`/writings/${post.slug}`}
                        className="text-foreground hover:text-accent transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

                  <div className="pt-2">
                    <Link href={`/writings/${post.slug}`}>
                      <Button variant="ghost" className="text-accent hover:text-accent/80 p-0 h-auto font-medium">
                        Read more →
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-16">
            <p className="text-xl text-muted-foreground">More coming soon...</p>
          </div>
        )}
      </div>
    </div>
  )
}
