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
      {/* Sidebar - Desktop Only */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          // Mobile-first: no margin, then desktop margins
          "lg:ml-72", // Default expanded sidebar width
          sidebarCollapsed && "lg:ml-20" // Collapsed sidebar width
        )}
      >
        {/* Header */}
        <Header
          onToggleSidebar={toggleSidebar}
          onOpenQuickAdd={() => setQuickAddOpen(true)}
        />

        {/* Main Content */}
        <main className="mobile-container mobile-safe-bottom min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Modals and Overlays */}
      <QuickAddTransaction
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />

      {/* Mobile Navigation - Only visible on mobile */}
      <BottomNavigation onQuickAdd={() => setQuickAddOpen(true)} />

      {/* Desktop FAB - Only visible on desktop */}
      <div className="hidden md:block">
        <FloatingActionButton onClick={() => setQuickAddOpen(true)} />
      </div>
    </div>
  );
}