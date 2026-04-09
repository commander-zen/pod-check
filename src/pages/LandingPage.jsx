import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { makeSessionId, newSession, PageWrapper, ScryCheckCredit, Logo } from "../lib/ui.jsx";

export default function LandingPage() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const createSession = useCallback(async () => {
    setCreating(true); setError(null);
    try {
      const id = makeSessionId();
      const data = newSession(id, 'podcheck');
      const { error: err } = await supabase.from("sessions").insert({ id, data });
      if (err) throw err;
      navigate(`/host/${id}`);
    } catch (e) {
      setError(e.message || "Failed to create session.");
    } finally { setCreating(false); }
  }, [navigate]);

  const joinByCode = useCallback(async () => {
    const clean = code.trim().toUpperCase();
    if (clean.length < 4) { setCodeError("Enter a 5-character session code."); return; }
    setChecking(true); setCodeError(null);
    const { data, error } = await supabase.from("sessions").select("id").eq("id", clean).single();
    if (error || !data) {
      setCodeError("Session not found. Check the code and try again.");
      setChecking(false); return;
    }
    navigate(`/join/${clean}`);
  }, [code, navigate]);

  return (
    <PageWrapper>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        input:focus { outline:none; border-color:#a78bfa !important; }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 0, padding: "32px 24px" }}>
        <div style={{ animation: "fadeUp 0.4s ease both", width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>

          <Logo size="lg" />

          <p style={{ color: "#475569", fontSize: 13, textAlign: "center", lineHeight: 1.8, marginTop: -8 }}>
            Power balance check for your Commander pod.<br />
            Powered by <a href="https://scrycheck.com" target="_blank" rel="noopener noreferrer" style={{ color: "#a78bfa", textDecoration: "none" }}>ScryCheck</a>.
          </p>

          {/* Create session */}
          <div style={{ width: "100%" }}>
            {error && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 10, textAlign: "center" }}>{error}</div>}
            <button
              onClick={() => createSession()}
              disabled={creating}
              style={{
                width: "100%", background: "#a78bfa", border: "none", borderRadius: 12,
                padding: "14px 16px", fontFamily: "'DM Mono', monospace",
                color: "#06040f", cursor: creating ? "wait" : "pointer",
                opacity: creating ? 0.7 : 1, transition: "opacity 0.2s",
                textAlign: "left",
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>POD CHECK</div>
              <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.65, marginTop: 2 }}>balance your pod</div>
            </button>
          </div>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <div style={{ fontSize: 11, color: "#334155", letterSpacing: 2 }}>OR</div>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Join by code */}
          <div style={{ width: "100%" }}>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: 2, marginBottom: 10, textAlign: "center" }}>JOIN A TABLE</div>
            <input
              value={code}
              onChange={e => {
                // Auto-uppercase, strip ambiguous chars as you type
                const val = e.target.value.toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, "").slice(0, 5);
                setCode(val);
                setCodeError(null);
              }}
              onKeyDown={e => e.key === "Enter" && code.length >= 4 && joinByCode()}
              placeholder="ENTER CODE"
              maxLength={5}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${codeError ? "#f87171" : "rgba(255,255,255,0.12)"}`,
                borderRadius: 12,
                padding: "16px",
                color: "#e0f2ff",
                fontSize: 28,
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: 10,
                textAlign: "center",
                transition: "border-color 0.2s",
                marginBottom: 10,
              }}
            />
            {codeError && <div style={{ color: "#f87171", fontSize: 12, marginBottom: 10, textAlign: "center" }}>{codeError}</div>}
            <button
              onClick={joinByCode}
              disabled={checking || code.length < 4}
              style={{
                width: "100%",
                background: code.length >= 4 ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${code.length >= 4 ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 12, padding: "14px",
                color: code.length >= 4 ? "#a78bfa" : "#334155",
                fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono', monospace",
                cursor: code.length >= 4 ? "pointer" : "not-allowed", letterSpacing: 1,
                transition: "all 0.2s",
              }}
            >
              {checking ? "CHECKING..." : "JOIN SESSION →"}
            </button>
          </div>

          <ScryCheckCredit />
        </div>
      </div>
    </PageWrapper>
  );
}
