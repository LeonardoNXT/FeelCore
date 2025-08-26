"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Um gráfico de contratações dos últimos 3 meses";

const chartConfig = {
  views: {
    label: "Adições",
  },
  quantidade: {
    label: "Adições",
    color: "#fff",
  },
} satisfies ChartConfig;

interface ChartData {
  date: string;
  quantidade: number; // ✅ Mudou de string para number
}

export function GraficoDeContratacoes() {
  const [chartData, setChartData] = React.useState<ChartData[]>([]); // ✅ Corrigiu o tipo

  const getHiringDate = async () => {
    try {
      const response = await fetch("/api/employees/hirings", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const data = await response.json();
      console.log(data);
      setChartData(data); // ✅ Aplica os dados do backend ao estado
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getHiringDate();
  }, []);

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("quantidade");

  const total = React.useMemo(
    () => ({
      quantidade: chartData.reduce((acc, curr) => acc + curr.quantidade, 0),
    }),
    [chartData] // ✅ Adicionou chartData como dependência
  );

  return (
    <Card className="py-0 w-full h-full bg-[transparent] border-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle className="text-[#e0e0e0]">
            Gráfico Interativo - Adições ao sistema.
          </CardTitle>
          <CardDescription className="text-[#c5c5c5]">
            Mostra o total de contratação dos últimos 3 meses.
          </CardDescription>
        </div>
        <div className="flex">
          {["quantidade"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-[#1313138f] relative z-30 rounded-tr-[2vw] flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className=" text-xs text-[#ffffffa6]">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl text-center text-[#d4d4d4]">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-br", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-br", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
