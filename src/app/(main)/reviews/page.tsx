"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import LoadingSpinner from '@/components/LoadingSpinner';

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading reviews..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-extrabold tracking-tight text-center mb-12">
        What My Clients Say
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <Card key={review.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-xl font-semibold">
                  {review.reviewer_name}
                </CardTitle>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-muted-foreground">{review.date}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-foreground leading-relaxed">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}