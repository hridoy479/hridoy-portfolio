"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Heart,
  Calendar,
  Tag,
  Search,
  Eye,
  Code,
  Info
} from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface BlogPost {
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

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'guide'>('edit');
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    image: "",
  });

  // Fetch blogs from API
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      content: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        const response = await fetch(`/api/blogs?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setBlogs(blogs.filter(blog => blog.id !== id));
          alert("Blog post deleted successfully!");
        } else {
          alert("Failed to delete blog post.");
        }
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert("An error occurred while deleting the blog post.");
      }
    }
  };

  const handleSave = async () => {
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

      if (editingBlog) {
        // Update existing blog
        const updatedBlog = { ...editingBlog, ...formData };
        const response = await fetch('/api/blogs', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(updatedBlog),
        });

        if (response.ok) {
          const data = await response.json();
          setBlogs(blogs.map(blog => blog.id === data.id ? data : blog));
          alert("Blog post updated successfully!");
          setIsDialogOpen(false);
        } else {
          const error = await response.text();
          console.error('Update error:', error);
          alert(`Failed to update blog post: ${error}`);
        }
      } else {
        // Add new blog
        const newBlog = {
          id: `blog-${Date.now()}`,
          ...formData,
          date: new Date().toISOString().split('T')[0],
          image: formData.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%232a2a2a' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='20' font-family='monospace'%3ENew Blog%3C/text%3E%3C/svg%3E",
          likes: 0,
        };

        console.log('Creating blog:', newBlog);

        const response = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(newBlog),
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response:', responseText);

        if (response.ok) {
          const data = JSON.parse(responseText);
          setBlogs([data, ...blogs]);
          alert("Blog post created successfully!");
          setIsDialogOpen(false);
          fetchBlogs(); // Refresh the list
        } else {
          console.error('Create error:', responseText);
          alert(`Failed to create blog post: ${responseText}`);
        }
      }
    } catch (error: any) {
      console.error('Error saving blog:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Blog Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create, edit, and manage your blog posts
          </p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Post
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search blogs by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Loading blogs...
          </p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No blog posts found.
          </p>
        ) : (
          filteredBlogs.map((blog) => (
            <Card key={blog.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-blue-500/30" />
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {blog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {blog.likes}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                    {blog.category}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(blog)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(blog.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) setActiveTab('edit');
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
            </DialogTitle>
          </DialogHeader>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-2">
            <Button
              variant={activeTab === 'edit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('edit')}
              className="gap-2"
            >
              <Code className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('preview')}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button
              variant={activeTab === 'guide' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('guide')}
              className="gap-2"
            >
              <Info className="h-4 w-4" />
              Markdown Guide
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {activeTab === 'edit' && (
              <div className="space-y-4">
                <ImageUpload
                  currentImage={formData.image}
                  onImageChange={(url) => setFormData({ ...formData, image: url })}
                  bucket="blog-images"
                  label="Blog Image"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter blog title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="blog-post-slug"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Web Development, React, TypeScript"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the blog post (shown in blog list)"
                    rows={3}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content (Markdown)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your blog content in markdown... Use the Preview tab to see how it looks!"
                    rows={15}
                    className="font-mono text-sm resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="border border-border rounded-lg p-6 bg-background">
                  <h1 className="text-3xl font-bold mb-2">{formData.title || 'Your Title Here'}</h1>
                  <p className="text-muted-foreground mb-4">{formData.excerpt || 'Your excerpt here...'}</p>
                  <div className="border-t border-border my-4"></div>
                  <div className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:text-foreground
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-foreground prose-p:leading-relaxed
                    prose-a:text-primary hover:prose-a:underline
                    prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic
                    prose-ul:list-disc prose-ul:pl-6
                    prose-ol:list-decimal prose-ol:pl-6
                    prose-li:text-foreground
                  ">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {formData.content || '*Start writing to see preview...*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-4 text-sm">
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-bold text-lg">Markdown Quick Reference</h3>
                    
                    <div className="space-y-2">
                      <div>
                        <p className="font-semibold">Headers:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          # H1 Header<br/>
                          ## H2 Header<br/>
                          ### H3 Header
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Text Formatting:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          **bold text**<br/>
                          *italic text*<br/>
                          ~~strikethrough~~
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Links:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          [Link Text](https://example.com)
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Images:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          ![Alt Text](image-url.jpg)
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Lists:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          - Unordered item<br/>
                          - Another item<br/>
                          <br/>
                          1. Ordered item<br/>
                          2. Another item
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Code Blocks:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          ```javascript<br/>
                          const hello = "world";<br/>
                          console.log(hello);<br/>
                          ```
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Inline Code:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          Use `code` for inline code
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Blockquotes:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          &gt; This is a quote
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Tables:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          | Header 1 | Header 2 |<br/>
                          |----------|----------|<br/>
                          | Cell 1   | Cell 2   |
                        </code>
                      </div>

                      <div>
                        <p className="font-semibold">Horizontal Rule:</p>
                        <code className="block bg-muted p-2 rounded mt-1">
                          ---
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingBlog ? "Update" : "Create"} Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
