import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="bg-surface-lowest rounded-xl p-5 shadow-soft transition-smooth hover:shadow-elevated">
      <div className="flex items-start justify-between mb-3">
        <p className="label-md text-on-surface-variant uppercase tracking-wider">
          {label}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-bold text-on-surface">
          {value}
        </span>
        {unit && (
          <span className="body-md text-on-surface-variant">{unit}</span>
        )}
      </div>

      {trend && trendValue && (
        <p
          className={`mt-2 label-md ${
            trend === "up"
              ? "text-primary"
              : trend === "down"
                ? "text-red-600"
                : "text-on-surface-variant"
          }`}
        >
          {trend === "up" ? "+" : trend === "down" ? "-" : ""}
          {trendValue}
        </p>
      )}
    </div>
  );
}
