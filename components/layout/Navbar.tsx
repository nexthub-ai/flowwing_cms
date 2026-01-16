'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import {
  Zap, LayoutDashboard, FileText, Users, Settings, LogOut, LogIn,
  PenTool, Wand2, GitBranch, UserCog, ClipboardCheck, Moon, Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, selectRoles, signOut } from "@/store/slices/authSlice";
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Audit Management", href: "/audit-management", icon: FileText, roles: ["admin", "pms"] as const },
  { label: "Admin", href: "/admin", icon: UserCog, roles: ["admin"] as const },
];

interface NavbarProps {
  showAuth?: boolean;
}

export function Navbar({ showAuth = true }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const roles = useAppSelector(selectRoles);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await dispatch(signOut());
    router.push('/');
  };

  const hasRole = (role: string) => {
    return roles.includes(role as any);
  };

  const visibleNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => hasRole(role));
  });

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300",
      isScrolled 
        ? "border-border/50 bg-background/80 backdrop-blur-xl" 
        : "border-border/10 bg-transparent backdrop-blur-sm"
    )}>
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.svg" 
              alt="FlowWing Logo" 
              width={48} 
              height={48} 
              className="transition-transform object-cover group-hover:scale-105"
            />
            <span className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              FlowWing
            </span>
          </Link>

          {showAuth && user && (
            <div className="hidden lg:flex items-center gap-1">
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2",
                        isActive && "bg-secondary text-primary"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}

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

            {!showAuth && (
              <Link href="/audit/start">
                <Button variant="hero" size="sm">
                  Start Audit
                </Button>
              </Link>
            )}
            {showAuth && (
              user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="hero" size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
