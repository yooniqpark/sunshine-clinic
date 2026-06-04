export function SectionHeading({
  index,
  label,
  title,
  tone = "light",
  className = "",
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-semibold ${dark ? "text-brand-soft" : "text-brand"}`}>
          {index}
        </span>
        <span className={`h-px w-10 ${dark ? "bg-brand-soft/50" : "bg-brand/40"}`} />
        <span
          className={`text-xs font-semibold tracking-[0.22em] ${
            dark ? "text-cream/70" : "text-ink-soft"
          }`}
        >
          {label}
        </span>
      </div>
      <h2
        className={`mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
