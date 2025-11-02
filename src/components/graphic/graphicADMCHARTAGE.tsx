/* eslint-disable */
"use client";

import * as React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface AgeDistributionData {
  range: string;
  count: number;
  percentage: string;
}

interface AgeDistributionResponse {
  averageAge: number;
  distribution: AgeDistributionData[];
  totalCustomers: number;
  dominantRange: string;
  recentDistribution: Record<string, number>;
}

const chartConfig = {
  count: {
    label: "Usuários",
  },
  "0-13": {
    label: "0-13 anos",
    color: "hsl(var(--chart-1))",
  },
  "14-16": {
    label: "14-16 anos",
    color: "hsl(var(--chart-2))",
  },
  "17-24": {
    label: "17-24 anos",
    color: "hsl(var(--chart-3))",
  },
  "25-32": {
    label: "25-32 anos",
    color: "hsl(var(--chart-4))",
  },
  "33-44": {
    label: "33-44 anos",
    color: "hsl(var(--chart-5))",
  },
  "45+": {
    label: "45+ anos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ChartPieDonutText() {
  const [ageData, setAgeData] = React.useState<AgeDistributionResponse | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAgeDistribution = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/age-distribution", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar distribuição de idades");
        }

        const result: AgeDistributionResponse = await response.json();
        setAgeData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchAgeDistribution();
  }, []);

  const chartData = React.useMemo(() => {
    if (!ageData) return [];

    return ageData.distribution
      .filter((item) => item.count > 0)
      .map((item) => ({
        range: item.range,
        count: item.count,
        fill: `var(--color-${item.range})`,
      }));
  }, [ageData]);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  // Calcular variação da faixa dominante
  const dominantRangeTrend = React.useMemo(() => {
    if (!ageData) return null;

    const currentCount =
      ageData.distribution.find((d) => d.range === ageData.dominantRange)
        ?.count || 0;
    const previousCount =
      ageData.recentDistribution[ageData.dominantRange] || 0;

    if (previousCount === 0) return null;

    const percentageChange =
      ((currentCount - previousCount) / previousCount) * 100;
    return {
      value: Math.abs(percentageChange).toFixed(1),
      isPositive: percentageChange >= 0,
    };
  }, [ageData]);

  if (loading) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Idade</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Idade</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!ageData || chartData.length === 0) {
    return (
      <Card className="flex flex-col w-full h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Idade</CardTitle>
          <CardDescription>Distribuição de idades</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground">
            Nenhum dado de idade disponível
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Idade</CardTitle>
        <CardDescription>Distribuição por faixa etária</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="range"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          {ageData.averageAge}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Anos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {dominantRangeTrend && (
          <div className="flex items-center gap-2 leading-none font-medium">
            {
              chartConfig[ageData.dominantRange as keyof typeof chartConfig]
                .label
            }{" "}
            {dominantRangeTrend.isPositive ? "cresceu" : "diminuiu"}{" "}
            {dominantRangeTrend.value}% no último mês{" "}
            {dominantRangeTrend.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="text-muted-foreground leading-none">
          Média de idade: {ageData.averageAge} anos ({ageData.totalCustomers}{" "}
          usuários)
        </div>
      </CardFooter>
    </Card>
  );
}
