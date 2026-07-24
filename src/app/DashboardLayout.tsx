import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"


export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4 ">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className=" w-full  flex justify-between items-center">
            <h1 className="text-large font-medium">Dashboard</h1>
            <div>
              <ThemeToggle/>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <p>Your page content goes here.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}