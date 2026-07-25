import { AppSidebar } from "@/components/app-sidebar";
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
import { DialogStickyFooter } from "@/components/DialogStickyFooter";
import type { Dispatch, SetStateAction } from "react";
import { Outlet } from "react-router-dom";

type DashboardLayoutProps = {
  helpOpen: boolean;
  setHelpOpen: Dispatch<SetStateAction<boolean>>;
};

export default function DashboardLayout({
  helpOpen,
  setHelpOpen,
}: DashboardLayoutProps) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center  gap-2 border-b">
            <div className=" w-full flex items-center justify-between p-2">
              <div className="flex items-center gap-2 px-3 ">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
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
          <div className="flex flex-1 flex-col gap-4 p-4 bg-violet-700">
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />  */}
             <Outlet  />
          </div>
          {/* <div className="flex-1 p-4 bg-violet-950">
            <Outlet />
          </div> */}
        </SidebarInset>
      </SidebarProvider>

      <DialogStickyFooter
        open={helpOpen}
        onOpenChange={setHelpOpen}
      ></DialogStickyFooter>
    </>
  );
}
