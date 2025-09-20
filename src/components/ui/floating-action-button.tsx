import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  onClick: () => void;
  className?: string;
}

export function FloatingActionButton({ onClick, className }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 mobile-touch-target-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "lg:hidden", // Only show on mobile/tablet
        className
      )}
      size="icon"
    >
      <Plus className="mobile-icon-base" />
    </Button>
  );
}