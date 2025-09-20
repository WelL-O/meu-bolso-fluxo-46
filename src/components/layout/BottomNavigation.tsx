import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Receipt, 
  Target, 
  Plus,
  Menu
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
    title: 'Mais', 
    href: '/settings', 
    icon: Menu 
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
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50 safe-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          // Add FAB in the middle
          if (index === 2) {
            return (
              <div key="fab-and-item" className="flex items-center space-x-8">
                {/* FAB */}
                <button
                  onClick={onQuickAdd}
                  className="bg-primary hover:bg-primary/90 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 no-tap-highlight"
                  aria-label="Nova transação"
                >
                  <Plus size={24} className="text-primary-foreground" />
                </button>
                
                {/* Navigation item */}
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center p-2 min-w-0 no-tap-highlight",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon size={20} />
                  <span className="text-[10px] mt-1 truncate">{item.title}</span>
                </NavLink>
              </div>
            );
          }
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center p-2 min-w-0 no-tap-highlight",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-1 truncate">{item.title}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}