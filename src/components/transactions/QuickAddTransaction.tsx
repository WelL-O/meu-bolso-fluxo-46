import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { applyCurrencyMask, validateTransaction, generateId } from '@/lib/utils';
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
        return;
      }

      const fullTransaction: Transaction = {
        ...transaction,
        id: generateId(),
        createdAt: new Date().toISOString(),
      } as Transaction;

      const transactions = loadTransactions();
      transactions.unshift(fullTransaction);
      saveTransactions(transactions);

      toast({
        title: "Transação adicionada!",
        description: `${isIncome ? 'Receita' : 'Despesa'} de ${amount} cadastrada com sucesso.`,
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
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a transação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="flex items-center justify-between">
            <Label htmlFor="transaction-type">Tipo da transação</Label>
            <div className="flex items-center space-x-2">
              <span className={!isIncome ? 'text-foreground' : 'text-muted-foreground'}>
                Despesa
              </span>
              <Switch
                id="transaction-type"
                checked={isIncome}
                onCheckedChange={setIsIncome}
              />
              <span className={isIncome ? 'text-foreground' : 'text-muted-foreground'}>
                Receita
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0,00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-lg font-semibold"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Compra no supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    <span className="flex items-center space-x-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className={isIncome ? 'btn-income' : 'btn-expense'}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}