import { useState } from "react";
import { getTheme, setTheme } from "../styles/theme-switcher.js";

const THEMES = [
  { id: "default",   label: "UNIQLO",    a: "#ffffff", b: "#000000" },
  { id: "crystal",   label: "CRYSTAL",   a: "#1a2744", b: "#b8a8d8" },
  { id: "geocities", label: "GEOCITIES", a: "#000011", b: "#ff00ff" },
  { id: "yamada",    label: "YAMADA",    a: "#f5edd6", b: "#c4683a" },
  { id: "balatro",   label: "BALATRO",   a: "#2d5016", b: "#ffd700" },
  { id: "newspaper", label: "PAPER",     a: "#f2efe0", b: "#000000" },
];

export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(getTheme);

  const pick = (id) => {
    setTheme(id);
    setActive(id);
    setOpen(false);
  };

  return (
    <div style={{ position: "fixed", bottom: 84, right: 16, zIndex: 9999 }}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Switch theme"
        aria-label="Switch theme"
        style={{
          width: 36, height: 36,
          background: "var(--cs-accent, #5b8fff)",
          color: "var(--cs-accent-fg, #fff)",
          border: "var(--cs-border-width, 2px) solid var(--cs-border, rgba(91,143,255,0.4))",
          borderRadius: "var(--cs-border-radius, 4px)",
          cursor: "pointer",
          fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          transition: "opacity 0.15s",
        }}
      >
        ◑
      </button>

      {open && (
        <div
          style={{
            position: "absolute", bottom: 44, right: 0,
            background: "var(--cs-surface, #0e1a35)",
            border: "var(--cs-border-width, 2px) solid var(--cs-border, rgba(91,143,255,0.3))",
            borderRadius: "var(--cs-border-radius, 4px)",
            overflow: "hidden", minWidth: 148,
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          {THEMES.map((t, i) => (
            <button
              key={t.id}
              onClick={() => pick(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 12px",
                background: active === t.id
                  ? "var(--cs-accent, #5b8fff)"
                  : "transparent",
                color: active === t.id
                  ? "var(--cs-accent-fg, #ffffff)"
                  : "var(--cs-text-primary, #e0f2ff)",
                border: "none",
                borderBottom: i < THEMES.length - 1
                  ? "1px solid var(--cs-border, rgba(91,143,255,0.12))"
                  : "none",
                cursor: "pointer",
                fontFamily: "var(--cs-font-body, 'IBM Plex Mono', monospace)",
                fontSize: 10,
                letterSpacing: "0.08em",
                textAlign: "left",
                transition: "background 0.1s",
              }}
            >
              <div
                style={{
                  width: 16, height: 16, flexShrink: 0,
                  background: `linear-gradient(135deg, ${t.a} 50%, ${t.b} 50%)`,
                  border: `1px solid ${active === t.id ? "transparent" : "rgba(255,255,255,0.2)"}`,
                  borderRadius: 2,
                }}
              />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
