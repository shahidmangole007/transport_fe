import DashboardLayout from "./layouts/DashboardLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";
import { DashboardBlock } from "./components/dashboard-block";
import Dashboard from "./pages/Dashboard";
import Master from "./pages/Master";

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
        <Route path="/" element={ <DashboardLayout helpOpen={helpOpen} setHelpOpen={setHelpOpen} /> } >
          <Route path="/dashboard" element ={ <Dashboard/> }/>
          <Route path="/master" element ={ <Master/> }/>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
