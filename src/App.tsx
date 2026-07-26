import DashboardLayout from "./layouts/DashboardLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import PartyMaster from "./pages/Master/PartyMaster";
import VehicleMaster from "./pages/Master/VehicleMaster";

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout helpOpen={helpOpen} setHelpOpen={setHelpOpen} />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="partymaster" element={<PartyMaster />} />
          <Route path="vehiclemaster" element={<VehicleMaster />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
