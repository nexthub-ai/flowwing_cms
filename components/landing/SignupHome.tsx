'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight } from "lucide-react";

export function SignupHome() {
  return (
    <section id="demo" className="py-24 bg-secondary/30">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Sign Up Free */}
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-4">Sign Up Free</h3>
              <p className="text-muted-foreground mb-6">
                Start creating social-specific posts in seconds.
              </p>
              <form className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your message"
                    rows={4}
                    className="w-full"
                  />
                </div>
                <Button size="lg" className="w-full group">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </div>

            {/* Request Demo */}
            <div className="bg-card rounded-xl p-8 border border-border">
              <h3 className="text-2xl font-bold mb-4">Request a Demo</h3>
              <p className="text-muted-foreground mb-6">
                Want to see it in action? We'll walk you through how Flow Wing can automate your content for weeks in minutes.
              </p>
              <form className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your mail"
                    className="w-full"
                  />
                </div>
                <Button size="lg" variant="outline" className="w-full group">
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
