import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg",
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-32" />
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingSkeleton className="h-96" />
        <LoadingSkeleton className="h-96" />
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingSkeleton className="h-64" />
        <LoadingSkeleton className="h-64" />
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <LoadingSkeleton className="h-10 w-64" />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-24" />
        ))}
      </div>
      
      {/* Filters */}
      <LoadingSkeleton className="h-16" />
      
      {/* Transactions List */}
      <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
          <LoadingSkeleton key={i} className="h-16" />
        ))}
      </div>
    </div>
  );
}