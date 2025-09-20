import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Receipt,
  Target,
  Plus,
  Settings
} from 'lucide-react';

interface BottomNavigationProps {
  onQuickAdd: () => void;
}

const navItems = [
  { 
    title: 'Início', 
    href: '/', 
    icon: Home 
  },
  { 
    title: 'Transações', 
    href: '/transactions', 
    icon: Receipt 
  },
  { 
    title: 'Metas', 
    href: '/goals', 
    icon: Target 
  },
  {
    title: 'Config',
    href: '/settings',
    icon: Settings
  },
];

export function BottomNavigation({ onQuickAdd }: BottomNavigationProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border md:hidden z-50 mobile-safe-bottom">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center mobile-touch-target rounded-xl transition-all duration-200 active:scale-95",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="mobile-icon-base mb-1" />
                <span className="mobile-text-xs font-medium truncate">{item.title}</span>
              </NavLink>
            );
          })}

          {/* Central FAB */}
          <button
            onClick={onQuickAdd}
            className="bg-primary hover:bg-primary/90 active:bg-primary/80 rounded-full mobile-touch-target-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200"
            aria-label="Nova transação"
          >
            <Plus className="mobile-icon-base text-primary-foreground" />
          </button>

          {navItems.slice(2).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center mobile-touch-target rounded-xl transition-all duration-200 active:scale-95",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="mobile-icon-base mb-1" />
                <span className="mobile-text-xs font-medium truncate">{item.title}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Safe area spacer for mobile */}
      <div className="h-20 md:hidden" />
    </>
  );
}