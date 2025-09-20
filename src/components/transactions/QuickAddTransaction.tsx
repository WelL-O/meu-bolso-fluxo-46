import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { applyCurrencyMask, validateTransaction, generateId, cn } from '@/lib/utils';
import { loadSettings, loadTransactions, saveTransactions } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import type { Transaction } from '@/types/finance';

interface QuickAddTransactionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAddTransaction({ open, onOpenChange }: QuickAddTransactionProps) {
  const { toast } = useToast();
  const [isIncome, setIsIncome] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = loadSettings();
  const categories = settings.categories.filter(cat =>
    cat.type === (isIncome ? 'income' : 'expense') || cat.type === 'both'
  );

  const handleAmountChange = (value: string) => {
    const masked = applyCurrencyMask(value);
    setAmount(masked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const numericAmount = Number(amount.replace(/[^\d,-]/g, '').replace(',', '.'));

      const transaction: Partial<Transaction> = {
        type: isIncome ? 'income' : 'expense',
        amount: numericAmount,
        description: description.trim(),
        category,
        date: new Date().toISOString(),
      };

      const errors = validateTransaction(transaction);
      if (errors.length > 0) {
        toast({
          title: "Erro de validação",
          description: errors.join(', '),
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Simulate a small delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 500));

      const fullTransaction: Transaction = {
        ...transaction,
        id: generateId(),
        createdAt: new Date().toISOString(),
      } as Transaction;

      const transactions = loadTransactions();
      transactions.unshift(fullTransaction);
      saveTransactions(transactions);

      toast({
        title: "✅ Transação adicionada!",
        description: `${isIncome ? 'Receita' : 'Despesa'} de ${amount} cadastrada com sucesso.`,
        duration: 3000,
      });

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('');
      setIsIncome(false);
      onOpenChange(false);

      // Refresh page data
      window.dispatchEvent(new CustomEvent('transactionAdded'));
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "❌ Erro",
        description: "Não foi possível adicionar a transação. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="mobile-text-lg md:text-xl">Nova Transação</span>
            <span className="mobile-text-lg">💰</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Toggle */}
          <div className="mobile-card bg-muted/30 p-4 rounded-xl">
            <Label htmlFor="transaction-type" className="mobile-text-base font-semibold text-foreground mb-3 block">
              Tipo da transação
            </Label>
            <div className="flex items-center justify-center gap-4">
              <div className={cn(
                "flex-1 text-center py-3 px-4 rounded-xl transition-all duration-200",
                !isIncome ? "bg-red-500/10 text-red-400 border border-red-500/20" : "text-muted-foreground hover:bg-muted/50"
              )}>
                <div className="mobile-text-sm font-medium">📉 Despesa</div>
              </div>
              <Switch
                id="transaction-type"
                checked={isIncome}
                onCheckedChange={setIsIncome}
                className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
              />
              <div className={cn(
                "flex-1 text-center py-3 px-4 rounded-xl transition-all duration-200",
                isIncome ? "bg-green-500/10 text-green-400 border border-green-500/20" : "text-muted-foreground hover:bg-muted/50"
              )}>
                <div className="mobile-text-sm font-medium">📈 Receita</div>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <Label htmlFor="amount" className="mobile-text-base font-semibold text-foreground">
              Valor
            </Label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 mobile-text-xl font-bold text-muted-foreground">
                R$
              </div>
              <Input
                id="amount"
                type="text"
                placeholder="0,00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className={cn(
                  "mobile-input pl-12 mobile-text-xl font-bold text-center",
                  isIncome ? "border-green-500/30 focus:border-green-500" : "border-red-500/30 focus:border-red-500"
                )}
                required
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-3">
            <Label htmlFor="description" className="mobile-text-base font-semibold text-foreground">
              Descrição
            </Label>
            <Input
              id="description"
              placeholder="Ex: Compra no supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mobile-input"
              required
            />
          </div>

          {/* Category Select */}
          <div className="space-y-3">
            <Label htmlFor="category" className="mobile-text-base font-semibold text-foreground">
              Categoria
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="mobile-input">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <div className="flex items-center gap-3">
                      <span className="mobile-text-base">{cat.icon}</span>
                      <span className="mobile-text-base">{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mobile-button w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className={cn(
                "mobile-button w-full sm:w-auto font-semibold transition-all duration-200",
                isIncome
                  ? "bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25"
                  : "bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Adicionar</span>
                  <span>{isIncome ? '✓' : '+'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}