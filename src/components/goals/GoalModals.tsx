import { useState } from 'react';
import { useGoals } from '@/contexts/GoalsContext';
import { X, Trash2, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function GoalModals() {
  const {
    selectedGoal,
    isDepositModalOpen,
    setIsDepositModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    depositToGoal,
    createGoal,
    deleteGoal
  } = useGoals();

  return (
    <>
      <DepositModal />
      <DetailsModal />
      <CreateModal />
    </>
  );

  function DepositModal() {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    
    const handleDeposit = () => {
      const numericValue = parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (numericValue > 0 && selectedGoal) {
        depositToGoal(selectedGoal.id, numericValue, description);
        setIsDepositModalOpen(false);
        setAmount('');
        setDescription('');
      }
    };
    
    if (!isDepositModalOpen || !selectedGoal) return null;
    
    const remaining = selectedGoal.targetAmount - selectedGoal.currentAmount;
    const suggestions = [
      Math.min(remaining * 0.1, remaining),
      Math.min(remaining * 0.25, remaining),
      Math.min(remaining * 0.5, remaining),
      remaining
    ].filter(v => v > 0);
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Depositar em {selectedGoal.icon} {selectedGoal.name}
            </h2>
            <button
              onClick={() => setIsDepositModalOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Valor do Depósito</Label>
              <Input
                id="amount"
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Economia do mês"
              />
            </div>
            
            <div>
              <Label>Sugestões:</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {suggestions.map((value, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => setAmount(formatCurrency(value).replace('R$ ', '').replace('.', ','))}
                    className="text-sm py-2"
                  >
                    {formatCurrency(value)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDepositModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={!amount || parseFloat(amount.replace(/[^\d.,]/g, '').replace(',', '.')) <= 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function DetailsModal() {
    if (!isDetailsModalOpen || !selectedGoal) return null;
    
    const progress = (selectedGoal.currentAmount / selectedGoal.targetAmount) * 100;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {selectedGoal.icon} {selectedGoal.name}
            </h2>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Progresso</p>
              <p className="text-2xl font-bold text-primary">
                {progress.toFixed(1)}%
              </p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-muted-foreground text-sm">Total Depositado</p>
              <p className="text-2xl font-bold text-green-500">
                {formatCurrency(selectedGoal.currentAmount)}
              </p>
            </div>
          </div>
          
          {/* Goal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-muted-foreground text-sm">Meta</p>
              <p className="text-lg font-bold">{formatCurrency(selectedGoal.targetAmount)}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Criada em</p>
              <p className="text-lg font-bold">{formatDate(selectedGoal.createdAt)}</p>
            </div>
            {selectedGoal.deadline && (
              <div>
                <p className="text-muted-foreground text-sm">Prazo</p>
                <p className="text-lg font-bold">{formatDate(selectedGoal.deadline)}</p>
              </div>
            )}
          </div>
          
          {/* History */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-3">Histórico de Depósitos</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {selectedGoal.history.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum depósito realizado ainda</p>
              ) : (
                selectedGoal.history
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(transaction => (
                    <div key={transaction.id} className="bg-muted p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <span className="text-foreground font-medium">
                          {formatDate(transaction.date)}
                        </span>
                        {transaction.description && (
                          <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        )}
                      </div>
                      <span className="text-green-500 font-bold">
                        + {formatCurrency(transaction.amount)}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (confirm('Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita.')) {
                  deleteGoal(selectedGoal.id);
                  setIsDetailsModalOpen(false);
                }
              }}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Excluir
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function CreateModal() {
    const [formData, setFormData] = useState({
      name: '',
      icon: '🎯',
      targetAmount: '',
      deadline: '',
      color: '#6366f1'
    });
    
    const emojis = ['🎯', '🏠', '🚗', '✈️', '💰', '📱', '💻', '🎓', '💍', '🏖️', '🎸', '📚', '🎮', '⌚', '🏋️'];
    
    const handleCreate = () => {
      const amount = parseFloat(formData.targetAmount.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (formData.name.trim() && amount > 0) {
        createGoal({
          name: formData.name.trim(),
          icon: formData.icon,
          targetAmount: amount,
          deadline: formData.deadline || undefined,
          color: formData.color
        });
        setIsCreateModalOpen(false);
        setFormData({ name: '', icon: '🎯', targetAmount: '', deadline: '', color: '#6366f1' });
      }
    };
    
    if (!isCreateModalOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground">Nova Meta</h2>
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Meta</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Viagem para Europa"
              />
            </div>
            
            <div>
              <Label>Ícone</Label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {emojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({...formData, icon: emoji})}
                    className={`p-3 rounded-lg text-2xl transition-all ${
                      formData.icon === emoji 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="targetAmount">Valor da Meta</Label>
              <Input
                id="targetAmount"
                value={formData.targetAmount}
                onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                placeholder="R$ 0,00"
              />
            </div>
            
            <div>
              <Label htmlFor="deadline">Prazo (opcional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formData.name.trim() || !formData.targetAmount || parseFloat(formData.targetAmount.replace(/[^\d.,]/g, '').replace(',', '.')) <= 0}
              className="flex-1"
            >
              Criar Meta
            </Button>
          </div>
        </div>
      </div>
    );
  }
}