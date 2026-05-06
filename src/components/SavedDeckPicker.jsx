import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export default function SavedDeckPicker({ user, onUse, onSwitch }) {
  const [decks, setDecks] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      if (user && !user.is_anonymous) {
        const { data } = await supabase
          .from('decks')
          .select('id, commander_name, power, bracket, scrycheck_url, tier')
          .eq('user_id', user.id)
          .not('bracket', 'is', null)
          .order('scrycheck_at', { ascending: false })
          .limit(5)
        setDecks(data ?? [])
      } else {
        const raw = localStorage.getItem('cardstock_last_deck')
        setDecks(raw ? [JSON.parse(raw)] : [])
      }
    }
    load()
  }, [user])

  useEffect(() => {
    if (decks !== null && decks.length === 0) onSwitch()
  }, [decks, onSwitch])

  if (decks === null || decks.length === 0) return null

  return (
    <div style={{ animation: "fadeUp 0.4s ease both" }}>
      <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "#a78bfa", letterSpacing: 2, marginBottom: 16 }}>
        YOUR DECKS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {decks.map((d, i) => (
          <div
            key={d.id ?? i}
            onClick={() => setSelected(d)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", borderRadius: 4, cursor: "pointer",
              background: selected === d ? "#5b8fff22" : "rgba(255,255,255,0.03)",
              border: selected === d ? "1px solid #5b8fff" : "1px solid rgba(255,255,255,0.08)",
              borderLeft: selected === d ? "2px solid #5b8fff" : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 13, color: "#e0f2ff" }}>
              {d.commander_name || "Unknown"}
            </span>
            <span style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 11, color: "#a78bfa" }}>
              B{d.bracket}{d.power != null ? ` · ${Number(d.power).toFixed(1)}` : ""}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => selected && onUse({
            commander: selected.commander_name,
            power: selected.power,
            bracket: selected.bracket,
            tier: selected.tier,
            vectors: {},
          })}
          disabled={!selected}
          style={{
            flex: 1, minHeight: 44, background: selected ? "#5b8fff" : "rgba(91,143,255,0.15)",
            border: "1px solid #5b8fff", borderRadius: 4,
            color: selected ? "#06040f" : "#5b8fff", fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: selected ? "pointer" : "not-allowed",
          }}
        >
          USE THIS DECK
        </button>
        <button
          onClick={onSwitch}
          style={{
            flex: 1, minHeight: 44, background: "transparent",
            border: "1px solid #5b8fff", borderRadius: 4,
            color: "#5b8fff", fontFamily: "IBM Plex Mono, monospace",
            fontSize: 12, fontWeight: 700, letterSpacing: 1, cursor: "pointer",
          }}
        >
          DIFFERENT DECK
        </button>
      </div>
    </div>
  )
}
