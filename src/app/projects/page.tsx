"use client";
import { useState, useEffect } from 'react';
import projectsData from '@/lib/projectsData.json';
import { Heart } from "lucide-react";

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
  likes: number; // Add likes property
}

const Page = () => {
  const [activeFilter, setActiveFilter] = useState('Full Stack');
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  const [projectLikes, setProjectLikes] = useState<Record<number, number>>({});
  const filters = ["All", "Full Stack", "React JS", "JavaScript", "HTML CSS"];

  useEffect(() => {
    // Initialize likes from projectsData
    const initialLikes = projectsData.reduce((acc, project) => {
      acc[project.id] = project.likes;
      return acc;
    }, {} as Record<number, number>);
    setProjectLikes(initialLikes);
  }, []);

  const handleLikeClick = (projectId: number) => {
    setLikedProjects((prevLikedProjects) => {
      const newLikedProjects = new Set(prevLikedProjects);
      if (newLikedProjects.has(projectId)) {
        newLikedProjects.delete(projectId);
        setProjectLikes((prevLikes) => ({ ...prevLikes, [projectId]: prevLikes[projectId] - 1 }));
      } else {
        newLikedProjects.add(projectId);
        setProjectLikes((prevLikes) => ({ ...prevLikes, [projectId]: prevLikes[projectId] + 1 }));
      }
      return newLikedProjects;
    });
  };

  const filteredProjects = projectsData.filter((project: Project) => {
    if (activeFilter === 'All') return true;
    return project.type.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <main className="flex-1 overflow-auto w-full lg:w-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4">
            Web Development <span className="text-primary">Projects</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Discover a variety of web development full stack projects with source code
            that are ideal for final year students and job seekers.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 lg:mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-2 dark:text-white
                ${activeFilter === filter
                  ? 'bg-primary text-white'
                  : 'bg-transparent border border-primary/50 text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }
              `}
            >
              {activeFilter === filter && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
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
                  <span className="w-2 h-2 bg-primary rounded-full"></span> {/* Consistent primary bullet */}
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
                src={project.imageSrc}
                alt={project.imageAlt}
                className="w-full rounded-lg shadow-2xl rotate-3"
              />

              {/* Like Button with Counter */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-sm font-medium text-red-500">{projectLikes[project.id]}</span>
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
      </div>
    </main>
  )
}

export default Page;
