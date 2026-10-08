"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  XAxis,
} from "recharts";
import type { BarShapeProps } from "recharts/types/cartesian/Bar";

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

import type { TopCity } from "@/types/dashboard";

interface DestinationProps {
  data: TopCity[];
}

export function TopDestinationChart({
  data,
}: DestinationProps) {
  const year =
    typeof window !== "undefined"
      ? localStorage.getItem("current_year")
      : "";

  const chartData = data.map((item, index) => ({
    ...item,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = {
    total: {
      label: "Total",
    },

    ...Object.fromEntries(
      data.map((item, index) => [
        item.city,
        {
          label: item.city,
          color: `var(--chart-${(index % 5) + 1})`,
        },
      ]),
    ),
  } satisfies ChartConfig;

  if (chartData.length === 0) {
    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <CardTitle>
            Most Active Destination Cities
          </CardTitle>

          <CardDescription>
            FY {year}
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

  const activeIndex = chartData.reduce(
    (maxIndex, item, index, array) =>
      item.total > array[maxIndex].total
        ? index
        : maxIndex,
    0,
  );

  const activeValue =
    chartData[activeIndex]?.total ?? 0;

  const secondValue =
    chartData.length > 1
      ? [...chartData].sort(
          (a, b) => b.total - a.total,
        )[1]?.total ?? 0
      : 0;

  const percentageChange =
    secondValue > 0
      ? ((activeValue - secondValue) / secondValue) * 100
      : 0;

  const isIncrease = percentageChange >= 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>
          Most Active Destination Cities
        </CardTitle>

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
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="city"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent hideLabel />
              }
            />

            <Bar
              dataKey="total"
              radius={8}
              strokeWidth={2}
              shape={({
                index,
                ...props
              }: BarShapeProps) => {
                const fill =
                  chartData[index]?.fill ??
                  "var(--chart-1)";

                if (index === activeIndex) {
                  return (
                    <Rectangle
                      {...props}
                      fill={fill}
                      fillOpacity={0.8}
                      stroke={fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  );
                }

                return (
                  <Rectangle
                    {...props}
                    fill={fill}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {isIncrease ? (
            <>
              Top destination is ahead by{" "}
              {percentageChange.toFixed(1)}%
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Top destination is down by{" "}
              {Math.abs(percentageChange).toFixed(1)}%
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>

        <div className="leading-none text-muted-foreground">
          Showing top active destination cities
        </div>
      </CardFooter>
    </Card>
  );
}