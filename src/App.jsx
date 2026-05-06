import { Routes, Route, Navigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import HostPage        from "./pages/HostPage.jsx";
import JoinPage        from "./pages/JoinPage.jsx";
import PersistentShell from "./components/PersistentShell.jsx";
import { initSession } from "./lib/supabase.js";

export default function App() {
  return (
    <>
      <div style={{ position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Turnstile siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY} onSuccess={initSession} />
      </div>
      <Routes>
        {/* Landing shell — persistent MY DECK + POD tabs */}
        <Route path="/" element={<PersistentShell />} />

        {/* Host watches the session */}
        <Route path="/host/:sessionId" element={<HostPage />} />

        {/* Players join via QR or code */}
        <Route path="/join/:sessionId" element={<JoinPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
