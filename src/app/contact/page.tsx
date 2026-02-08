"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react"; // Assuming lucide-react is available for icons

export default function ContactPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted!");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Contact Form Section */}
        <div>
          <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Get in Touch</CardTitle>
              <CardDescription>
                Have a question or want to work together? Fill out the form below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                  ></textarea>
                </div>
                <Button type="submit" className="w-full py-2">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-8 text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Let's Connect
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of
            your visions.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Mail className="h-6 w-6 text-primary" />
              <span className="text-lg text-foreground">hridoy@example.com</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <Phone className="h-6 w-6 text-primary" />
              <span className="text-lg text-foreground">+1 (123) 456-7890</span>
            </div>
            {/* Add more contact info if needed, e.g., address, social media links */}
          </div>
        </div>
      </div>
    </div>
  );
}