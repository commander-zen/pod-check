import { useState } from "react";

export const COLORS = ["#e879f9", "#fb923c", "#34d399", "#60a5fa"];

export const BRACKET_META = {
  1: { label: "Precon",     color: "#6b7280" },
  2: { label: "Upgraded",   color: "#3b82f6" },
  3: { label: "Optimized",  color: "#f59e0b" },
  4: { label: "High Power", color: "#ef4444" },
  5: { label: "cEDH",       color: "#a855f7" },
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeSessionId() {
  return Array.from({ length: 5 }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ).join("");
}

export function emptyPlayer(seat) {
  return { seat, name: "", status: "empty", scrycheckUrl: null, deckData: null, agreed: false, error: null };
}

export function newSession(id, mode = 'podcheck') {
  return { id, createdAt: new Date().toISOString(), players: [0, 1, 2, 3].map(emptyPlayer), game: null, mode };
}

export function PageWrapper({ children, style = {} }) {
  return (
    <div style={{ minHeight: "100vh", background: "#06040f", color: "#e0f2ff", fontFamily: "'DM Mono', monospace", ...style }}>
      {children}
    </div>
  );
}

export function ScryCheckCredit() {
  return (
    <div style={{ textAlign: "center", padding: "24px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "#475569", lineHeight: 1.8 }}>
      <div style={{ marginBottom: 4 }}>
        Deck analysis powered by{" "}
        <a href="https://scrycheck.com" target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 600 }}>
          ScryCheck
        </a>
        {" "}— the best Commander power level tool out there.
      </div>
      <div style={{ opacity: 0.6 }}>Pod Check is an unofficial fan app. Not affiliated with ScryCheck or Wizards of the Coast.</div>
      <div style={{ marginTop: 8, fontSize: 10, color: "#334155" }}>
        bugs? find us on discord:{" "}
        <span style={{ color: "#5b8fff" }}>@commanderdadmtg</span>
      </div>
    </div>
  );
}

export function Logo({ size = "md" }) {
  const fontSize = size === "lg" ? 40 : size === "sm" ? 20 : 28;
  const sub = size === "lg" ? 13 : 10;
  return (
    <div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize, letterSpacing: 4, color: "#a78bfa", lineHeight: 1 }}>
        POD CHECK
      </div>
      {size !== "sm" && (
        <div style={{ fontSize: sub, color: "#475569", letterSpacing: 2, marginTop: 2 }}>
          COMMANDER POWER BALANCE
        </div>
      )}
    </div>
  );
}

export function SessionCode({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={copy} style={{ background: "rgba(167,139,250,0.08)", border: "2px solid rgba(167,139,250,0.25)", borderRadius: 16, padding: "16px 28px", cursor: "pointer", textAlign: "center", width: "100%" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, letterSpacing: 10, color: "#a78bfa", lineHeight: 1, paddingLeft: 10 }}>
        {code}
      </div>
      <div style={{ fontSize: 10, color: copied ? "#34d399" : "#475569", letterSpacing: 2, marginTop: 6, transition: "color 0.2s" }}>
        {copied ? "COPIED ✓" : "TAP TO COPY"}
      </div>
    </button>
  );
}
