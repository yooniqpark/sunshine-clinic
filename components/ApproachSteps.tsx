/**
 * Renders a "시술 접근법" string. When the text is a numbered sequence
 * ("1) … 2) … 3) …") each step is shown on its own line; otherwise the
 * text is rendered as a single paragraph.
 */
export function ApproachSteps({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const steps = text
    .split(/(?=\d+\)\s)/)
    .map((s) => s.trim().replace(/[,\s]+$/, ""))
    .filter(Boolean);

  if (steps.length <= 1) {
    return <p className={className}>{text}</p>;
  }

  return (
    <div className={className}>
      {steps.map((step, i) => (
        <p key={i} className={i > 0 ? "mt-2" : undefined}>
          {step}
        </p>
      ))}
    </div>
  );
}
