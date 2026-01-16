'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import {
  LayoutDashboard, FileText, Users, LogOut,
  PenTool, ClipboardCheck, UsersRound, Moon, Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser, selectRoles, signOut } from "@/store/slices/authSlice";
import { useTheme } from "next-themes";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Content", href: "/content", icon: FileText, roles: ["admin", "pms"] as const },
  { label: "Clients", href: "/clients", icon: Users, roles: ["admin", "pms"] as const },
  { label: "Team", href: "/team", icon: UsersRound, roles: ["admin", "pms"] as const },
  { label: "My Tasks", href: "/my-tasks", icon: PenTool, roles: ["creator"] as const },
  { label: "Audit Management", href: "/audit-management", icon: ClipboardCheck, roles: ["admin", "pms"] as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const roles = useAppSelector(selectRoles);
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    await dispatch(signOut());
    router.push('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const hasRole = (role: string) => {
    return roles.includes(role as any);
  };

  const visibleNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => hasRole(role));
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/logo.svg" 
              alt="FlowWing Logo" 
              width={32} 
              height={32} 
              className="transition-transform object-cover group-hover:scale-105"
            />
            <span className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              FlowWing
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        {user && (
          <div className="border-t border-border p-4">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                {roles.includes('admin') ? 'Administrator' : roles.join(', ')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 justify-start gap-3"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="shrink-0"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
