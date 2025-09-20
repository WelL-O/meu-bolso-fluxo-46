import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Receipt, 
  Target, 
  CreditCard, 
  BarChart3, 
  Settings,
  RefreshCw,
  PieChart
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { 
    title: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
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
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        "hidden lg:block", // Hide on mobile, show on desktop
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">₹</span>
            </div>
            <span className="font-semibold text-lg">FinanceApp</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label={isCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
        >
          <svg
            className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                active 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 flex-shrink-0",
                  active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} 
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{item.title}</div>
                  <div className={cn(
                    "text-xs opacity-75 truncate",
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <div>v1.0.0</div>
            <div className="mt-1">Controle Financeiro</div>
          </div>
        </div>
      )}
    </aside>
  );
}