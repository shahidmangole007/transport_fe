"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts/types/polar/Pie";

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
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TrendingDown, TrendingUp } from "lucide-react";

import type { NewParty } from "@/types/dashboard";

export const description = "Monthly new parties";

interface DonutChartProps {
  data: NewParty[];
}

const chartConfig = {
  january: {
    label: "January",
    color: "var(--chart-1)",
  },
  february: {
    label: "February",
    color: "var(--chart-2)",
  },
  march: {
    label: "March",
    color: "var(--chart-3)",
  },
  april: {
    label: "April",
    color: "var(--chart-4)",
  },
  may: {
    label: "May",
    color: "var(--chart-5)",
  },
  june: {
    label: "June",
    color: "var(--chart-1)",
  },
  july: {
    label: "July",
    color: "var(--chart-2)",
  },
  august: {
    label: "August",
    color: "var(--chart-3)",
  },
  september: {
    label: "September",
    color: "var(--chart-4)",
  },
  october: {
    label: "October",
    color: "var(--chart-5)",
  },
  november: {
    label: "November",
    color: "var(--chart-1)",
  },
  december: {
    label: "December",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function DonutChart({ data }: DonutChartProps) {

  const partyData = React.useMemo(() => {
    return [...data]
      .sort((a, b) => a.monthNo - b.monthNo)
      .map((item) => {
        const month = item.month.trim().toLowerCase();

        return {
          ...item,
          month,
          newParties: Number(item.newParties),
          fill: `var(--color-${month})`,
        };
      });
  }, [data]);

  const [activeMonth, setActiveMonth] = React.useState<string>("");

  React.useEffect(() => {
    if (partyData.length === 0) {
      setActiveMonth("");
      return;
    }

    const currentMonth = new Date()
      .toLocaleString("en-US", {
        month: "long",
      })
      .toLowerCase();

    const currentMonthData = partyData.find(
      (item) => item.month === currentMonth,
    );

    setActiveMonth(
      currentMonthData
        ? currentMonth
        : partyData[partyData.length - 1]?.month ?? "",
    );
  }, [partyData]);

  const id = "monthly-parties";


  const activeIndex = React.useMemo(
    () => partyData.findIndex((item) => item.month === activeMonth),
    [activeMonth, partyData],
  );


  const months = React.useMemo(
    () => partyData.map((item) => item.month),
    [partyData],
  );


  const renderPieShape = React.useCallback(
    ({ index, outerRadius = 0, ...props }: PieSectorShapeProps) => {
      if (index === activeIndex) {
        return (
          <g>
            <Sector
              {...props}
              outerRadius={outerRadius + 10}
            />

            <Sector
              {...props}
              outerRadius={outerRadius + 25}
              innerRadius={outerRadius + 12}
            />
          </g>
        );
      }

      return (
        <Sector
          {...props}
          outerRadius={outerRadius}
        />
      );
    },
    [activeIndex],
  );


  if (partyData.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>New Parties</CardTitle>
          <CardDescription>
            Last 6 months
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

 
  const activeParty =
    activeIndex >= 0
      ? partyData[activeIndex]
      : partyData[partyData.length - 1];


  const currentIndex = activeIndex;

  const currentValue =
    currentIndex >= 0
      ? partyData[currentIndex]?.newParties ?? 0
      : 0;

  const previousValue =
    currentIndex > 0
      ? partyData[currentIndex - 1]?.newParties ?? 0
      : 0;

 
  const percentageChange =
    previousValue > 0
      ? ((currentValue - previousValue) / previousValue) * 100
      : 0;

  const isIncrease = percentageChange >= 0;

  return (
    <Card
      data-chart={id}
      className="flex flex-col"
    >
      <ChartStyle
        id={id}
        config={chartConfig}
      />

      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>New Parties</CardTitle>

          <CardDescription>
            Last 6 months
          </CardDescription>
        </div>

        <Select
          value={activeMonth}
          onValueChange={setActiveMonth}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select month"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>

          <SelectContent
            align="end"
            className="rounded-xl"
          >
            {months.map((month) => {
              const config =
                chartConfig[
                  month as keyof typeof chartConfig
                ];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={month}
                  value={month}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor:
                          `var(--color-${month})`,
                      }}
                    />

                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent hideLabel />
              }
            />

            <Pie
              data={partyData}
              dataKey="newParties"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
              shape={renderPieShape}
            >
              <Label
                content={({ viewBox }) => {
                  if (
                    viewBox &&
                    "cx" in viewBox &&
                    "cy" in viewBox
                  ) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeParty.newParties.toLocaleString()}
                        </tspan>

                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          New Parties
                        </tspan>
                      </text>
                    );
                  }

                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          {isIncrease ? (
            <>
              Trending up by{" "}
              {Math.abs(percentageChange).toFixed(1)}%
              from previous month
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by{" "}
              {Math.abs(percentageChange).toFixed(1)}%
              from previous month
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>

        <div className="leading-none text-muted-foreground">
          Showing total new parties for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}