'use client';

import { Instagram, MessageCircle, Facebook } from "lucide-react";

const integrations = [
  {
    icon: Instagram,
    title: "Instagram DMs",
    description: "Automatically craft and send personalized replies, lead magnets, or story follow-ups using AI—turning every message into a potential sale or engagement."
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Use smart AI replies to manage inquiries, follow-ups, and promotions in WhatsApp. Learn from past chats to get better with every interaction—24/7."
  },
  {
    icon: Facebook,
    title: "Facebook Messenger",
    description: "Automate frequently asked responses, capture leads, and guide customers through your offer—all within a familiar Messenger experience."
  }
];

export function IntegrationsHome() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Integrations
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect with your favorite platforms
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <integration.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{integration.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
