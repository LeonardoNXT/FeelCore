"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "An interactive area chart";
const chartData = [
  {
    date: "2025-05-12",
    feliz: 100,
    sorridente: 80,
    triste: 60,
    chorando: 20,
    neutro: 40,
    bravo: 25,
    furioso: 15,
    suando: 10,
    chocado: 30,
    coco: 5,
    cansado: 12,
    fogo: 50,
  },
  {
    date: "2025-05-13",
    feliz: 90,
    sorridente: 85,
    triste: 55,
    chorando: 18,
    neutro: 35,
    bravo: 20,
    furioso: 12,
    suando: 9,
    chocado: 28,
    coco: 6,
    cansado: 14,
    fogo: 45,
  },
  {
    date: "2025-05-14",
    feliz: 95,
    sorridente: 78,
    triste: 70,
    chorando: 25,
    neutro: 38,
    bravo: 30,
    furioso: 17,
    suando: 11,
    chocado: 32,
    coco: 4,
    cansado: 16,
    fogo: 55,
  },
  {
    date: "2025-05-15",
    feliz: 85,
    sorridente: 70,
    triste: 65,
    chorando: 22,
    neutro: 42,
    bravo: 28,
    furioso: 14,
    suando: 13,
    chocado: 27,
    coco: 7,
    cansado: 10,
    fogo: 52,
  },
  {
    date: "2025-05-16",
    feliz: 105,
    sorridente: 88,
    triste: 50,
    chorando: 19,
    neutro: 36,
    bravo: 22,
    furioso: 16,
    suando: 12,
    chocado: 35,
    coco: 8,
    cansado: 13,
    fogo: 48,
  },
  {
    date: "2025-05-17",
    feliz: 92,
    sorridente: 76,
    triste: 58,
    chorando: 21,
    neutro: 39,
    bravo: 27,
    furioso: 13,
    suando: 8,
    chocado: 31,
    coco: 5,
    cansado: 15,
    fogo: 53,
  },
];

const chartConfig = {
  feliz: { label: "Feliz", color: "#FFD700" },
  sorridente: { label: "Perfeito", color: "#FFEA00" },
  triste: { label: "Triste", color: "#5DADE2" },
  chorando: { label: "Horrível", color: "#3498DB" },
  neutro: { label: "Neutro", color: "#AAB7B8" },
  bravo: { label: "Irritante", color: "#E67E22" },
  furioso: { label: "Estressante", color: "#E74C3C" },
  suando: { label: "Cansativo", color: "#85C1E9" },
  chocado: { label: "Chocante", color: "#F7DC6F" },
  coco: { label: "Bosta", color: "#784212" },
  cansado: { label: "Cansativo", color: "#95A5A6" },
  fogo: { label: "Intenso", color: "#FF4500" },
} as const;

type EmotionKey = keyof typeof chartConfig;

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-3 sm:py-5 sm:flex-row flex-col">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-lg sm:text-xl">Emoções</CardTitle>
          <CardDescription className="text-sm">
            Mostra as emoções dos usuários dos últimos 3 meses.
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Últimos 30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Últimos 7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-3 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] sm:h-[250px] lg:h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {(Object.keys(chartConfig) as EmotionKey[]).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[key].color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[key].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-br", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-br", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                  className="max-w-[200px] text-xs"
                />
              }
            />
            {(Object.keys(chartConfig) as (keyof typeof chartConfig)[]).map(
              (key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#fill-${key})`}
                  stroke={chartConfig[key].color}
                  stackId="a"
                />
              )
            )}
            <ChartLegend
              content={
                <ChartLegendContent className="flex-wrap justify-center gap-2 text-xs" />
              }
              wrapperStyle={{ paddingTop: "10px" }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
