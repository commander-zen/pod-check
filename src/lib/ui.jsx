import { useState, useEffect } from "react";

export const COLORS = ["#e879f9", "#fb923c", "#34d399", "#60a5fa"];

export const BRACKET_META = {
  1: { label: "Precon",     color: "#6b7280" },
  2: { label: "Upgraded",   color: "#3b82f6" },
  3: { label: "Optimized",  color: "#f59e0b" },
  4: { label: "High Power", color: "#ef4444" },
  5: { label: "cEDH",       color: "#a855f7" },
};

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function sessionCard(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;

  const COSTS  = ["W","U","B","R","G","1W","1U","1B","1R","1G","2","3","XR","XG","WU","UB","BR","RG","GW","WB"];
  const COLS   = ["white","blue","black","red","green","azorius","dimir","rakdos","gruul","selesnya","orzhov","izzet","golgari","boros","simic","esper","grixis","jund","naya","bant"];
  const TYPES  = ["Instant","Sorcery","Creature","Enchantment","Artifact","Instant","Sorcery","Creature","Instant","Sorcery"];

  const cost  = COSTS[h % COSTS.length];
  const color = COLS[(h >>> 4) % COLS.length];
  const type  = TYPES[(h >>> 9) % TYPES.length];
  return { cost, color, type, code: id };
}

const BORDER_COLOR = {
  white:"#f9fafb", blue:"#3b82f6", black:"#6b7280", red:"#ef4444", green:"#22c55e",
  azorius:"#93c5fd", dimir:"#7c3aed", rakdos:"#dc2626", gruul:"#f97316", selesnya:"#86efac",
  orzhov:"#d1d5db", izzet:"#818cf8", golgari:"#4ade80", boros:"#fb923c", simic:"#34d399",
  esper:"#c4b5fd", grixis:"#a78bfa", jund:"#f59e0b", naya:"#fde68a", bant:"#6ee7b7",
};

const COLOR_EMOJI = {
  white:"☀️", blue:"💧", black:"💀", red:"🔥", green:"🌿",
  azorius:"🌊", dimir:"🌑", rakdos:"👹", gruul:"🐗", selesnya:"🌳",
  orzhov:"⚖️", izzet:"⚡", golgari:"🍄", boros:"⚔️", simic:"🧬",
  esper:"🔮", grixis:"💜", jund:"🌋", naya:"🦁", bant:"🛡️",
};

const SCRYFALL_COLOR = {
  white:"w", blue:"u", black:"b", red:"r", green:"g",
  azorius:"wu", dimir:"ub", rakdos:"br", gruul:"rg", selesnya:"gw",
  orzhov:"wb", izzet:"ur", golgari:"bg", boros:"rw", simic:"ug",
  esper:"wub", grixis:"ubr", jund:"brg", naya:"rwg", bant:"wug",
};

export function SessionCodeCard({ sessionId }) {
  const card = sessionCard(sessionId);
  const [artUrl, setArtUrl] = useState(null);

  useEffect(() => {
    const c = SCRYFALL_COLOR[card.color] || "w";
    const t = card.type.toLowerCase();
    fetch(`https://api.scryfall.com/cards/random?q=c%3D${c}+t%3A${t}`, {
      headers: { "User-Agent": "PodCheck/1.0 (pod-check.vercel.app)" },
    })
      .then(r => r.json())
      .then(data => {
        const url = data.image_uris?.art_crop || data.card_faces?.[0]?.image_uris?.art_crop;
        if (url) setArtUrl(url);
      })
      .catch(() => {});
  }, [card.color, card.type]);

  const border = BORDER_COLOR[card.color] || "#a78bfa";

  return (
    <div style={{
      width: "100%", maxWidth: 340, margin: "0 auto",
      borderRadius: 16, border: `3px solid ${border}`,
      background: "#f5f0e8", overflow: "hidden",
      boxShadow: `0 0 32px ${border}40`,
      fontFamily: "serif",
    }}>
      {/* Name bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px 6px", background: "#ede8dc" }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>{sessionId}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1a1a1a", background: border, borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{card.cost}</span>
      </div>

      {/* Art frame */}
      <div style={{ margin: "0 10px", height: 200, background: "#ccc", overflow: "hidden" }}>
        {artUrl
          ? <img src={artUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          : <div style={{ width: "100%", height: "100%", background: `${border}30` }} />
        }
      </div>

      {/* Type line */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", background: "#ede8dc" }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a" }}>{card.type}</span>
        <span style={{ fontSize: 16 }}>{COLOR_EMOJI[card.color] || "✦"}</span>
      </div>

      {/* Collector number */}
      <div style={{ padding: "4px 12px 8px", background: "#f5f0e8", textAlign: "right" }}>
        <span style={{ fontSize: 9, color: "#888", fontFamily: "monospace", letterSpacing: 1 }}>{sessionId} · POD CHECK</span>
      </div>
    </div>
  );
}

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
        <a href="https://github.com/kylo-ben/pod-check/issues/new?template=bug_report.md&title=[BUG]%20" target="_blank" rel="noopener noreferrer" style={{ color: "#5b8fff", textDecoration: "none" }}>report a bug</a>
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
