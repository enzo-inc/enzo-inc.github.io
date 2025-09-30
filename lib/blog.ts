import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import hljs from 'highlight.js'

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  publishedAt: string
  content: string
}

// Custom renderer for syntax highlighting  
const renderer = new marked.Renderer()

// Override the code block renderer
renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  const language = lang || 'plaintext'
  
  if (language && hljs.getLanguage(language)) {
    try {
      const highlighted = hljs.highlight(text, { language }).value
      return `<pre class="hljs-pre"><code class="hljs language-${language}">${highlighted}</code></pre>`
    } catch (err) {
      console.error('Highlight error:', err)
    }
  }
  
  // Fallback for unsupported languages
  const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<pre class="hljs-pre"><code>${escaped}</code></pre>`
}

// Configure marked
marked.use({
  renderer,
  gfm: true,
  breaks: false
})

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const postPromises = fileNames
      .filter((name: string) => name.endsWith('.md'))
      .map(async (name: string) => {
        const slug = name.replace(/\.md$/, '')
        return await getPostBySlug(slug)
      })
    
    const allPosts = await Promise.all(postPromises)
    const validPosts = allPosts.filter((post: BlogPost | null): post is BlogPost => post !== null)

    // Sort posts by date (newest first)
    return validPosts.sort((a: BlogPost, b: BlogPost) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  } catch (error) {
    console.error('Error reading posts directory:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Convert markdown to HTML
    const htmlContent = await marked.parse(content, { async: true })

    return {
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      publishedAt: data.publishedAt || '',
      content: htmlContent,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function getRecentPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}
