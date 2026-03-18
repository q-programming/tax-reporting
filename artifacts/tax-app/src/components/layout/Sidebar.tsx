import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ReceiptText, 
  Menu, 
  Settings, 
  LogOut, 
  UserCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const [location] = useLocation();
  const { toast } = useToast();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location, setIsMobileOpen]);

  const handleAction = (action: string) => {
    toast({
      title: `${action} Clicked`,
      description: "This is a mock action for demonstration.",
    });
  };

  const navItems = [
    { label: "Tax Summary", path: "/tax-summary", icon: LayoutDashboard },
    { label: "Tax Transactions", path: "/tax-transactions", icon: ReceiptText },
  ];

  const sidebarClasses = cn(
    "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
    isCollapsed ? "w-[72px]" : "w-[260px]",
    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Toggle Button for Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent hover:text-accent-foreground z-50 transition-transform"
          style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <Menu className="h-3.5 w-3.5" />
        </button>

        {/* User Profile Area */}
        <div className="p-4 border-b border-sidebar-border flex items-center min-h-[73px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center w-full gap-3 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-left",
                isCollapsed ? "justify-center p-1" : "p-2"
              )}>
                <Avatar className="h-9 w-9 shrink-0 border-2 border-primary/10">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" alt="John Anderson" />
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                
                {!isCollapsed && (
                  <div className="flex flex-col flex-1 overflow-hidden animate-in fade-in duration-300">
                    <span className="text-sm font-semibold truncate leading-tight">John Anderson</span>
                    <span className="text-xs text-muted-foreground truncate">john@example.com</span>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="right" sideOffset={16}>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('Profile Settings')}>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Account Preferences')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('Logout')} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || (location === "/" && item.path === "/tax-summary");
            
            return (
              <Link key={item.path} href={item.path} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed ? "justify-center" : "justify-start"
              )}>
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                
                {!isCollapsed && (
                  <span className="text-sm font-medium animate-in fade-in duration-300">
                    {item.label}
                  </span>
                )}
                
                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-foreground text-background text-xs font-medium rounded opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Logo or Branding (Optional) */}
        {!isCollapsed && (
          <div className="p-4 mt-auto border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-primary font-bold text-lg px-2">
              <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">
                T
              </div>
              <span className="font-display">TaxReport</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
