'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroHome() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      
      <div className="container relative z-10 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/flowwing-home-logo.png"
              alt="Flow Wing Logo"
              width={180}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Heading */}
          <div className="space-y-6">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              Get Clear Content
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Diagnosis
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Understand what's blocking growth, what works, and what needs fixing —
              <span className="text-foreground/90"> with actionable insights delivered in 48 hours.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/audit/start" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-medium group"
              >
                Start Your Audit — $100
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#demo" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto px-8 h-12 text-base font-medium"
              >
                See Content Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
