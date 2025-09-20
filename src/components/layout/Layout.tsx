import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { cn } from '@/lib/utils';
import { QuickAddTransaction } from '@/components/transactions/QuickAddTransaction';
import { FloatingActionButton } from '@/components/ui/floating-action-button';

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      <div 
        className={cn(
          "transition-all duration-300",
          // Only apply margin on desktop
          "lg:ml-64",
          sidebarCollapsed && "lg:ml-16"
        )}
      >
        <Header 
          onToggleSidebar={toggleSidebar}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />
        
        <main className="p-4 lg:p-6 pb-20 md:pb-4">
          <Outlet />
        </main>
      </div>

      <QuickAddTransaction 
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation onQuickAdd={() => setQuickAddOpen(true)} />
      
      {/* Desktop FAB (hidden on mobile) */}
      <div className="hidden md:block">
        <FloatingActionButton onClick={() => setQuickAddOpen(true)} />
      </div>
    </div>
  );
}