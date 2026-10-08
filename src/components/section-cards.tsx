import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardData } from "@/types/dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SectionCardsProps {
  data: DashboardData;
}

export function SectionCards({ data }: SectionCardsProps) {
  const current_lr = data.monthlyLrs[0]?.totalLrs ?? 0;
  const previous_lr = data.monthlyLrs[1]?.totalLrs ?? 0;

  debugger
  const current_memo = data.monthlyMemos[0]?.totalMemos ?? 0;
  const previous_memo = data.monthlyMemos[1]?.totalMemos ?? 0;

  const lrPercentageChange = previous_lr === 0 ? 0 : ((current_lr - previous_lr) / previous_lr) * 100;
  const memoPercentageChange = current_memo === 0 ? 0 : ((current_memo - previous_memo) / previous_memo) * 100;

  return (
    <div className="grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lr's</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data.monthlyLrs[0]?.totalLrs ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {lrPercentageChange >= 0 ? <TrendingUp /> : <TrendingDown />}
              {Math.abs(lrPercentageChange).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {lrPercentageChange > 0 ? (
              <>
                Trending up this month <TrendingUp className="size-4" />
              </>
            ) : (
              <>
                Trending down this month <TrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Memo's</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
             {data.monthlyMemos[0]?.totalMemos ?? 0}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {memoPercentageChange >= 0 ? <TrendingUp /> : <TrendingDown />}
              {Math.abs(memoPercentageChange).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {memoPercentageChange > 0 ? (
              <>
                Trending up this month <TrendingUp className="size-4" />
              </>
            ) : (
              <>
                Trending down this month <TrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">Compared to last month</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Destinations</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            50
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Freight</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>

      {/* <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>  */}
    </div>
  );
}
