import { notFound } from 'next/navigation';
import blogData from '@/lib/blogData.json';
import BlogContentClient from './BlogContentClient'; // Import the Client Component

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

const blogDataTyped: Blog[] = blogData as Blog[]; // Explicitly cast here

export async function generateStaticParams() {
  return blogDataTyped.map((blog) => ({
    slug: blog.slug,
  }));
}

const BlogPostPage = async ({ params }: { params: { slug: string } }) => {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const blogPost = blogDataTyped.find((blog: Blog) => blog.slug === slug);

  if (!blogPost) {
    notFound();
  }

  return (
    <BlogContentClient blogPost={blogPost} /> // Pass blogPost as prop to Client Component
  );
};

export default BlogPostPage;
