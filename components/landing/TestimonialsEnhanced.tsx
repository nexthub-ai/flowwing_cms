'use client';

import { useEffect, useRef, useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

const testimonials = [
  {
    name: "DANIEL OKONOKHUA",
    role: "Founder, Dan Web Develop",
    avatar: "DO",
    rating: 5,
    content: "The brand audit revealed critical gaps in my online presence I hadn't noticed. The detailed analysis and actionable recommendations helped me reposition my agency and attract better clients within weeks.",
  },
  {
    name: "JASON SCHOULTZ",
    role: "Khwezi Holdings (Pty) Ltd",
    avatar: "JS",
    rating: 5,
    content: "This audit gave us clarity on our brand messaging across platforms. The competitor benchmarking section was eye-opening and helped us differentiate ourselves in a crowded market.",
  },
  {
    name: "RAHIM HIRJI",
    role: "Founder - Box of Amazing",
    avatar: "RH",
    rating: 5,
    content: "After building my newsletter to 50,000 subscribers, I wanted to strengthen my personal brand. The audit identified untapped opportunities and gave me a clear roadmap to increase my influence across all channels.",
  },
  {
    name: "LEBORAH M SPENCER",
    role: "Inner Wellness Consultant",
    avatar: "LM",
    rating: 5,
    content: "The personal brand audit transformed how I present my wellness coaching business. The insights on visual consistency and messaging helped me attract my ideal clients and establish real authority in my niche.",
  },
  {
    name: "MARCUS CHEN",
    role: "CEO, TechStartup Inc",
    avatar: "MC",
    rating: 5,
    content: "We invested in this audit before launching our Series A campaign. The brand score and detailed feedback helped us polish our founder's LinkedIn presence, resulting in 3x more investor inquiries.",
  },
  {
    name: "AMANDA FOSTER",
    role: "Agency Director",
    avatar: "AF",
    rating: 5,
    content: "I now recommend this brand audit to all my clients before we start any social media work. It provides the foundation we need to create authentic, strategic content that actually resonates with their audience.",
  },
];

// Duplicate for seamless loop
const duplicatedTestimonials = [...testimonials, ...testimonials];

export function TestimonialsEnhanced() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || isPaused) return;

    let animationId: number;
    let scrollPosition = scrollContainer.scrollLeft;
    const speed = 0.3;

    const animate = () => {
      scrollPosition += speed;
      
      // Reset position when we've scrolled through first set
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPaused]);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who've transformed their personal brand with our comprehensive audit
          </p>
        </div>

        {/* Auto-scrolling Testimonials */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-hidden pb-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedTestimonials.map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="flex-shrink-0 w-80 group relative p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
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
