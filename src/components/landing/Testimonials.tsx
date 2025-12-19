import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechFlow",
    content: "AuditFlow transformed our social strategy. We saw a 340% increase in engagement within 3 months. The insights were incredibly actionable.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Founder & CEO",
    company: "StartupLab",
    content: "Best investment we made for our brand. The audit identified blind spots we never knew existed. Our content now resonates so much better.",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Social Media Manager",
    company: "GlobalBrands",
    content: "The competitor analysis alone was worth it. We completely revamped our posting schedule and saw immediate results. Highly recommend!",
    avatar: "ER",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Content Creator",
    company: "CreativeHouse",
    content: "As a creator, understanding my audience better changed everything. The demographic breakdown helped me create content that actually converts.",
    avatar: "DP",
    rating: 5,
  },
  {
    name: "Amanda Foster",
    role: "Brand Strategist",
    company: "AgencyX",
    content: "We use AuditFlow for all our clients now. It saves us hours of manual research and delivers better insights than we could compile ourselves.",
    avatar: "AF",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "E-commerce Owner",
    company: "ShopDirect",
    content: "The ROI was instant. After implementing the quick wins from the audit, our social-driven sales increased by 180% in the first month.",
    avatar: "JW",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-sm text-success mb-6">
            <Star className="h-4 w-4 fill-success" />
            <span>Trusted by 500+ brands</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Loved by Marketing Teams
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See why leading brands and creators trust AuditFlow for their social media insights
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="group relative p-6 rounded-xl bg-card border border-border/50 card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
