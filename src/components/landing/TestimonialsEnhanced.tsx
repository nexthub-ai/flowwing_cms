import { useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const testimonials = [
  {
    name: "DANIEL OKONOKHUA",
    role: "Founder, Dan Web Develop",
    avatar: "DO",
    rating: 5,
    content: "As a social media professional and content strategist, this platform has completely transformed how I manage my clients. The AI suggestions are incredibly accurate and save me hours every week.",
    expanded: false,
  },
  {
    name: "JASON SCHOULTZ",
    role: "Khwezi Holdings (Pty) Ltd",
    avatar: "JS",
    rating: 5,
    content: "This platform has truly revolutionized our social media workflow. The scheduling features and team collaboration tools have made our content production 10x more efficient.",
    expanded: false,
  },
  {
    name: "RAHIM HIRJI",
    role: "Founder - Box of Amazing",
    avatar: "RH",
    rating: 5,
    content: "I have been writing my newsletter (Box of Amazing) for eight years covering emerging technology and trends, going from 0 to 50,000 subscribers. This tool helped me repurpose that content across all social platforms effortlessly.",
    expanded: false,
  },
  {
    name: "LEBORAH M SPENCER",
    role: "Inner Wellness Consultant",
    avatar: "LM",
    rating: 5,
    content: "My name is Leborah M Spencer and I've been using this platform for my wellness coaching business. The content templates and AI writing assistant have helped me maintain a consistent brand voice across all channels.",
    expanded: false,
  },
  {
    name: "MARCUS CHEN",
    role: "CEO, TechStartup Inc",
    avatar: "MC",
    rating: 5,
    content: "We switched from three different tools to just this one platform. The ROI was immediate - our social engagement increased by 340% in the first quarter alone.",
    expanded: false,
  },
  {
    name: "AMANDA FOSTER",
    role: "Agency Director",
    avatar: "AF",
    rating: 5,
    content: "Managing 15 client accounts used to be a nightmare. Now with the multi-workspace feature and approval workflows, my team can handle twice the workload with half the stress.",
    expanded: false,
  },
];

export function TestimonialsEnhanced() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied content creators and marketing teams
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className={`text-sm text-muted-foreground leading-relaxed ${
                expandedIndex === index ? "" : "line-clamp-3"
              }`}>
                {testimonial.content}
              </p>

              {/* Show more/less */}
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="flex items-center gap-1 mt-3 text-primary text-sm font-medium hover:underline"
              >
                {expandedIndex === index ? (
                  <>
                    show less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    show more <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
