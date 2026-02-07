"use client";
import { useState } from 'react';

const Page = () => {
  const [activeFilter, setActiveFilter] = useState('Full Stack');
    const filters = ["All", "Full Stack", "React JS", "JavaScript", "HTML CSS"]
  const projectsData = [
    {
      year: 2026,
      type: "FULL STACK",
      titlePart1: "AI Fitness",
      titlePart2: "TRACKER",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23111' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' fill='%23333' dominant-baseline='middle' text-anchor='middle' font-family='monospace'%3EFitness Tracker UI%3C/text%3E%3C/svg%3E",
      imageAlt: "AI Fitness Tracker",
      gradientClass: "gradient-card-1",
      techIcons: ["⚛️", "🟢", "💎", "🗄️"],
    },
    {
      year: 2025,
      type: "FULL STACK",
      titlePart1: "AI Short Video",
      titlePart2: "Ads Generator",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%230a0a1a' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23333' font-size='16' font-family='monospace'%3EVideo Generator UI%3C/text%3E%3C/svg%3E",
      imageAlt: "AI Video Generator",
      gradientClass: "gradient-card-2",
      aiPowered: true,
      techIcons: ["⚛️", "🗄️", "🐍", "🧠", "🎥"],
    },
    {
      year: 2025,
      type: "Full Stack",
      titlePart1: "AI Thumbnail",
      titlePart2: "GENERATOR",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%231a0a2a' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23444' font-size='16' font-family='monospace'%3EThumbnail Generator UI%3C/text%3E%3C/svg%3E",
      imageAlt: "Thumbnail Generator",
      gradientClass: "gradient-card-3",
      aiPowered: true,
      techIcons: ["⚛️", "🟢", "🗄️", "🎨", "🖼️"],
    },
{
      year: 2025,
      type: "React JS",
      titlePart1: "AI Thumbnail",
      titlePart2: "GENERATOR",
      imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%231a0a2a' width='400' height='250'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23444' font-size='16' font-family='monospace'%3EThumbnail Generator UI%3C/text%3E%3C/svg%3E",
      imageAlt: "Thumbnail Generator",
      gradientClass: "gradient-card-3",
      aiPowered: true,
      techIcons: ["⚛️", "🟢", "🗄️", "🎨", "🖼️"],
    },
  ];

  const filteredProjects = projectsData.filter(project => {
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
                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition flex items-center gap-2
                ${activeFilter === filter
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-transparent border border-primary/50 text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }
              `}
            >
              {activeFilter === filter && (
                <span className="w-2 h-2 bg-primary-foreground rounded-full"></span>
              )}
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredProjects.map((project, index) => (
            <div
              key={index}
              className={`project-card ${project.gradientClass} rounded-xl lg:rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] transition`}
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
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Page
