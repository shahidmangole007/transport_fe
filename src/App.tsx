import DashboardLayout from "./layouts/DashboardLayout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import PartyMaster from "./pages/Master/PartyMaster";
import VehicleMaster from "./pages/Master/VehicleMaster";
import CityMaster from "./pages/Master/CityMaster";
import DriverMaster from "./pages/Master/DriverMaster";
import ProductDetailsMaster from "./pages/Master/ProductDetailsMaster";
import Login2 from "./pages/Login2";
import DemoMaster from "./pages/Master/DemoMaster";

export default function App() {

  return (
    <BrowserRouter>
      <Routes >

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route  path="/login" element={<Login />} />
        <Route  path="/login2" element={<Login2 />} />
        <Route
          path="/dashboard"
          element={
            <DashboardLayout  />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="partymaster" element={<PartyMaster />} />
          <Route path="vehiclemaster" element={<VehicleMaster />} />
          <Route path="citymaster" element={<CityMaster />} />
          <Route path="drivermaster" element={<DriverMaster />} />
          <Route path="productdetailsmaster" element={<ProductDetailsMaster />} />
          <Route path="demomaster" element={<DemoMaster />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
