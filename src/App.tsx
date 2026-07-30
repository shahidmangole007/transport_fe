import DashboardLayout from "./layouts/DashboardLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import PartyMaster from "./pages/Master/PartyMaster";
import VehicleMaster from "./pages/Master/VehicleMaster";
import CityMaster from "./pages/Master/CityMaster";
import DriverMaster from "./pages/Master/DriverMaster";
import ProductDetailsMaster from "./pages/Master/ProductDetailsMaster";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
