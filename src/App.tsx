import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoalsProvider } from "@/contexts/GoalsContext";
import { Layout } from "./components/layout/Layout";
import { ComingSoon } from "./components/layout/ComingSoon";
import Dashboard from "./pages/Index";
import Transactions from "./pages/Transactions";
import Goals from "./pages/Goals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GoalsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="goals" element={<Goals />} />
              <Route
                path="cards"
                element={
                  <ComingSoon
                    title="Cartões de Crédito"
                    description="Gerencie seus cartões de crédito, limites e faturas."
                    icon="💳"
                  />
                }
              />
              <Route
                path="recurring"
                element={
                  <ComingSoon
                    title="Transações Recorrentes"
                    description="Configure e gerencie suas receitas e despesas recorrentes."
                    icon="🔄"
                  />
                }
              />
              <Route
                path="budgets"
                element={
                  <ComingSoon
                    title="Orçamentos"
                    description="Crie e monitore orçamentos por categoria."
                    icon="📊"
                  />
                }
              />
              <Route
                path="reports"
                element={
                  <ComingSoon
                    title="Relatórios"
                    description="Visualize relatórios detalhados de suas finanças."
                    icon="📈"
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <ComingSoon
                    title="Configurações"
                    description="Personalize a aplicação conforme suas preferências."
                    icon="⚙️"
                  />
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GoalsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
