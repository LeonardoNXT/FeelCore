"use client";

import * as React from "react";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardMetrics {
  accountsCreated: {
    title: string;
    value: string;
    rawValue: number;
    change: string;
    percentageChange: number;
    trend: string;
    message: string;
    isPositive: boolean;
  };
  mood: {
    title: string;
    emotion: string;
    change: string;
    percentageChange: number;
    monthTrend: string;
    trendMessage: string;
    message: string;
    totalMoods: number;
    isPositive: boolean;
    distribution: Record<string, number>;
  };
}

export function SectionCards() {
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/all-metrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar métricas do dashboard");
        }

        const data: DashboardMetrics = await response.json();
        setMetrics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-[1vw]">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="h-4 bg-muted rounded w-32 mb-2"></div>
              <div className="h-8 bg-muted rounded w-24"></div>
            </CardHeader>
            <CardFooter className="pt-0">
              <div className="h-4 bg-muted rounded w-full"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-[1vw]">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Erro ao carregar métricas
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-[1vw] *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      {/* Card de Emoção do Momento */}
      <Card className="@container/card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardDescription className="text-xs sm:text-sm">
            {metrics.mood.title}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            {metrics.mood.emotion}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              {metrics.mood.isPositive ? (
                <IconTrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <IconTrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {metrics.mood.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 sm:gap-1.5 text-xs sm:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 sm:gap-2 font-medium">
            <span className="truncate">{metrics.mood.trendMessage}</span>
            {metrics.mood.isPositive ? (
              <IconTrendingUp className="size-3 sm:size-4 flex-shrink-0" />
            ) : (
              <IconTrendingDown className="size-3 sm:size-4 flex-shrink-0" />
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            {metrics.mood.message}
          </div>
        </CardFooter>
      </Card>

      {/* Card de Contas Criadas */}
      <Card className="@container/card">
        <CardHeader className="pb-3 sm:pb-6">
          <CardDescription className="text-xs sm:text-sm">
            {metrics.accountsCreated.title}
          </CardDescription>
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-semibold tabular-nums">
            {metrics.accountsCreated.value}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-xs">
              {metrics.accountsCreated.isPositive ? (
                <IconTrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              ) : (
                <IconTrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              {metrics.accountsCreated.change}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 sm:gap-1.5 text-xs sm:text-sm pt-0">
          <div className="line-clamp-1 flex gap-1 sm:gap-2 font-medium">
            <span className="truncate">{metrics.accountsCreated.trend}</span>
            {metrics.accountsCreated.isPositive ? (
              <IconTrendingUp className="size-3 sm:size-4 flex-shrink-0" />
            ) : (
              <IconTrendingDown className="size-3 sm:size-4 flex-shrink-0" />
            )}
          </div>
          <div className="text-muted-foreground text-xs">
            {metrics.accountsCreated.message}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
