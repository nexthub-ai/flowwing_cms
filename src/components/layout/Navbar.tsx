import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, FileText, Users, Settings, LogOut, LogIn, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Content", href: "/content", icon: PenTool },
  { label: "Audits", href: "/audits", icon: FileText },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              AuditFlow
            </span>
          </Link>

          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant="ghost"
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

          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/pricing">
                <Button variant="ghost" size="sm">
                  Pricing
                </Button>
              </Link>
            )}
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
