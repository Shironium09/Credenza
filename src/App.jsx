import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./landing_page/landing_page";
import LoginPage from "./login_page/login_page.jsx";    
import DashboardPage from "./dashboard_page/dashboard.jsx";
import EventPage from "./add_event_page/event.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;