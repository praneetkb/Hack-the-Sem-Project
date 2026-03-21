type ChipVariant = "active" | "matched" | "delivered" | "settled" | "expired" | "failed" | "solar";

interface ChipProps {
  variant: ChipVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<ChipVariant, string> = {
  active: "bg-primary-container/20 text-primary",
  matched: "bg-secondary/10 text-secondary",
  delivered: "bg-primary/10 text-primary",
  settled: "bg-primary-container/30 text-on-surface",
  expired: "bg-surface-highest text-on-surface-variant",
  failed: "bg-red-100 text-red-700",
  solar: "bg-tertiary-container text-on-surface",
};

export function Chip({ variant, children, className = "" }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 label-md ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
