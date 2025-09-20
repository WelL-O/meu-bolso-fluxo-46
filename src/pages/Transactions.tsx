import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SortSelect } from '@/components/ui/sort-select';
import { Search, Filter, Plus, Calendar, Download, X, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useFinanceData } from '@/hooks/useFinanceData';
import { useSortTransactions } from '@/hooks/useSortTransactions';
import { formatCurrency, formatDate, getCategoryIcon } from '@/lib/utils';
import { loadSettings } from '@/lib/storage';
import { QuickAddTransaction } from '@/components/transactions/QuickAddTransaction';
import type { Transaction } from '@/types/finance';

export default function Transactions() {
  const { transactions, isLoading } = useFinanceData();
  const settings = loadSettings();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  
  // Use the sorting hook
  const { sortedTransactions, sortBy, setSortBy } = useSortTransactions(transactions);

  // Filter transactions based on user inputs
  const filteredTransactions = useMemo(() => {
    let filtered = [...sortedTransactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    return filtered;
  }, [sortedTransactions, searchTerm, selectedType, selectedCategory]);

  // Calculate running balance efficiently
  const transactionsWithBalance = useMemo(() => {
    // First, sort all transactions by date (oldest first)
    const allTransactionsSorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate cumulative balance for all transactions
    const transactionsWithCumulativeBalance = new Map();
    let runningBalance = 0;

    allTransactionsSorted.forEach(transaction => {
      runningBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
      transactionsWithCumulativeBalance.set(transaction.id, runningBalance);
    });

    // Apply balance to filtered transactions and reverse to show newest first
    return [...filteredTransactions]
      .map(transaction => ({
        ...transaction,
        runningBalance: transactionsWithCumulativeBalance.get(transaction.id) || 0,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filteredTransactions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background mobile-container">
        <div className="space-y-6 animate-pulse">
          {/* Header skeleton */}
          <div className="space-y-2">
            <div className="h-7 bg-muted rounded-lg w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>

          {/* Summary cards skeleton */}
          <div className="mobile-grid-4 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="mobile-stats-compact bg-muted rounded-xl h-20" />
            ))}
          </div>

          {/* Filters skeleton */}
          <div className="mobile-card bg-muted rounded-xl h-32" />

          {/* Transactions list skeleton */}
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="mobile-card bg-muted rounded-xl h-16" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(transactions.map(t => t.category))];
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background mobile-safe-bottom">
      {/* Mobile-first header */}
      <div className="mobile-container mobile-section-spacing">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="mobile-title text-foreground">Transações</h1>
            <p className="mobile-text-sm text-muted-foreground">
              Gerencie suas receitas e despesas
            </p>
          </div>
          <Button
            className="mobile-button bg-primary hover:bg-primary/90 text-primary-foreground hidden md:flex"
            onClick={() => setQuickAddOpen(true)}
          >
            <Plus className="mobile-icon-sm mr-2" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mobile-container mobile-section-spacing">
        <div className="mobile-grid-4 lg:grid-cols-3">
          <div className="mobile-stats-compact bg-green-500/5 border-green-500/20 border rounded-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground">Total de Receitas</p>
              <div className="text-green-400">
                <TrendingUp className="mobile-icon-sm" />
              </div>
            </div>
            <p className="mobile-stats-value text-green-400 truncate">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="mobile-stats-compact bg-red-500/5 border-red-500/20 border rounded-xl hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground">Total de Despesas</p>
              <div className="text-red-400">
                <TrendingDown className="mobile-icon-sm" />
              </div>
            </div>
            <p className="mobile-stats-value text-red-400 truncate">
              {formatCurrency(totalExpenses)}
            </p>
          </div>

          <div className={`mobile-stats-compact ${
            totalIncome - totalExpenses >= 0 ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'
          } border rounded-xl hover:scale-105 transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <p className="mobile-stats-label text-muted-foreground">Saldo Líquido</p>
              <div className={totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'}>
                <Wallet className="mobile-icon-sm" />
              </div>
            </div>
            <p className={`mobile-stats-value ${
              totalIncome - totalExpenses >= 0 ? 'text-green-400' : 'text-red-400'
            } truncate`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mobile-container mobile-section-spacing">
        <Card className="mobile-card financial-card">
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 mobile-icon-sm text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mobile-input pl-10"
              />
            </div>

            {/* Filter row - stacked on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Type filter */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="mobile-input">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="mobile-icon-xs text-green-400" />
                      <span>Receitas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="mobile-icon-xs text-red-400" />
                      <span>Despesas</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Category filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="mobile-input">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center gap-2">
                        <span className="mobile-text-sm">{getCategoryIcon(category)}</span>
                        <span>{category}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <SortSelect
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: 'date-desc', label: 'Mais recentes' },
                  { value: 'date-asc', label: 'Mais antigas' },
                  { value: 'value-desc', label: 'Maior valor' },
                  { value: 'value-asc', label: 'Menor valor' },
                  { value: 'category', label: 'Por categoria' },
                  { value: 'type', label: 'Por tipo' }
                ]}
                className="mobile-input"
              />

              {/* Export */}
              <Button variant="outline" className="mobile-button">
                <Download className="mobile-icon-sm mr-2" />
                <span className="hidden sm:inline">Exportar</span>
                <span className="sm:hidden">CSV</span>
              </Button>
            </div>

            {/* Active filters chips */}
            {(selectedType !== 'all' || selectedCategory !== 'all' || searchTerm) && (
              <div className="flex gap-2 flex-wrap">
                {selectedType !== 'all' && (
                  <span className="bg-primary/10 text-primary px-3 py-2 rounded-xl mobile-text-xs flex items-center gap-2 border border-primary/20">
                    {selectedType === 'income' ? (
                      <>
                        <TrendingUp className="mobile-icon-xs" />
                        <span>Receitas</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="mobile-icon-xs" />
                        <span>Despesas</span>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedType('all')}
                      className="mobile-touch-target flex items-center justify-center w-4 h-4 hover:text-red-400 transition-colors"
                    >
                      <X className="mobile-icon-xs" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="bg-primary/10 text-primary px-3 py-2 rounded-xl mobile-text-xs flex items-center gap-2 border border-primary/20">
                    <span>{getCategoryIcon(selectedCategory)}</span>
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="mobile-touch-target flex items-center justify-center w-4 h-4 hover:text-red-400 transition-colors"
                    >
                      <X className="mobile-icon-xs" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-primary/10 text-primary px-3 py-2 rounded-xl mobile-text-xs flex items-center gap-2 border border-primary/20">
                    <Search className="mobile-icon-xs" />
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mobile-touch-target flex items-center justify-center w-4 h-4 hover:text-red-400 transition-colors"
                    >
                      <X className="mobile-icon-xs" />
                    </button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedCategory('all');
                    setSearchTerm('');
                  }}
                  className="mobile-text-xs text-muted-foreground hover:text-foreground underline mobile-touch-target"
                >
                  Limpar todos filtros
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {/* Transactions List */}
      <div className="mobile-container">
        <Card className="mobile-card financial-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="mobile-text-lg md:text-xl">
                {filteredTransactions.length} transação(ões)
              </span>
              {filteredTransactions.length > 0 && (
                <span className="mobile-text-xs text-muted-foreground">
                  {searchTerm || selectedType !== 'all' || selectedCategory !== 'all' ? 'filtradas' : 'no total'}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📝</span>
                <p className="mobile-text-base text-muted-foreground mb-2">Nenhuma transação encontrada</p>
                <p className="mobile-text-sm text-muted-foreground">
                  {searchTerm || selectedType !== 'all' || selectedCategory !== 'all'
                    ? 'Tente ajustar os filtros'
                    : 'Comece adicionando sua primeira transação'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {transactionsWithBalance.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="mobile-card hover:bg-muted/30 transition-all duration-200 active:scale-[0.98]"
                  >
                    {/* Mobile-first unified view */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`mobile-touch-target rounded-xl flex items-center justify-center ${
                          transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                        }`}>
                          <span className="mobile-text-lg">
                            {getCategoryIcon(transaction.category)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="mobile-text-base font-medium text-foreground truncate">
                              {transaction.description}
                            </h3>
                            <Badge
                              variant={transaction.type === 'income' ? 'default' : 'secondary'}
                              className="mobile-text-xs shrink-0"
                            >
                              {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                            </Badge>
                          </div>
                          <div className="mobile-text-xs text-muted-foreground">
                            {transaction.category} • {formatDate(transaction.date)}
                          </div>
                          {/* Show running balance on mobile for better context */}
                          <div className="mobile-text-xs text-muted-foreground mt-1 md:hidden">
                            Saldo após: {formatCurrency(transaction.runningBalance)}
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1 shrink-0">
                        <div className={`mobile-text-base font-bold ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </div>
                        {/* Show running balance on desktop */}
                        <div className="mobile-text-xs text-muted-foreground hidden md:block">
                          Saldo: {formatCurrency(transaction.runningBalance)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <QuickAddTransaction
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
      />

      {/* Extra spacing at bottom for mobile navigation */}
      <div className="h-24 md:h-8" />
    </div>
  );
}