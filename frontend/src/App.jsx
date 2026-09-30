import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BrainGym from "./pages/BrainGym";
import FocusForge from "./pages/FocusForge";
import MindfulMinute from "./pages/MindfulMinute";
import ScrollFeed from "./pages/ScrollFeed";
import Analytics from "./pages/Analytics";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/brain-gym" element={<BrainGym />} />
          <Route path="/focus-forge" element={<FocusForge />} />
          <Route path="/mindful-minute" element={<MindfulMinute />} />
          <Route path="/scroll-feed" element={<ScrollFeed />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
