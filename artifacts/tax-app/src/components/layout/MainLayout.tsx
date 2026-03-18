import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      <Sidebar 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        {/* Mobile Header */}
        <header className="md:hidden flex items-center h-16 px-4 border-b bg-card sticky top-0 z-20">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="-ml-2">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-2 font-display font-bold text-lg text-primary flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs">T</div>
            TaxReport
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden animate-in fade-in duration-500 slide-in-from-bottom-4">
          {children}
        </main>
      </div>
    </div>
  );
}
