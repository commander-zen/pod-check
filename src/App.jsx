import { Routes, Route, Navigate } from "react-router-dom";
import HostPage from "./pages/HostPage.jsx";
import JoinPage from "./pages/JoinPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Landing — create session or enter code */}
      <Route path="/" element={<LandingPage />} />

      {/* Host watches the session */}
      <Route path="/host/:sessionId" element={<HostPage />} />

      {/* Players join via QR or code */}
      <Route path="/join/:sessionId" element={<JoinPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
