"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import BlogContentClient from './BlogContentClient';
import LoadingSpinner from '@/components/LoadingSpinner';

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

const BlogPostPage = ({ params }: { params: { slug: string } }) => {
  const [blogPost, setBlogPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const resolvedParams = await params;
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const blogs = await response.json();
          const blog = blogs.find((b: Blog) => b.slug === resolvedParams.slug);
          if (blog) {
            setBlogPost(blog);
          } else {
            notFound();
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params]);

  if (loading) {
    return (
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          <LoadingSpinner message="Loading blog post..." />
        </div>
      </main>
    );
  }

  if (!blogPost) {
    notFound();
  }

  return <BlogContentClient blogPost={blogPost} />;
};

export default BlogPostPage;
