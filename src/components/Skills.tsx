import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Skills() {
  const skills = [
    "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS",
    "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Git", "Docker",
    "AWS", "GCP", "REST APIs", "GraphQL", "Shadcn UI", "Framer Motion"
  ];

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
        <CardContent className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <Badge key={index} className="text-lg px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </section>
  )
}
