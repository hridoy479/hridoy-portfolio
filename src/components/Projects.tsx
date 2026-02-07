import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Projects() {
  return (
    <section className="container mx-auto px-8 py-16 bg-background">
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
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            View All Projects (Coming Soon!)
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
