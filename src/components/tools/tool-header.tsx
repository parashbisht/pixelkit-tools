import { ShieldCheck } from "lucide-react";

interface ToolHeaderProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function ToolHeader({
  title,
  description,
  icon: Icon,
}: ToolHeaderProps) {
  return (
    <div className="space-y-3 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Client-Side Processing • Never Uploaded</span>
        </div>
      </div>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
        {description}
      </p>
    </div>
  );
}

