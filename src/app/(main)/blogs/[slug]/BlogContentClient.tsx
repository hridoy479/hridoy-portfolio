"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Calendar, Tag, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface Blog {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  likes: number;
}

interface BlogContentClientProps {
  blogPost: Blog;
}

const BlogContentClient = ({ blogPost }: BlogContentClientProps) => {
  // Calculate reading time (average 200 words per minute)
  const wordCount = blogPost.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <main className="flex-1 overflow-auto w-full lg:w-auto bg-background">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <Link href="/blogs" className="inline-flex items-center text-primary hover:underline mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Blogs
        </Link>

        {/* Blog Header */}
        <article className="space-y-6">
          {/* Category & Reading Time */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
              <Tag className="w-3 h-3" />
              {blogPost.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(blogPost.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} min read
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
            {blogPost.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted-foreground leading-relaxed">
            {blogPost.excerpt}
          </p>

          {/* Featured Image */}
          <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={blogPost.image} 
              alt={blogPost.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Blog Content with Enhanced Markdown */}
          <div className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-foreground
            prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-6
            prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground prose-strong:font-semibold
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
            prose-li:text-foreground prose-li:mb-2
            prose-img:rounded-lg prose-img:shadow-lg
            prose-hr:border-border prose-hr:my-8
            prose-table:border-collapse prose-table:w-full
            prose-th:border prose-th:border-border prose-th:bg-accent prose-th:p-2 prose-th:text-left
            prose-td:border prose-td:border-border prose-td:p-2
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {blogPost.content}
            </ReactMarkdown>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-6">
            <div className="text-sm text-muted-foreground">
              Published on {new Date(blogPost.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <Link href="/blogs">
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back to All Blogs
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
};

export default BlogContentClient;