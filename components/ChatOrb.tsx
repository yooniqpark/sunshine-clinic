import styles from "./ChatOrb.module.css";

/** The existing Sunshine chat icon, shared without changing its 64px artwork. */
export function ChatOrb({
  className,
  spinning = true,
}: {
  className?: string;
  spinning?: boolean;
}) {
  return (
    <span
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-chat-orb
      data-chat-orb-spinning={spinning ? "true" : "false"}
      aria-hidden="true"
    >
      <span
        className={styles.glyph}
        style={{
          boxShadow:
            "0 16px 36px rgba(130,95,70,0.3), 0 4px 10px rgba(80,40,15,0.18)",
        }}
      >
        <span
          className={`pointer-events-none absolute inset-0 rounded-full ${
            spinning ? "animate-orb-spin" : ""
          }`}
          style={{
            background:
              "conic-gradient(from 0deg, #e8cdaf, #c49074, #9a6e54, #fff3df, #e8cdaf, #9a6e54, #e8cdaf)",
            filter:
              "var(--chat-orb-rim-filter, drop-shadow(0 0 6px rgba(196,144,116,0.7)) drop-shadow(0 0 2px rgba(232,205,175,0.5)))",
          }}
        />
        <span
          className="absolute overflow-hidden rounded-full backdrop-blur-md"
          style={{
            inset: "var(--chat-orb-rim-width, 2px)",
            background: "rgba(255,255,255,0.32)",
            boxShadow:
              "inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -3px 8px rgba(130,95,70,0.2)",
          }}
        >
          <span
            className="absolute right-[10%] top-[18%] h-10 w-10 animate-wisp-1 rounded-full"
            style={{
              background:
                "radial-gradient(circle, #9a6e54 0%, rgba(154,110,84,0) 65%)",
              filter: "blur(7px)",
            }}
          />
          <span
            className="absolute bottom-[12%] right-[20%] h-9 w-9 animate-wisp-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, #c49074 0%, rgba(196,144,116,0) 65%)",
              filter: "blur(7px)",
            }}
          />
          <span
            className="absolute bottom-[20%] left-[12%] h-9 w-9 animate-wisp-3 rounded-full"
            style={{
              background:
                "radial-gradient(circle, #e8cdaf 0%, rgba(232,205,175,0) 70%)",
              filter: "blur(7px)",
            }}
          />
          <span className="pointer-events-none absolute left-[18%] top-[14%] h-3.5 w-5 rounded-full bg-white/75 blur-[3px]" />
        </span>
      </span>
    </span>
  );
}
