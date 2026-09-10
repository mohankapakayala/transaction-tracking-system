import { cn } from "@/lib/cn";

type LogoProps = {
  /** `light` for the blue brand panel, `dark` for white surfaces. */
  tone?: "light" | "dark";
  className?: string;
};

export function Logo({ tone = "light", className }: LogoProps) {
  const color = tone === "light" ? "text-white" : "text-brand-ink";

  return (
    <div className={cn("flex items-center gap-2.5", color, className)}>
      <svg
        viewBox="0 0 40 40"
        className="size-9 shrink-0"
        role="img"
        aria-label="TMS logo"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <text
          x="18"
          y="25.5"
          textAnchor="middle"
          fill="currentColor"
          fontSize="15"
          fontWeight="600"
          fontFamily="inherit"
        >
          TS
        </text>
        <circle cx="29" cy="13" r="2" fill="currentColor" />
      </svg>
      <span className="text-2xl font-bold tracking-tight">TMS</span>
    </div>
  );
}
