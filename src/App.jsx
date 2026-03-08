import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ChecklistPage from "./pages/ChecklistPage";
import ChatbotPage from "./pages/ChatbotPage";
import MapPage from "./pages/MapPage";
import OnboardingPage from "./pages/OnboardingPage";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/map" element={<MapPage />} />
        </Route>
      </Routes>
  );
}