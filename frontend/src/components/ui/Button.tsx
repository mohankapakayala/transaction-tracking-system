import { cn } from "@/lib/cn";

type ButtonProps = React.ComponentProps<"button">;

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "h-12 w-full rounded-lg bg-brand text-base font-semibold text-white transition-colors",
        "hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      {children}
    </button>
  );
}
