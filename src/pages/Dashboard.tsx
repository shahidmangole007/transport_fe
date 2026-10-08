// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { dashBoardData } from "@/api/dashboard.api";
import { BarChartLrMemo } from "@/components/BarChartLrMemo";
import { DonutChart } from "@/components/DonutChart";
import { SectionCards } from "@/components/section-cards";
import { TopDestinationChart } from "@/components/TopDestinationChart";
import type { DashboardData } from "@/types/dashboard";

import { useEffect, useState } from "react";

export default function Dashboard() {
  console.log("Dashboard component rendered");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    monthlyLrs: [],
    monthlyMemos: [],
    newParties: [],
    topCities: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await dashBoardData();
        debugger
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 ">
            <SectionCards data={dashboardData} />

            <div className="px-4 lg:px-6 grid  grid-cols-1  gap-6   md:grid-cols-3">
              <DonutChart data={dashboardData.newParties}  />
              <TopDestinationChart data={dashboardData.topCities} />
              <BarChartLrMemo data={dashboardData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
