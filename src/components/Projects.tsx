"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

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
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  const [userIdentifier, setUserIdentifier] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve user identifier for anonymous likes
    let identifier = localStorage.getItem('userIdentifier');
    if (!identifier) {
      identifier = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userIdentifier', identifier);
    }
    setUserIdentifier(identifier);
    
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.slice(0, 6));
        
        // Check which projects are liked by this user using batch endpoint
        const identifier = localStorage.getItem('userIdentifier');
        if (identifier && data.length > 0) {
          const projectIds = data.slice(0, 6).map((project: Project) => project.id);
          const likeResponse = await fetch('/api/projects/likes/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectIds, userIdentifier: identifier }),
          });
          
          if (likeResponse.ok) {
            const { likedIds } = await likeResponse.json();
            setLikedProjects(new Set(likedIds));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleLikeClick = async (projectId: number) => {
    // Optimistic update - update UI immediately
    const isCurrentlyLiked = likedProjects.has(projectId);
    const newLikedState = !isCurrentlyLiked;
    
    // Update UI instantly
    setLikedProjects((prev) => {
      const newSet = new Set(prev);
      if (newLikedState) {
        newSet.add(projectId);
      } else {
        newSet.delete(projectId);
      }
      return newSet;
    });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, likes: project.likes + (newLikedState ? 1 : -1) }
          : project
      )
    );

    // Then make API call
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier }),
      });

      if (!response.ok) {
        // Revert on error
        setLikedProjects((prev) => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(projectId);
          } else {
            newSet.delete(projectId);
          }
          return newSet;
        });

        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? { ...project, likes: project.likes + (isCurrentlyLiked ? 1 : -1) }
              : project
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLikedProjects((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(projectId);
        } else {
          newSet.delete(projectId);
        }
        return newSet;
      });

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId
            ? { ...project, likes: project.likes + (isCurrentlyLiked ? 1 : -1) }
            : project
        )
      );
    }
  };

  return (
    <section id="projects" className="container mx-auto px-8 py-16 bg-background">
      <Card className="p-8 rounded-lg shadow-xl text-center">
        <CardHeader>
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary self-center">
            My Work
          </Badge>
          <CardTitle className="text-4xl font-extrabold tracking-tight mb-4">
            Recent <span className="text-primary">Projects</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg mb-8">
            Explore a selection of my recent work, showcasing my skills in web development.
            Each project reflects my commitment to clean code, user-centric design, and robust functionality.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {projects.map((project: Project) => (
              <div
                key={project.id}
                onClick={() => window.location.href = `/projects/${project.id}`}
                className={`project-card ${project.gradientClass} rounded-xl lg:rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] transition relative`}
              >
                {project.year && (
                  <span className="inline-block px-3 py-1 bg-primary/30 text-primary rounded-md text-xs font-semibold mb-4">
                    {project.year}
                  </span>
                )}

                {project.aiPowered && (
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="ai-badge px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold bg-primary/20 text-primary-foreground flex items-center gap-1.5">
                      <span>⭐</span>
                      <span>AI Powered</span>
                    </span>
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      {project.type}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold">
                    <span className="text-primary">{project.titlePart1}</span><br />
                    {project.titlePart2}
                  </h3>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                  {project.techIcons.map((icon, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 tech-badge rounded-lg flex items-center justify-center text-sm"
                    >
                      {icon}
                    </div>
                  ))}
                </div>

                <img
                  src={project.imageSrc as string}
                  alt={project.imageAlt}
                  className="w-full rounded-lg shadow-2xl rotate-3"
                />

                {/* Like Button with Counter */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="text-sm font-medium text-red-500">{project.likes}</span>
                  <button
                    className="p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleLikeClick(project.id);
                    }}
                  >
                    <Heart fill={likedProjects.has(project.id) ? "currentColor" : "none"} strokeWidth={2} className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Link href="/projects">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              View All Projects
            </Button>
          </Link>
        </CardContent>
      </Card>
    </section>
  )
}
