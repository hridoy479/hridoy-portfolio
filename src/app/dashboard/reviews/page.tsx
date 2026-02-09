"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Star,
  Search,
  Calendar
} from "lucide-react";

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    reviewer_name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.reviewer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setEditingReview(null);
    setFormData({
      reviewer_name: "",
      rating: 5,
      comment: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      reviewer_name: review.reviewer_name,
      rating: review.rating,
      comment: review.comment,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

        const response = await fetch(`/api/reviews?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': authHeader,
          },
        });
        
        if (response.ok) {
          setReviews(reviews.filter(review => review.id !== id));
          alert("Review deleted successfully!");
        } else {
          alert("Failed to delete review.");
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert("An error occurred while deleting the review.");
      }
    }
  };

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authHeader = session?.access_token ? `Bearer ${session.access_token}` : '';

      if (editingReview) {
        // Update existing review
        const updatedReview = { ...editingReview, ...formData };
        const response = await fetch('/api/reviews', {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(updatedReview),
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(reviews.map(review => review.id === data.id ? data : review));
          alert("Review updated successfully!");
          setIsDialogOpen(false);
        } else {
          alert("Failed to update review.");
        }
      } else {
        // Add new review
        const newReview = {
          ...formData,
          date: new Date().toISOString().split('T')[0],
        };

        const response = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify(newReview),
        });

        if (response.ok) {
          const data = await response.json();
          setReviews([data, ...reviews]);
          alert("Review created successfully!");
          setIsDialogOpen(false);
        } else {
          alert("Failed to create review.");
        }
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert("An error occurred while saving the review.");
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
            Review Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage client testimonials and reviews
          </p>
        </div>
        <Button onClick={handleAddNew} size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Add New Review
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search reviews by name or comment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            Loading reviews...
          </p>
        ) : filteredReviews.length === 0 ? (
          <p className="text-muted-foreground col-span-full text-center py-12">
            No reviews found.
          </p>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{review.reviewer_name}</h3>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {review.date}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-4">
                  {review.comment}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(review)}
                    className="flex-1 gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingReview ? "Edit Review" : "Create New Review"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reviewer_name">Reviewer Name</Label>
              <Input
                id="reviewer_name"
                value={formData.reviewer_name}
                onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                placeholder="Enter reviewer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-24"
                />
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 cursor-pointer ${
                        i < formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Review Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Write the review comment..."
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingReview ? "Update" : "Create"} Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
