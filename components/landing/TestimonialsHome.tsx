'use client';

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const testimonial = {
  name: "Floyd Miles",
  role: "Designer",
  content: "I used to spend hours every week stuck on social media content. Now I plan and schedule everything in one sitting—without losing my brand voice.",
  rating: 5
};

export function TestimonialsHome() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Clients Testimonial
            </h2>
            <p className="text-xl text-muted-foreground">
              Streamline Your Social Workflow
            </p>
            <p className="text-muted-foreground mt-2">
              Businesses use chatbots for various purposes, including customer service marketing, sales
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                {testimonial.content}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20" />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link href="#testimonials">
                <Button variant="outline" size="lg">
                  View More
                </Button>
              </Link>
            </div>
          </div>

          {/* Trusted Partners */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold mb-8">Trusted Partners</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-32 h-12 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
