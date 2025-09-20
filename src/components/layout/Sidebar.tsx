import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Receipt,
  Target,
  CreditCard,
  BarChart3,
  Settings,
  RefreshCw,
  PieChart,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: 'Início',
    href: '/',
    icon: Home,
    description: 'Visão geral das finanças'
  },
  { 
    title: 'Transações', 
    href: '/transactions', 
    icon: Receipt,
    description: 'Histórico e controle'
  },
  { 
    title: 'Metas', 
    href: '/goals', 
    icon: Target,
    description: 'Objetivos financeiros'
  },
  { 
    title: 'Cartões', 
    href: '/cards', 
    icon: CreditCard,
    description: 'Gestão de cartões'
  },
  { 
    title: 'Recorrentes', 
    href: '/recurring', 
    icon: RefreshCw,
    description: 'Transações automáticas'
  },
  { 
    title: 'Orçamentos', 
    href: '/budgets', 
    icon: PieChart,
    description: 'Controle de gastos'
  },
  { 
    title: 'Relatórios', 
    href: '/reports', 
    icon: BarChart3,
    description: 'Análises detalhadas'
  },
  { 
    title: 'Configurações', 
    href: '/settings', 
    icon: Settings,
    description: 'Preferências do app'
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card/95 backdrop-blur-md border-r border-border transition-all duration-300",
        "hidden lg:block", // Hide on mobile, show on desktop
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="mobile-touch-target-sm bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold mobile-text-base">💰</span>
            </div>
            <div>
              <span className="font-bold mobile-text-lg text-foreground">MeuBolso</span>
              <div className="mobile-text-xs text-muted-foreground">Controle Financeiro</div>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="mobile-touch-target-sm rounded-xl hover:bg-muted/80 active:bg-muted transition-all duration-200 active:scale-95"
          aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          <ChevronLeft
            className={cn(
              "mobile-icon-sm transition-transform duration-200",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-4 mobile-touch-target rounded-xl transition-all duration-200 group active:scale-95",
                active
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
                  : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon
                className={cn(
                  "mobile-icon-base flex-shrink-0 transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="mobile-text-base font-semibold truncate">
                    {item.title}
                  </div>
                  <div className={cn(
                    "mobile-text-xs opacity-80 truncate leading-tight",
                    active ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {item.description}
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50 bg-card/50">
          <div className="text-center">
            <div className="mobile-text-xs text-muted-foreground font-medium">
              Versão 1.0.0
            </div>
            <div className="mobile-text-xs text-muted-foreground/60 mt-1">
              © 2024 MeuBolso
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}