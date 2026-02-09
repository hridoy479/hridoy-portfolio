"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const [about, setAbout] = useState({
    badge: "About Me",
    title: "Who is Hridoy?",
    paragraph1: "I am a passionate JavaScript Developer with expertise in building modern web applications. My journey in web development began with a fascination for creating intuitive user experiences and robust, scalable backend systems. I specialize in React, Next.js, and Tailwind CSS, always striving for performance, clarity, and impactful digital solutions.",
    paragraph2: "Beyond coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously learning to refine my craft. Let's build something amazing together!"
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.about) {
          setAbout(data.about);
        }
      }
    } catch (error) {
      console.error('Error fetching about settings:', error);
    }
  };
  
  return (
    <section className="container mx-auto px-8 py-16 bg-background">
      <Card className="p-8 rounded-lg shadow-xl text-center">
        <CardHeader>
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary self-center">
            {about.badge}
          </Badge>
          <CardTitle className="text-4xl font-extrabold tracking-tight mb-4">
            {about.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg mb-6">
            {about.paragraph1}
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed text-lg">
            {about.paragraph2}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
