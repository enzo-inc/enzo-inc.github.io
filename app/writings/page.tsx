import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function WritingsPage() {
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

        <div className="flex items-center justify-center py-16">
          <p className="text-xl text-muted-foreground">More coming soon...</p>
        </div>
      </div>
    </div>
  )
}
