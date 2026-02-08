"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import blogData from '@/lib/blogData.json';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from "lucide-react";

interface Blog {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  likes: number; // Add likes property
}

const BlogsPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(new Set());
  const [blogLikes, setBlogLikes] = useState<Record<string, number>>({});
  const categories = ["All", "Web Development", "CSS", "React", "Programming"];

  useEffect(() => {
    // Initialize likes from blogData
    const initialLikes = blogData.reduce((acc, blog) => {
      acc[blog.id] = blog.likes;
      return acc;
    }, {} as Record<string, number>);
    setBlogLikes(initialLikes);
  }, []);

  const handleLikeClick = (blogId: string) => {
    setLikedBlogs((prevLikedBlogs) => {
      const newLikedBlogs = new Set(prevLikedBlogs);
      if (newLikedBlogs.has(blogId)) {
        newLikedBlogs.delete(blogId);
        setBlogLikes((prevLikes) => ({ ...prevLikes, [blogId]: prevLikes[blogId] - 1 }));
      } else {
        newLikedBlogs.add(blogId);
        setBlogLikes((prevLikes) => ({ ...prevLikes, [blogId]: prevLikes[blogId] + 1 }));
      }
      return newLikedBlogs;
    });
  };

  const filteredBlogs = blogData.filter((blog: Blog) => {
    if (activeCategory === 'All') return true;
    return blog.category === activeCategory;
  });

  return (
    <main className="flex-1 overflow-auto w-full lg:w-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">
            My <span className="text-primary">Blogs</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Thoughts, insights, and tutorials on web development and programming.
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 lg:mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-2 dark:text-white
                ${activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-transparent border border-primary/50 text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }
              `}
            >
              {activeCategory === category && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog: Blog) => (
            <Card key={blog.id} className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Link href={`/blogs/${blog.slug}`}>
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
              </Link>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{blog.category}</Badge>
                  <span className="text-sm text-muted-foreground">{blog.date}</span>
                </div>
                <Link href={`/blogs/${blog.slug}`}>
                  <CardTitle className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                    {blog.title}
                  </CardTitle>
                </Link>
                <p className="text-muted-foreground text-sm mb-4">
                  {blog.excerpt}
                </p>
                <Link href={`/blogs/${blog.slug}`}>
                  <Button variant="outline" className="text-primary hover:bg-primary hover:text-primary-foreground">
                    Read More
                  </Button>
                </Link>
                {/* Like Button with Counter */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-red-500">{blogLikes[blog.id]}</span>
                  <button
                    className="p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleLikeClick(blog.id);
                    }}
                  >
                    <Heart fill={likedBlogs.has(blog.id) ? "currentColor" : "none"} strokeWidth={2} className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default BlogsPage;