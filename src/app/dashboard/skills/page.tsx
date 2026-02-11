"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  PlusCircle, 
  Edit, 
  Trash2,
  Search,
  Eye,
  EyeOff,
  Star
} from "lucide-react";

interface Skill {
  id: number;
  name: string;
  category: string;
  icon?: string;
  proficiency: number;
  display_order: number;
  is_visible: boolean;
}

export default function SkillsManagementPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    icon: "",
    proficiency: 5,
    display_order: 0,
    is_visible: true,
  });

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

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    skill.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "",
      icon: "",
      proficiency: 5,
      display_order: skills.length,
      is_visible: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || "",
      proficiency: skill.proficiency,
      display_order: skill.display_order,
      is_visible: skill.is_visible,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const response = await fetch(`/api/skills?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setSkills(skills.filter(skill => skill.id !== id));
          alert("Skill deleted successfully!");
        } else {
          alert("Failed to delete skill.");
        }
      } catch (error) {
        console.error('Error deleting skill:', error);
        alert("An error occurred while deleting the skill.");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editingSkill) {
        const updatedSkill = { 
          ...editingSkill, 
          ...formData,
        };

        const response = await fetch('/api/skills', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSkill),
        });

        if (response.ok) {
          const data = await response.json();
          setSkills(skills.map(skill => skill.id === data.id ? data : skill));
          alert("Skill updated successfully!");
        } else {
          alert("Failed to update skill.");
        }
      } else {
        const newSkill = {
          ...formData,
        };

        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSkill),
        });

        if (response.ok) {
          const data = await response.json();
          setSkills([...skills, data]);
          alert("Skill created successfully!");
        } else {
          alert("Failed to create skill.");
        }
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving skill:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  const toggleVisibility = async (skill: Skill) => {
    try {
      const updatedSkill = { ...skill, is_visible: !skill.is_visible };
      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSkill),
      });

      if (response.ok) {
        const data = await response.json();
        setSkills(skills.map(s => s.id === data.id ? data : s));
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Skills Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your technical skills and expertise
          </p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Skill
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search skills by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Loading skills...
          </p>
        ) : filteredSkills.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No skills found.
          </p>
        ) : (
          filteredSkills.map((skill) => (
            <Card key={skill.id} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {skill.icon && (
                      <span className="text-3xl">{skill.icon}</span>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{skill.name}</h3>
                      <p className="text-sm text-muted-foreground">{skill.category}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleVisibility(skill)}
                  >
                    {skill.is_visible ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < skill.proficiency
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(skill)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(skill.id)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? "Edit Skill" : "Create New Skill"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., React"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Frontend, Backend, Database"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., ⚛️"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proficiency">Proficiency (1-5)</Label>
              <Input
                id="proficiency"
                type="number"
                min="1"
                max="5"
                value={formData.proficiency}
                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_visible"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="w-4 h-4 rounded border-input"
              />
              <Label htmlFor="is_visible" className="cursor-pointer">
                Visible on homepage
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingSkill ? "Update" : "Create"} Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
