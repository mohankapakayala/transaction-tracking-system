import { cn } from "@/lib/cn";

type ButtonProps = React.ComponentProps<"button"> & {
  /** `primary` for the main action on a screen, `outline` for quieter ones. */
  variant?: "primary" | "outline";
};

const VARIANTS = {
  primary:
    "bg-brand text-white hover:bg-brand-hover focus-visible:outline-brand",
  outline:
    "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline-brand",
} as const;

export function Button({
  className,
  children,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "h-12 w-full rounded-lg text-base font-semibold transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
