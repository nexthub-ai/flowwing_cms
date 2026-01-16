'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/authSlice';
import { useEffect, useState } from 'react';

interface HeaderProps {
  variant?: 'public' | 'internal';
}

export function Header({ variant = 'public' }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const user = useAppSelector(selectUser);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="FlowWing Logo"
            width={32}
            height={32}
            className="transition-transform group-hover:scale-105"
          />
          <span className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            FlowWing
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          )}

          {/* Auth Buttons (for public pages) */}
          {variant === 'public' && !user && (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Dashboard Link (for logged in users on public pages) */}
          {variant === 'public' && user && (
            <Link href="/dashboard">
              <Button size="sm">
                Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
