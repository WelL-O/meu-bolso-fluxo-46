import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoalsProvider } from "@/contexts/GoalsContext";
import { Layout } from "./components/layout/Layout";
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
              <Route path="cards" element={<div>Cards - Em construção</div>} />
              <Route path="recurring" element={<div>Recorrentes - Em construção</div>} />
              <Route path="budgets" element={<div>Orçamentos - Em construção</div>} />
              <Route path="reports" element={<div>Relatórios - Em construção</div>} />
              <Route path="settings" element={<div>Configurações - Em construção</div>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GoalsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
