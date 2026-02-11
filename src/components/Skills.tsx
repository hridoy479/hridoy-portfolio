"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "./LoadingSpinner";

interface Skill {
  id: number;
  name: string;
  category: string;
  icon?: string;
  proficiency: number;
  display_order: number;
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/skills');
      if (response.ok) {
        const data = await response.json();
        setSkills(data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <section className="container mx-auto px-8 py-16 bg-background">
        <Card className="p-8 rounded-lg shadow-xl">
          <LoadingSpinner message="Loading skills..." />
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-8 py-16 bg-background">
      <Card className="p-8 rounded-lg shadow-xl text-center">
        <CardHeader>
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary self-center">
            My Skills
          </Badge>
          <CardTitle className="text-4xl font-extrabold tracking-tight mb-4">
            Technologies I <span className="text-primary">Master</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-xl font-semibold text-left text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap justify-start gap-3">
                {categorySkills.map((skill) => (
                  <Badge 
                    key={skill.id} 
                    className="text-base px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {skill.icon && <span className="mr-2">{skill.icon}</span>}
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
