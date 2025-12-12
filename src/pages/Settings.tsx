import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Save 
} from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-12">
        <div className="container px-6 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-1">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account and application preferences
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Section */}
            <section className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Your personal information
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue="John Doe"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@agency.com"
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue="Admin"
                    disabled
                    className="bg-secondary/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    defaultValue="AuditFlow Agency"
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            </section>

            {/* Notifications Section */}
            <section className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    Notifications
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    How you receive alerts and updates
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Audit Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a new audit is submitted
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Client Approvals</p>
                    <p className="text-sm text-muted-foreground">
                      Alerts when clients approve or reject content
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly summary reports
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="rounded-xl bg-card border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Password and authentication settings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="bg-secondary/50 max-w-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-secondary/50 max-w-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-secondary/50 max-w-sm"
                  />
                </div>
              </div>
            </section>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button variant="hero" className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
