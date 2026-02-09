"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, Calendar, Sparkles, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

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

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>('');

  useEffect(() => {
    // Generate or retrieve user identifier
    let identifier = localStorage.getItem('userIdentifier');
    if (!identifier) {
      identifier = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userIdentifier', identifier);
    }
    setUserIdentifier(identifier);
    
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const projects = await response.json();
        const foundProject = projects.find((p: Project) => p.id === parseInt(params.id as string));
        
        if (foundProject) {
          setProject(foundProject);
          
          // Check if liked
          const identifier = localStorage.getItem('userIdentifier');
          if (identifier) {
            const likeResponse = await fetch(`/api/projects/${foundProject.id}/like?userIdentifier=${identifier}`);
            if (likeResponse.ok) {
              const { liked: isLiked } = await likeResponse.json();
              setLiked(isLiked);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeClick = async () => {
    if (!project) return;

    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIdentifier }),
      });

      if (response.ok) {
        const { liked: isLiked } = await response.json();
        setLiked(isLiked);
        
        // Update local likes count
        setProject({
          ...project,
          likes: project.likes + (isLiked ? 1 : -1)
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <LoadingSpinner message="Loading project..." />
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex-1 overflow-auto w-full lg:w-auto">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <Button onClick={() => router.push('/projects')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto w-full lg:w-auto">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/projects')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {project.type}
            </Badge>
            {project.aiPowered && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {project.year}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            <span className="text-primary">{project.titlePart1}</span>
            <br />
            {project.titlePart2}
          </h1>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techIcons.map((icon, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Like Button */}
          <div className="flex items-center gap-4">
            <Button
              variant={liked ? "default" : "outline"}
              onClick={handleLikeClick}
              className="gap-2"
            >
              <Heart 
                fill={liked ? "currentColor" : "none"} 
                className="w-5 h-5" 
              />
              {liked ? 'Liked' : 'Like'} ({project.likes})
            </Button>
          </div>
        </div>

        {/* Project Image */}
        <Card className="mb-8 overflow-hidden">
          <img 
            src={project.imageSrc} 
            alt={project.imageAlt}
            className="w-full h-auto object-cover"
          />
        </Card>

        {/* Project Details */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            
            <div className="prose dark:prose-invert max-w-none">
              {project.description ? (
                <p className="text-lg text-muted-foreground mb-6">
                  {project.description}
                </p>
              ) : (
                <p className="text-lg text-muted-foreground mb-6">
                  This is a {project.type.toLowerCase()} project built in {project.year}. 
                  {project.aiPowered && ' This project leverages AI technology to provide enhanced functionality.'}
                </p>
              )}

              <h3 className="text-xl font-semibold mb-3">Key Features</h3>
              <ul className="space-y-2 mb-6">
                <li>Modern and responsive design</li>
                <li>Built with cutting-edge technologies</li>
                <li>Optimized for performance</li>
                <li>User-friendly interface</li>
                {project.aiPowered && <li>AI-powered features for enhanced user experience</li>}
              </ul>

              <h3 className="text-xl font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techIcons.map((icon, idx) => (
                  <Badge key={idx} variant="secondary" className="text-lg px-3 py-1">
                    {icon}
                  </Badge>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-3">Project Type</h3>
              <p className="text-muted-foreground mb-6">
                {project.type}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                {project.demoUrl && (
                  <Button size="lg" className="gap-2" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-5 h-5" />
                      View Live Demo
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button size="lg" variant="outline" className="gap-2" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View Source Code
                    </a>
                  </Button>
                )}
                {!project.demoUrl && !project.githubUrl && (
                  <p className="text-muted-foreground italic">Links coming soon...</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Projects */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More Projects</h2>
          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => router.push('/projects')}
            >
              View All Projects
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
