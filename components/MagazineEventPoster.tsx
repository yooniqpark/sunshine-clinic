import type { MagazineEventTemplate } from "@/lib/magazine-event-templates";

export function MagazineEventPoster({
  template,
  className = "",
  onOpenPriceList,
}: {
  template: MagazineEventTemplate;
  className?: string;
  onOpenPriceList?: () => void;
}) {
  const { colors, header, hero, rightColumn, footer } = template;
  const id = template.id.replace(/[^a-zA-Z0-9_-]/g, "");
  const clipId = `${id}-magazine`;
  const imageFadeId = `${id}-image-fade`;
  const pageWashId = `${id}-page-wash`;
  const outerBgId = `${id}-outer-bg`;
  const glassId = `${id}-glass`;
  const softGlowId = `${id}-soft-glow`;
  const priceGlowId = `${id}-price-glow`;

  return (
    <svg
      role="img"
      aria-label={template.ariaLabel}
      viewBox="0 0 1080 1620"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{template.ariaLabel}</title>
      <defs>
        <clipPath id={clipId}>
          <rect x="58" y="55" width="964" height="1510" rx="30" />
        </clipPath>
        <linearGradient id={imageFadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset=".55" stopColor={colors.modelShade} stopOpacity="0" />
          <stop offset="1" stopColor={colors.modelShade} stopOpacity=".72" />
        </linearGradient>
        <linearGradient id={pageWashId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#e6f0ff" stopOpacity=".28" />
          <stop offset="1" stopColor="#c8c8ef" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id={outerBgId} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={colors.outerStart} />
          <stop offset=".48" stopColor={colors.outerMiddle} />
          <stop offset="1" stopColor={colors.outerEnd} />
        </linearGradient>
        <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#fff" stopOpacity=".12" />
          <stop offset=".48" stopColor="#d7dcff" stopOpacity=".5" />
          <stop offset=".72" stopColor="#fff" stopOpacity=".36" />
          <stop offset="1" stopColor="#9fc8dc" stopOpacity=".18" />
        </linearGradient>
        <radialGradient id={softGlowId} cx="42%" cy="18%" r="74%">
          <stop stopColor="#fff" stopOpacity=".82" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id={priceGlowId} x="-70%" y="-240%" width="240%" height="580%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>

      <rect width="1080" height="1620" fill={`url(#${outerBgId})`} />
      {template.backgroundImageUrl ? (
        <image
          href={template.backgroundImageUrl}
          width="1080"
          height="1620"
          preserveAspectRatio="xMidYMid slice"
          opacity=".62"
        />
      ) : (
        <>
          <ellipse cx="390" cy="235" rx="500" ry="330" fill={`url(#${softGlowId})`} />
          <path
            d="M-90 1100C170 920 300 1010 510 880C700 760 820 540 1170 510V1700H-90Z"
            fill="#fff"
            opacity=".34"
          />
          <rect
            x="878"
            y="-90"
            width="132"
            height="1800"
            rx="66"
            fill={`url(#${glassId})`}
            stroke="#fff"
            strokeOpacity=".58"
            strokeWidth="3"
          />
          <rect
            x="968"
            y="180"
            width="76"
            height="1180"
            rx="38"
            fill="#e8dfff"
            fillOpacity=".38"
            stroke="#fff"
            strokeOpacity=".5"
          />
          <rect
            x="-54"
            y="520"
            width="148"
            height="870"
            rx="74"
            fill={`url(#${glassId})`}
            stroke="#fff"
            strokeOpacity=".5"
            strokeWidth="3"
          />
        </>
      )}
      <rect width="1080" height="1620" fill={`url(#${pageWashId})`} />
      <rect x="70" y="71" width="952" height="1506" rx="30" fill={colors.modelShade} opacity=".14" />

      <g clipPath={`url(#${clipId})`}>
        <rect x="58" y="55" width="964" height="1510" fill={colors.paper} />

        <rect x="58" y="55" width="964" height="190" fill={colors.paper} />
        <PosterText x={94} y={100} size={12} color={colors.ink} weight={700} spacing={3}>
          {header.brand}
        </PosterText>
        <PosterText x={94} y={194} size={58} color={colors.ink} spacing={-1.5}>
          {header.title}
        </PosterText>
        <SunshineMark color={colors.accent} />
        <PosterText x={706} y={101} size={10} color={colors.muted} weight={700} spacing={2.2}>
          {header.meta}
        </PosterText>
        <PosterText x={706} y={147} size={12} color={colors.accent} weight={700} spacing={1.8}>
          {header.headline}
        </PosterText>
        <PosterText x={706} y={177} size={8.5} color={colors.muted} spacing={1.5}>
          {header.caption}
        </PosterText>
        <line x1="58" y1="245" x2="1022" y2="245" stroke={colors.modelShade} strokeOpacity=".14" />

        <image
          href={template.modelImageUrl}
          x="58"
          y="245"
          width="680"
          height="1000"
          preserveAspectRatio={`${template.modelPosition ?? "xMidYMid"} slice`}
        />
        <rect x="58" y="245" width="680" height="1000" fill={`url(#${imageFadeId})`} />
        <rect x="86" y="277" width="104" height="31" rx="2" fill={colors.paper} fillOpacity=".9" />
        <PosterText x={138} y={297} size={8.5} color={colors.accent} weight={700} spacing={1.8} anchor="middle">
          {hero.badge}
        </PosterText>
        <PosterText x={94} y={1147} size={29} color="#fff" weight={600}>
          {hero.headline[0]}
        </PosterText>
        <PosterText x={94} y={1190} size={29} color="#fff" weight={600}>
          {hero.headline[1]}
        </PosterText>
        <PosterText x={95} y={1219} size={8.5} color="#fff" spacing={2.3} opacity={0.85}>
          {hero.caption}
        </PosterText>

        <rect x="738" y="245" width="284" height="1000" fill={colors.paper} />
        <line x1="738" y1="245" x2="738" y2="1245" stroke={colors.modelShade} strokeOpacity=".15" />
        <PosterText x={762} y={296} size={9} color={colors.accent} weight={700} spacing={1.6}>
          {rightColumn.eyebrow}
        </PosterText>
        <PosterText x={762} y={346} size={20} color={colors.ink} weight={700}>
          {rightColumn.headline[0]}
        </PosterText>
        <PosterText x={762} y={377} size={20} color={colors.ink} weight={700}>
          {rightColumn.headline[1]}
        </PosterText>
        <PosterText x={762} y={417} size={10.5} color={colors.muted}>
          {rightColumn.intro[0]}
        </PosterText>
        <PosterText x={762} y={438} size={10.5} color={colors.muted}>
          {rightColumn.intro[1]}
        </PosterText>

        <rect x="756" y="470" width="242" height="267" rx="4" fill={colors.accent} />
        <PosterText x={780} y={510} size={8} color="#dce4ff" weight={700} spacing={1.8}>
          {rightColumn.primary.eyebrow}
        </PosterText>
        <PosterText x={780} y={564} size={18} color="#fff" weight={700}>
          {rightColumn.primary.headline[0]}
        </PosterText>
        <PosterText x={780} y={596} size={18} color="#fff" weight={700}>
          {rightColumn.primary.headline[1]}
        </PosterText>
        <line x1="780" y1="627" x2="974" y2="627" stroke="#fff" strokeOpacity=".34" />
        <PosterText x={780} y={669} size={11} color="#fff" opacity={0.84}>
          {rightColumn.primary.body[0]}
        </PosterText>
        <PosterText x={780} y={694} size={11} color="#fff" opacity={0.84}>
          {rightColumn.primary.body[1]}
        </PosterText>

        <rect x="756" y="772" width="242" height="202" rx="4" fill={colors.soft} stroke={colors.accent} strokeOpacity=".55" />
        <PosterText x={780} y={813} size={8} color={colors.accent} weight={700} spacing={1.8}>
          {rightColumn.secondary.eyebrow}
        </PosterText>
        <PosterText x={780} y={858} size={16} color={colors.ink} weight={700}>
          {rightColumn.secondary.headline[0]}
        </PosterText>
        <PosterText x={780} y={888} size={16} color={colors.ink} weight={700}>
          {rightColumn.secondary.headline[1]}
        </PosterText>
        <PosterText x={780} y={932} size={9.5} color={colors.muted}>
          {rightColumn.secondary.body}
        </PosterText>

        <PosterText x={762} y={1042} size={8} color={colors.muted} weight={700} spacing={1.6}>
          {rightColumn.contactEyebrow}
        </PosterText>
        <PosterText x={762} y={1098} size={24} color={colors.ink} weight={700} spacing={0.3}>
          {rightColumn.phone}
        </PosterText>
        <line x1="762" y1="1125" x2="974" y2="1125" stroke={colors.modelShade} strokeOpacity=".3" />
        <PosterText x={762} y={1168} size={10.5} color={colors.ink} weight={700}>
          {rightColumn.cta}
        </PosterText>
        <path d="M950 1167h24m0 0-8-8m8 8-8 8" fill="none" stroke={colors.accent} strokeWidth="2" />

        <rect x="58" y="1245" width="964" height="320" fill={colors.paper} />
        <line x1="58" y1="1245" x2="1022" y2="1245" stroke={colors.modelShade} strokeOpacity=".15" />
        <PosterText x={94} y={1295} size={9} color={colors.accent} weight={700} spacing={2.4}>
          {footer.eyebrow}
        </PosterText>
        <PosterText x={94} y={1360} size={27} color={colors.ink} weight={700}>
          {footer.headline}
        </PosterText>
        {footer.priceCta && (
          <g
            role={onOpenPriceList ? "button" : undefined}
            tabIndex={onOpenPriceList ? 0 : undefined}
            aria-label={onOpenPriceList ? `${footer.priceCta} 보기` : undefined}
            onClick={onOpenPriceList}
            onKeyDown={
              onOpenPriceList
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onOpenPriceList();
                    }
                  }
                : undefined
            }
            style={{ cursor: onOpenPriceList ? "pointer" : "default" }}
          >
            <rect
              x="742"
              y="1306"
              width="258"
              height="92"
              rx="46"
              fill={colors.accent}
              opacity=".32"
              filter={`url(#${priceGlowId})`}
            >
              <animate attributeName="opacity" values=".24;.48;.24" dur="3.2s" repeatCount="indefinite" />
            </rect>
            <rect
              x="756"
              y="1320"
              width="230"
              height="64"
              rx="32"
              fill={colors.accent}
              stroke="#fff"
              strokeOpacity=".36"
              strokeWidth="2"
            />
            <PosterText x={784} y={1360} size={11} color="#fff" weight={700} spacing={1.2}>
              {footer.priceCta}
            </PosterText>
            <path d="M948 1352h18m0 0-6-6m6 6-6 6" fill="none" stroke="#fff" strokeWidth="2" />
          </g>
        )}
        <PosterText x={94} y={1405} size={13} color={colors.muted}>
          {footer.description}
        </PosterText>
        <line x1="94" y1="1450" x2="986" y2="1450" stroke={colors.modelShade} strokeOpacity=".18" />
        <PosterText x={94} y={1500} size={10} color={colors.accent} weight={700} spacing={1.5}>
          {footer.steps[0]}
        </PosterText>
        <PosterText x={390} y={1500} size={10} color={colors.accent} weight={700} spacing={1.5}>
          {footer.steps[1]}
        </PosterText>
        <PosterText x={748} y={1500} size={10} color={colors.accent} weight={700} spacing={1.5}>
          {footer.steps[2]}
        </PosterText>
        <PosterText x={986} y={1538} size={8} color={colors.muted} spacing={1.8} anchor="end">
          {footer.edition}
        </PosterText>
      </g>
    </svg>
  );
}

function SunshineMark({ color }: { color: string }) {
  return (
    <g aria-hidden="true" stroke={color} strokeWidth="1.5">
      <circle cx="575" cy="165" r="4" fill={color} stroke="none" />
      <line x1="575" y1="145" x2="575" y2="135" />
      <line x1="575" y1="195" x2="575" y2="185" />
      <line x1="555" y1="165" x2="545" y2="165" />
      <line x1="605" y1="165" x2="595" y2="165" />
      <line x1="561" y1="151" x2="554" y2="144" />
      <line x1="596" y1="186" x2="589" y2="179" />
      <line x1="589" y1="151" x2="596" y2="144" />
      <line x1="554" y1="186" x2="561" y2="179" />
    </g>
  );
}

function PosterText({
  x,
  y,
  size,
  color,
  weight = 400,
  spacing,
  anchor,
  opacity,
  children,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  weight?: number;
  spacing?: number;
  anchor?: "start" | "middle" | "end";
  opacity?: number;
  children: string;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontFamily={'"Noto Sans KR", "Pretendard", Arial, sans-serif'}
      fontSize={size}
      fontWeight={weight}
      letterSpacing={spacing}
      textAnchor={anchor}
      opacity={opacity}
    >
      {children}
    </text>
  );
}
