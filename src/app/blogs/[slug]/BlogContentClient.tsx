"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Blog {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
}

interface BlogContentClientProps {
  blogPost: Blog;
}

const BlogContentClient = ({ blogPost }: BlogContentClientProps) => {
  return (
    <main className="flex-1 overflow-auto w-full lg:w-auto">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Link href="/blogs" className="inline-flex items-center text-primary hover:underline mb-8">
          <ChevronLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Link>

        <img src={blogPost.image} alt={blogPost.title} className="w-full h-64 object-cover rounded-lg mb-8 shadow-md" />

        <h1 className="text-4xl font-bold mb-4 text-foreground">
          {blogPost.title}
        </h1>
        <div className="flex justify-between items-center text-muted-foreground text-sm mb-6">
          <span>{blogPost.category}</span>
          <span>{blogPost.date}</span>
        </div>

        <article className="prose dark:prose-invert max-w-none text-foreground leading-relaxed">
          <ReactMarkdown>{blogPost.content}</ReactMarkdown>
        </article>
      </div>
    </main>
  );
};

export default BlogContentClient;