import { cn } from "@/lib/cn";

type TextFieldProps = Omit<React.ComponentProps<"input">, "id"> & {
  id: string;
  label: string;
  /** Control pinned to the right edge inside the field, e.g. a visibility toggle. */
  trailing?: React.ReactNode;
};

export function TextField({
  id,
  label,
  className,
  trailing,
  ...props
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={cn(
            "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-base text-slate-900",
            "transition-colors placeholder:text-slate-400",
            "focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15",
            trailing ? "pr-12" : null,
            className,
          )}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}
