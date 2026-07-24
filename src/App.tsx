import DashboardLayout from "./app/DashboardLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
