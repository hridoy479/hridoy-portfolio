"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Hero() {
  const [hero, setHero] = useState({
    name: "Hridoy",
    title: "JavaScript Developer",
    description: "I design and build modern web applications with React, Next.js, and Tailwind CSS — focused on performance, clarity, and impact.",
    profileImage: "/profile-pic.avif",
    badge: "Portfolio"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.hero) {
          setHero(data.hero);
        }
      }
    } catch (error) {
      console.error('Error fetching hero settings:', error);
    }
  };
  
  return (
    <main className="">
      <section className="min-h-screen flex items-center bg-background max-w-7xl mx-auto">
        <div className="container max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center lg:px-7">

          {/* Left Content */}
          <Card className="p-8 rounded-lg shadow-xl">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              {hero.badge}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Hi, I'm <span className="text-primary">{hero.name}</span>
              <br />
              <span className="text-muted-foreground">
                {hero.title}
              </span>
            </h1>

            <p className="text-muted-foreground max-w-xl mb-8 leading-relaxed text-lg">
              {hero.description}
            </p>

            <div className="flex gap-4">
              <Button size="lg" className="hover:bg-primary/90 text-white dark:text-black">
                View Projects
              </Button>
              <Button size="lg" variant="outline" className="hover:bg-accent">
                Contact Me
              </Button>
            </div>
          </Card>

          {/* Right Image */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 md:-inset-8 bg-primary/30 blur-[100px] rounded-full" />

             <Image 
               src={hero.profileImage} 
               alt={`${hero.name} portfolio`} 
               className="w-48 h-48 md:w-80 md:h-80 z-10 rounded-lg transform rotate-3 transition-transform duration-300 hover:rotate-0" 
               width={500} 
               height={500} 
             />
          </div>

        </div>
      </section>
    </main>
  );
}
