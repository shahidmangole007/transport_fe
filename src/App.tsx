import DashboardLayout from "./layouts/DashboardLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import PartyMaster from "./pages/Master/PartyMaster";
import VehicleMaster from "./pages/Master/VehicleMaster";

export default function App() {

  return (
    <BrowserRouter>
      <Routes >

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route  path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout  />
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
