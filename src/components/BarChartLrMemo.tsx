"use client";

import { Bar, BarChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { DashboardData } from "@/types/dashboard";
import { TrendingUp } from "lucide-react";

interface BarChartProps {
  data: DashboardData;
}

const chartConfig = {
  totalLrs: {
    label: "LRs",
    color: "var(--chart-1)",
  },
  totalMemos: {
    label: "Memos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function BarChartLrMemo({
  data,
}: BarChartProps) {
  const chartData = Array.from(
    new Set([
      ...data.monthlyLrs.map((item) => item.monthNo),
      ...data.monthlyMemos.map((item) => item.monthNo),
    ]),
  )
    .sort((a, b) => a - b)
    .map((monthNo) => {
      const lr = data.monthlyLrs.find(
        (item) => item.monthNo === monthNo,
      );

      const memo = data.monthlyMemos.find(
        (item) => item.monthNo === monthNo,
      );

      return {
        month: lr?.month ?? memo?.month ?? "",
        monthNo,
        totalLrs: lr?.totalLrs ?? 0,
        totalMemos: memo?.totalMemos ?? 0,
      };
    });

  const currentMonth = chartData[chartData.length - 1];

  const previousMonth =
    chartData.length > 1
      ? chartData[chartData.length - 2]
      : undefined;

  const currentTotal =
    (currentMonth?.totalLrs ?? 0) +
    (currentMonth?.totalMemos ?? 0);

  const previousTotal =
    (previousMonth?.totalLrs ?? 0) +
    (previousMonth?.totalMemos ?? 0);

  const percentageChange =
    previousTotal > 0
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0;

  const isIncrease = percentageChange >= 0;

  if (chartData.length === 0) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>LRs & Memos</CardTitle>
          <CardDescription>
            Monthly LRs and Memos
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading...
          </p>
        </CardContent>
      </Card>
    );
  }

  const year = localStorage.getItem("current_year")

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>LRs & Memos</CardTitle>
        <CardDescription>
          FY {year}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="h-[260px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.slice(0, 3)
              }
            />

            <Bar
              dataKey="totalLrs"
              stackId="a"
              fill="var(--color-totalLrs)"
              radius={[0, 0, 4, 4]}
            />

            <Bar
              dataKey="totalMemos"
              stackId="a"
              fill="var(--color-totalMemos)"
              radius={[4, 4, 0, 0]}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="w-[180px]"
                  formatter={(
                    value,
                    name,
                    item,
                    index,
                  ) => (
                    <>
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                        style={
                          {
                            "--color-bg":
                              `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />

                      {chartConfig[
                        name as keyof typeof chartConfig
                      ]?.label || name}

                      <div className="ml-auto font-mono font-medium tabular-nums">
                        {Number(value).toLocaleString()}
                      </div>

                      {index === 1 && (
                        <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                          <span>Total</span>

                          <span className="ml-auto font-mono font-medium tabular-nums">
                            {(
                              (item.payload.totalLrs ?? 0) +
                              (item.payload.totalMemos ?? 0)
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {isIncrease ? (
            <>
              Trending up by{" "}
              {Math.abs(percentageChange).toFixed(1)}%
              this month
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by{" "}
              {Math.abs(percentageChange).toFixed(1)}%
              this month
            </>
          )}
        </div>

        <div className="leading-none text-muted-foreground">
          Showing monthly LR and Memo totals
        </div>
      </CardFooter>
    </Card>
  );
}