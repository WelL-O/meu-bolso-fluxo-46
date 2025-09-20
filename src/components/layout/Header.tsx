import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Plus,
  Search,
  Bell,
  User,
  Menu,
  Moon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenQuickAdd: () => void;
}

export function Header({ onToggleSidebar, onOpenQuickAdd }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex h-16 bg-card/95 backdrop-blur-md border-b border-border/50 px-6 items-center justify-between sticky top-0 z-30">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden mobile-touch-target-sm rounded-xl hover:bg-muted/80 active:bg-muted transition-all duration-200 active:scale-95"
          >
            <Menu className="mobile-icon-sm" />
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 mobile-icon-sm text-muted-foreground" />
            <Input
              placeholder="Buscar transações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-input pl-10 w-80 bg-background/50"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Quick Add Button */}
          <Button
            onClick={onOpenQuickAdd}
            className="mobile-button bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
          >
            <Plus className="mobile-icon-sm mr-2" />
            <span>Nova Transação</span>
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            className="mobile-touch-target-sm rounded-xl hover:bg-muted/80 active:bg-muted transition-all duration-200 active:scale-95 relative"
          >
            <Bell className="mobile-icon-sm" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="mobile-text-xs text-white font-bold">2</span>
            </span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="mobile-touch-target-sm rounded-xl hover:bg-muted/80 active:bg-muted transition-all duration-200 active:scale-95"
              >
                <User className="mobile-icon-sm" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mobile-card">
              <div className="p-3">
                <p className="mobile-text-base font-semibold text-foreground">Usuário</p>
                <p className="mobile-text-sm text-muted-foreground">usuario@email.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="mobile-touch-target-sm rounded-xl">
                <User className="mr-3 mobile-icon-sm" />
                <span className="mobile-text-base">Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="mobile-touch-target-sm rounded-xl">
                <Moon className="mr-3 mobile-icon-sm" />
                <span className="mobile-text-base">Modo Escuro</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="mobile-touch-target-sm rounded-xl text-red-600 hover:bg-red-500/10 hover:text-red-600">
                <span className="mobile-text-base font-medium">Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-30">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="mobile-touch-target-sm bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold mobile-text-base">💰</span>
              </div>
              <div>
                <h1 className="mobile-text-lg font-bold text-foreground">MeuBolso</h1>
                <p className="mobile-text-xs text-muted-foreground">Controle Financeiro</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="mobile-touch-target-sm rounded-xl hover:bg-muted/80 active:bg-muted transition-all duration-200 active:scale-95 relative"
              >
                <Bell className="mobile-icon-base" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="mobile-text-xs text-white font-bold">2</span>
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="mobile-touch-target-sm rounded-xl hover:bg-muted/80 active:bg-muted transition-all duration-200 active:scale-95"
                  >
                    <User className="mobile-icon-base" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mobile-card">
                  <div className="p-4">
                    <p className="mobile-text-base font-semibold text-foreground">Usuário</p>
                    <p className="mobile-text-sm text-muted-foreground">usuario@email.com</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="mobile-touch-target rounded-xl">
                    <User className="mr-3 mobile-icon-base" />
                    <span className="mobile-text-base">Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="mobile-touch-target rounded-xl">
                    <Moon className="mr-3 mobile-icon-base" />
                    <span className="mobile-text-base">Modo Escuro</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="mobile-touch-target rounded-xl text-red-600 hover:bg-red-500/10 hover:text-red-600">
                    <span className="mobile-text-base font-medium">Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}