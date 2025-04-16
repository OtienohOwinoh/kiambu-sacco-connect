
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  CreditCard,
  PiggyBank,
  Landmark,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";

interface SidebarNavProps {
  isMobile?: boolean;
}

export function SidebarNav({ isMobile }: SidebarNavProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const NavItem = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => {
    const isActive = location.pathname === href;

    return (
      <Link
        to={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{children}</span>
      </Link>
    );
  };

  return (
    <Sidebar className="border-r shadow-sm">
      <SidebarHeader className="py-6 px-6 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Landmark className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Universal Unit</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">SACCO Connect</p>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <div className="space-y-1 py-2">
          <NavItem href="/" icon={Home}>
            Dashboard
          </NavItem>
          <NavItem href="/deposits" icon={PiggyBank}>
            Deposits & Contributions
          </NavItem>
          <NavItem href="/loans" icon={CreditCard}>
            Loans
          </NavItem>
          <NavItem href="/loan-application" icon={CreditCard}>
            Apply for Loan
          </NavItem>
          <NavItem href="/performance" icon={BarChart3}>
            SACCO Performance
          </NavItem>
          <NavItem href="/notifications" icon={Bell}>
            Notifications
          </NavItem>
          <NavItem href="/help" icon={HelpCircle}>
            Help & Support
          </NavItem>
          <NavItem href="/settings" icon={Settings}>
            Settings
          </NavItem>
        </div>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
