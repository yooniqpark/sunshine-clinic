import Image from "next/image";

type Brand = {
  tagline: string;
  clinicName: string;
  englishName: string;
};

export type DeviceMarketingData = {
  englishName: string; // e.g. "ULTHERA PRIME"
  localizedName: string; // e.g. "울쎄라 프라임"
  description: string;
  image: string;
  features: { title: string; body: string }[];
};

export function DeviceMarketingCard({
  device,
  brand,
  variant = "compact",
  className = "",
}: {
  device: DeviceMarketingData;
  brand: Brand;
  variant?: "compact" | "detail";
  className?: string;
}) {
  if (variant === "detail") {
    // detail — image only, no text overlay (left column already covers the info)
    return (
      <div
        className={`relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-cream ring-1 ring-inset ring-line ${className}`}
      >
        <Image
          src={device.image}
          alt={device.localizedName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>
    );
  }

  // compact variant (default — for home carousel)
  return (
    <div
      className={`relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-cream ring-1 ring-inset ring-line ${className}`}
    >
      <Image
        src={device.image}
        alt={device.localizedName}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-right"
        priority={false}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/40 to-transparent"
      />
      <div className="relative z-10 flex h-full flex-col px-4 py-4 lg:px-6 lg:py-7">
        <p className="max-w-[60%] text-[9px] leading-snug text-ink-soft/80 lg:text-[11px]">
          {brand.tagline}
        </p>
        <span aria-hidden className="mt-1.5 block h-px w-6 bg-brand" />

        <div className="mt-2 lg:mt-3">
          <h2 className="text-[1.3rem] font-bold leading-[1] tracking-tight text-ink lg:text-3xl">
            {device.englishName}
          </h2>
          <h3 className="mt-1 text-sm font-bold text-ink lg:text-lg">
            {device.localizedName}
          </h3>
          <span aria-hidden className="mt-2 block h-px w-4 bg-ink-soft/40" />
        </div>

        <p className="mt-2 max-w-[60%] text-[10px] leading-snug text-ink-soft lg:mt-2.5 lg:text-[12px]">
          {device.description}
        </p>

        <ul className="mt-3 flex max-w-[58%] flex-col gap-2.5 lg:mt-5 lg:gap-3.5">
          {device.features.slice(0, 4).map((f, i) => (
            <li key={i} className="leading-tight">
              <p className="text-[8px] font-bold tracking-wider text-brand lg:text-[9px]">
                0{i + 1}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink lg:text-[11px]">
                {f.title}
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-ink-soft lg:mt-1.5 lg:text-[10px]">
                {f.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const FEATURE_KEYWORDS = ["UPGRADE", "PRECISE", "POWERFUL", "COMFORTABLE"];

// Helper: build a marketing-friendly featured title from existing data
// (used when device features don't have a snappy uppercase title)
export function featureLabel(title: string, fallbackIndex: number): string {
  const trimmed = title.trim();
  if (/^[A-Z\s&·]+$/.test(trimmed)) return trimmed;
  return FEATURE_KEYWORDS[fallbackIndex] ?? trimmed;
}
