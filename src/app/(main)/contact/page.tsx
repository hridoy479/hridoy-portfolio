"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitStatus('idle');

    try {
      const messageData = {
        id: `msg-${Date.now()}`,
        ...formData,
        date: new Date().toISOString().split('T')[0],
        read: false,
      };

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        alert("Message sent successfully! We'll get back to you soon.");
      } else {
        setSubmitStatus('error');
        alert("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                    disabled={submitting}
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
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                    disabled={submitting}
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
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                    disabled={submitting}
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
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground"
                    required
                    disabled={submitting}
                  ></textarea>
                </div>
                <Button type="submit" className="w-full py-2" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
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