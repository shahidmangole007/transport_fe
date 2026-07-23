import {
  LayoutDashboard,
  Truck,
  Users,
  User,
  FileText,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Vehicles",
    icon: Truck,
    href: "/vehicles",
  },
  {
    title: "Drivers",
    icon: User,
    href: "/drivers",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];