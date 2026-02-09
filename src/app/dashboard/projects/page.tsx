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
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Heart,
  Calendar,
  Search,
  Sparkles
} from "lucide-react";

interface Project {
  id: number;
  year: number;
  type: string;
  titlePart1: string;
  titlePart2: string;
  imageSrc: string;
  imageAlt: string;
  gradientClass: string;
  aiPowered?: boolean;
  techIcons: string[];
  likes: number;
  githubUrl?: string;
  demoUrl?: string;
  description?: string;
}

export default function ProjectManagementPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    titlePart1: "",
    titlePart2: "",
    type: "",
    year: new Date().getFullYear(),
    imageAlt: "",
    imageSrc: "",
    techIcons: "",
    aiPowered: false,
    githubUrl: "",
    demoUrl: "",
    description: "",
  });

  // Fetch projects from API
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    `${project.titlePart1} ${project.titlePart2}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingProject(null);
    setFormData({
      titlePart1: "",
      titlePart2: "",
      type: "",
      year: new Date().getFullYear(),
      imageAlt: "",
      imageSrc: "",
      techIcons: "",
      aiPowered: false,
      githubUrl: "",
      demoUrl: "",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      titlePart1: project.titlePart1,
      titlePart2: project.titlePart2,
      type: project.type,
      year: project.year,
      imageAlt: project.imageAlt,
      imageSrc: project.imageSrc,
      techIcons: project.techIcons.join(", "),
      aiPowered: project.aiPowered || false,
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      description: project.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

        const response = await fetch(`/api/projects?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authHeader,
          },
        });
        
        if (response.ok) {
          setProjects(projects.filter(project => project.id !== id));
          alert("Project deleted successfully!");
        } else {
          alert("Failed to delete project.");
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert("An error occurred while deleting the project.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const techIconsArray = formData.techIcons.split(",").map(icon => icon.trim()).filter(Boolean);
      
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';
      
      if (editingProject) {
        // Update existing project
        const updatedProject = { 
          ...editingProject, 
          ...formData,
          techIcons: techIconsArray,
        };

        const response = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(updatedProject),
        });

        if (response.ok) {
          const data = await response.json();
          setProjects(projects.map(project => project.id === data.id ? data : project));
          alert("Project updated successfully!");
        } else {
          const error = await response.text();
          console.error('Update error:', error);
          alert(`Failed to update project: ${error}`);
        }
      } else {
        // Add new project
        const newProject = {
          ...formData,
          techIcons: techIconsArray,
          imageSrc: formData.imageSrc || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23111' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' fill='%23333' dominant-baseline='middle' text-anchor='middle' font-family='monospace'%3ENew Project%3C/text%3E%3C/svg%3E",
          gradientClass: `gradient-card-${projects.length + 1}`,
          likes: 0,
        };

        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(newProject),
        });

        if (response.ok) {
          const data = await response.json();
          setProjects([data, ...projects]);
          alert("Project created successfully!");
          setIsDialogOpen(false);
          fetchProjects(); // Refresh the list
        } else {
          const error = await response.text();
          console.error('Create error:', error);
          alert(`Failed to create project: ${error}`);
        }
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Project Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Showcase and manage your portfolio projects
          </p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search projects by title or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Loading projects...
          </p>
        ) : filteredProjects.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No projects found.
          </p>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-500/10 to-pink-500/10 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-4xl opacity-30">
                    {project.techIcons[0] || "🚀"}
                  </div>
                </div>
                {project.aiPowered && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI Powered
                  </div>
                )}
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                    {project.titlePart1} {project.titlePart2}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {project.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {project.likes}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full">
                    {project.type}
                  </span>
                </div>

                <div className="flex gap-1 text-xl">
                  {project.techIcons.slice(0, 5).map((icon, idx) => (
                    <span key={idx} className="opacity-70 hover:opacity-100 transition-opacity">
                      {icon}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Create New Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <ImageUpload
              currentImage={formData.imageSrc}
              onImageChange={(url) => setFormData({ ...formData, imageSrc: url })}
              bucket="project-images"
              label="Project Image"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titlePart1">Title Part 1</Label>
                <Input
                  id="titlePart1"
                  value={formData.titlePart1}
                  onChange={(e) => setFormData({ ...formData, titlePart1: e.target.value })}
                  placeholder="e.g., AI Fitness"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="titlePart2">Title Part 2</Label>
                <Input
                  id="titlePart2"
                  value={formData.titlePart2}
                  onChange={(e) => setFormData({ ...formData, titlePart2: e.target.value })}
                  placeholder="e.g., TRACKER"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Project Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., FULL STACK"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageAlt">Image Alt Text</Label>
              <Input
                id="imageAlt"
                value={formData.imageAlt}
                onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                placeholder="Description for accessibility"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techIcons">Tech Icons (comma-separated emojis)</Label>
              <Input
                id="techIcons"
                value={formData.techIcons}
                onChange={(e) => setFormData({ ...formData, techIcons: e.target.value })}
                placeholder="⚛️, 🟢, 💎, 🗄️"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the project..."
                className="w-full px-3 py-2 border border-input rounded-md min-h-[80px] bg-background"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="https://demo.com"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="aiPowered"
                checked={formData.aiPowered}
                onChange={(e) => setFormData({ ...formData, aiPowered: e.target.checked })}
                className="w-4 h-4 rounded border-input"
              />
              <Label htmlFor="aiPowered" className="cursor-pointer">
                AI Powered Project
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingProject ? "Update" : "Create"} Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
