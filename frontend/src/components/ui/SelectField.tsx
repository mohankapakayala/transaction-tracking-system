import { cn } from "@/lib/cn";

type SelectFieldProps = Omit<React.ComponentProps<"select">, "id"> & {
  id: string;
  label: string;
};

/** Dropdown styled to match `TextField`, for values with a fixed set of options. */
export function SelectField({
  id,
  label,
  className,
  children,
  ...props
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={cn(
            "h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-10",
            "text-base text-slate-900 transition-colors",
            "focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute inset-y-0 right-3 my-auto size-5 text-slate-400"
          aria-hidden
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
