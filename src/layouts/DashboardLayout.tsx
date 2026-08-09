import { AppSidebar } from "@/components/app-sidebar";
import Logo from "/logo.png";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Dropdown } from "@/components/drop-down";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useEffect, useState } from "react";

export default function DashboardLayout() {
  const [capsLock, setCapsLock] = useState(false);
  const [numLock, setNumLock] = useState(false);

  const year = new Date().getFullYear();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState("CapsLock"));
      setNumLock(e.getModifierState("NumLock"));
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  const location = useLocation();

  const breadcrumbMap: Record<string, string> = {
    "/dashboard": "",
    "/dashboard/partymaster": "Party Master",
    "/dashboard/vehiclemaster": "Vehicle Master",
    "/dashboard/citymaster": "City Master",
    "/dashboard/drivermaster": "Driver Master",
    "/dashboard/productdetailsmaster": "Product Details Master",
  };

  console.log(location.pathname);

  const currentPath = breadcrumbMap[location.pathname] || "";

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center  gap-2 border-b  ">
            <div className=" w-full flex items-center justify-between p-2">
              <div className="flex items-center gap-2 px-3 ">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>
                        <Link to="/dashboard">Dashboard</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPath}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className=" flex items-center gap-2">
                <Dropdown />
                <ThemeToggle />
              </div>
            </div>
          </header>
          {/* <div className="flex flex-1 flex-col gap-4 p-4 bg-fuchsia-900"> */}
          <div className="flex flex-1 flex-col  bg-muted/80">
            <div className=" h-full gap-4  p-4">
              <Outlet />
            </div>

            <div className=" bg-black p-1 m-0  ">
              <div className="flex justify-between">
                <div className="flex">
                  <img className="h-5 ps-2 pe-1" src={Logo} alt="" />
                  <p className="flex">
                    <div className="flex ps-1 font-sans text-sm text-white">
                      {" "}
                      leaf <p className="text-[#9BCE40] ps-0.5">ai</p>
                    </div>{" "}
                  </p>
                  <p className="text-gray-400 flex justify-center items-end ps-2 text-xs">
                    &copy; {year} all rights reserved.
                  </p>
                </div>

                <KbdGroup>
                  <Kbd
                    className={
                      capsLock
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    Caps Lock
                  </Kbd>
                  <Kbd
                    className={
                      numLock
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    Num Lock
                  </Kbd>
                </KbdGroup>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
