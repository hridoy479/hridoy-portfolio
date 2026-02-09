"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings as SettingsIcon,
  Save,
  Image as ImageIcon,
  User,
  FileText,
  Upload,
  RefreshCw
} from "lucide-react";
import siteSettingsData from "@/lib/siteSettings.json";

export default function SettingsPage() {
  const [settings, setSettings] = useState(siteSettingsData);
  const [imagePreview, setImagePreview] = useState(settings.hero.profileImage);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setSettings({
          ...settings,
          hero: { ...settings.hero, profileImage: result }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImagePreview(url);
    setSettings({
      ...settings,
      hero: { ...settings.hero, profileImage: url }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Settings saved successfully! Refresh the page to see changes on the homepage.");
      } else {
        alert("Failed to save settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("An error occurred while saving settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setImagePreview(data.hero.profileImage);
        alert("Settings refreshed successfully!");
      }
    } catch (error) {
      console.error("Error refreshing settings:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Site Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Customize your portfolio homepage content
        </p>
      </div>

      {/* Hero Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            Hero Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Image */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Profile Image</Label>
            
            {/* Image Preview */}
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border bg-muted">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                {/* File Upload */}
                <div>
                  <Label htmlFor="imageUpload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors w-fit">
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </div>
                  </Label>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a new profile image (JPG, PNG, AVIF)
                  </p>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Or enter image URL</Label>
                  <Input
                    id="imageUrl"
                    value={settings.hero.profileImage}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    placeholder="/profile-pic.avif or https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="space-y-2">
            <Label htmlFor="badge">Badge Text</Label>
            <Input
              id="badge"
              value={settings.hero.badge}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, badge: e.target.value }
              })}
              placeholder="Portfolio"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={settings.hero.name}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, name: e.target.value }
              })}
              placeholder="Hridoy"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={settings.hero.title}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, title: e.target.value }
              })}
              placeholder="JavaScript Developer"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={settings.hero.description}
              onChange={(e) => setSettings({
                ...settings,
                hero: { ...settings.hero, description: e.target.value }
              })}
              placeholder="Brief introduction..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* About Section Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-orange-500" />
            About Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Badge */}
          <div className="space-y-2">
            <Label htmlFor="aboutBadge">Badge Text</Label>
            <Input
              id="aboutBadge"
              value={settings.about.badge}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, badge: e.target.value }
              })}
              placeholder="About Me"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="aboutTitle">Section Title</Label>
            <Input
              id="aboutTitle"
              value={settings.about.title}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, title: e.target.value }
              })}
              placeholder="Who is Hridoy?"
            />
          </div>

          {/* Paragraph 1 */}
          <div className="space-y-2">
            <Label htmlFor="paragraph1">First Paragraph</Label>
            <Textarea
              id="paragraph1"
              value={settings.about.paragraph1}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, paragraph1: e.target.value }
              })}
              placeholder="Tell your story..."
              rows={5}
            />
          </div>

          {/* Paragraph 2 */}
          <div className="space-y-2">
            <Label htmlFor="paragraph2">Second Paragraph</Label>
            <Textarea
              id="paragraph2"
              value={settings.about.paragraph2}
              onChange={(e) => setSettings({
                ...settings,
                about: { ...settings.about, paragraph2: e.target.value }
              })}
              placeholder="Additional information..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-between items-center">
        <Button onClick={handleRefresh} variant="outline" size="lg" className="gap-2">
          <RefreshCw className="h-5 w-5" />
          Refresh Settings
        </Button>
        <Button onClick={handleSave} size="lg" className="gap-2" disabled={isSaving}>
          <Save className="h-5 w-5" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
