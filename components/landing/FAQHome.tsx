'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is Flow Wing?",
    answer: "Flow Wing is an AI-driven social media automation service that helps businesses create, plan, and post content consistently across multiple platforms."
  },
  {
    question: "How does Sully work?",
    answer: "Sully is your AI Wingman that studies your niche, learns your brand voice, and generates content ideas, briefs, and scripts tailored to your needs."
  },
  {
    question: "Which platforms are supported?",
    answer: "Flow Wing supports Instagram, Facebook, LinkedIn, WhatsApp, and Facebook Messenger for content posting and DM automation."
  },
  {
    question: "Can I customize the AI-generated content?",
    answer: "Absolutely! You can review, edit, and approve all content drafts before they go live. You maintain full control over what gets posted."
  },
  {
    question: "Is there a free trial?",
    answer: "Contact us for a demo to see Flow Wing in action and learn about available trial options for your business."
  },
  {
    question: "How secure is my data?",
    answer: "We take security seriously. All your data is encrypted and stored securely, and we never share your information with third parties."
  }
];

export function FAQHome() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Clearing the Skies:
            </h2>
            <p className="text-2xl text-muted-foreground">
              Flow Wing FAQ's
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-primary/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-lg pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
