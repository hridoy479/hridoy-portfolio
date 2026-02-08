"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react"; // For star icons

interface Review {
  id: number;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

const reviews: Review[] = [
  {
    id: 1,
    reviewerName: "Alice Wonderland",
    rating: 5,
    comment:
      "Absolutely phenomenal work! Hridoy transformed our vision into a stunning reality. Professional, communicative, and incredibly talented. Highly recommend!",
    date: "Jan 15, 2026",
  },
  {
    id: 2,
    reviewerName: "Bob The Builder",
    rating: 4,
    comment:
      "Great attention to detail and delivered the project on time. There were a few minor adjustments needed, but overall a solid experience.",
    date: "Feb 01, 2026",
  },
  {
    id: 3,
    reviewerName: "Charlie Chaplin",
    rating: 5,
    comment:
      "Working with Hridoy was a delight. The UI/UX design exceeded my expectations, and the coding was super clean. Will definitely collaborate again!",
    date: "Dec 20, 2025",
  },
  {
    id: 4,
    reviewerName: "Diana Prince",
    rating: 5,
    comment:
      "Hridoy is a true artist in web development. The site is not just functional but also beautiful and user-friendly. Five stars!",
    date: "Nov 10, 2025",
  },
  {
    id: 5,
    reviewerName: "Eve Harrington",
    rating: 4,
    comment:
      "Responsive and skilled. The final product was very good, although communication could have been slightly more frequent at times. Still, a positive outcome.",
    date: "Oct 25, 2025",
  },
  {
    id: 6,
    reviewerName: "Frank Sinatra",
    rating: 5,
    comment:
      "Simply the best! Hridoy captured the essence of what I wanted perfectly. A seamless process from start to finish.",
    date: "Sep 05, 2025",
  },
];

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
                  {review.reviewerName}
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