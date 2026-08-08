"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {  
  TerminalSquareIcon, 
  BotIcon, 
  BookOpenIcon, 
  Settings2Icon,  
  Truck,
  FolderRootIcon,
  BanknoteArrowUp,
  FileTextIcon,
  Settings,
  SquareSlash,
  BadgeInfoIcon
} from "lucide-react"
import { useTranslation } from "react-i18next"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();


  // This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  name: [
    {
      name: "Transport App",
      logo: (
        <Truck/>
      ),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: t("sidebar.master.master"),
      url: "#",
      icon: (
        <FolderRootIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: t("sidebar.master.partyMaster"),
          url: "/dashboard/partymaster",
        },
        {
          title: t("sidebar.master.vehicleMaster"),
          url: "/dashboard/vehiclemaster",
        },
        {
          title: t("sidebar.master.cityMaster"),
          url: "/dashboard/citymaster",
        },
        {
          title: t("sidebar.master.driverMaster"),
          url: "/dashboard/drivermaster",
        },
        {
          title: t("sidebar.master.productMaster"),
          url: "/dashboard/productdetailsmaster",
        },
      ],
    },
    {
      title: t("sidebar.transactions.transactions"),
      url: "#",
      icon: (
        <BanknoteArrowUp
        />
      ),
      items: [
        {
          title: t("sidebar.transactions.builty"),
          url: "#",
        },
        {
          title:  t("sidebar.transactions.memo"),
          url: "#",
        }
      ],
    },
    {
      title: t("sidebar.reports.reports"),
      url: "#",
      icon: (
        <FileTextIcon
        />
      ),
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title:  t("sidebar.settings.settings"),
      url: "#",
      icon: (
        <Settings
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title:  t("sidebar.shortcuts.shortcuts"),
      url: "#",
      icon: (
        <SquareSlash
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title:  t("sidebar.help.help"),
      url: "#",
      icon: (
        <BadgeInfoIcon
        />
      ),
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
 
}
  return (
    <Sidebar  collapsible="icon" {...props}>
      <SidebarHeader  >
        <TeamSwitcher teams={data.name} />
      </SidebarHeader>
      <SidebarContent  >
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter  >
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
