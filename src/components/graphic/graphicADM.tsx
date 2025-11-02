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

interface MoodEntry {
  date: string;
  Feliz?: number;
  "Muito feliz"?: number;
  Triste?: number;
  "Muito triste"?: number;
  Indiferente?: number;
  "Com raiva"?: number;
  Furioso?: number;
  Cansado?: number;
  Ansioso?: number;
  Envergonhado?: number;
  Péssimo?: number;
  Animado?: number;
}

interface EmotionsChartResponse {
  period: string;
  data: MoodEntry[];
  emotions: string[];
}

const chartConfig = {
  feliz: { label: "Feliz", color: "#FFD700" },
  "muito-feliz": { label: "Muito Feliz", color: "#FFA500" },
  triste: { label: "Triste", color: "#5DADE2" },
  "muito-triste": { label: "Muito Triste", color: "#3498DB" },
  indiferente: { label: "Indiferente", color: "#AAB7B8" },
  "com-raiva": { label: "Com Raiva", color: "#E67E22" },
  furioso: { label: "Furioso", color: "#E74C3C" },
  cansado: { label: "Cansado", color: "#85C1E9" },
  ansioso: { label: "Ansioso", color: "#F39C12" },
  envergonhado: { label: "Envergonhado", color: "#E8DAEF" },
  pessimo: { label: "Péssimo", color: "#C0392B" },
  animado: { label: "Animado", color: "#2ECC71" },
} as const;

type EmotionKey = keyof typeof chartConfig;

// Mapear emoções do backend para chaves do gráfico
const emotionKeyMap: Record<string, EmotionKey> = {
  Feliz: "feliz",
  "Muito feliz": "muito-feliz",
  Triste: "triste",
  "Muito triste": "muito-triste",
  Indiferente: "indiferente",
  "Com raiva": "com-raiva",
  Furioso: "furioso",
  Cansado: "cansado",
  Ansioso: "ansioso",
  Envergonhado: "envergonhado",
  Péssimo: "pessimo",
  Animado: "animado",
};

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const [chartData, setChartData] = React.useState<MoodEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchEmotionsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/emotions-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados das emoções");
        }

        const result: EmotionsChartResponse = await response.json();
        setChartData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionsData();
  }, []);

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date();
    let daysToSubtract = 90;

    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData
      .filter((item) => {
        const date = new Date(item.date);
        return date >= startDate;
      })
      .map((item) => {
        const transformedItem: Record<string, string | number> = {
          date: item.date,
        };

        // Transformar as chaves das emoções do backend para o formato do gráfico
        Object.entries(item).forEach(([key, value]) => {
          if (key !== "date" && typeof value === "number") {
            const mappedKey = emotionKeyMap[key];
            if (mappedKey) {
              transformedItem[mappedKey] = value;
            }
          }
        });

        return transformedItem;
      });
  }, [chartData, timeRange]);

  if (loading) {
    return (
      <Card className="pt-0">
        <CardHeader>
          <CardTitle>Emoções</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-muted-foreground">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="pt-0">
        <CardHeader>
          <CardTitle>Emoções</CardTitle>
          <CardDescription>Erro ao carregar dados</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

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
        {filteredData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-muted-foreground">
              Nenhum dado disponível para o período selecionado
            </div>
          </div>
        ) : (
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
                tickFormatter={(value: string) => {
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
                      return new Date(value as string).toLocaleDateString(
                        "pt-br",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      );
                    }}
                    indicator="dot"
                    className="max-w-[200px] text-xs"
                  />
                }
              />

              {(Object.keys(chartConfig) as EmotionKey[]).map((key) => {
                const isZero = filteredData.every(
                  (d) => !d[key] || d[key] === 0
                );
                return (
                  <Area
                    key={key}
                    dataKey={key}
                    type="natural"
                    fill={`url(#fill-${key})`}
                    stroke={chartConfig[key].color}
                    strokeOpacity={isZero ? 0 : 1}
                    fillOpacity={isZero ? 0 : 1}
                    stackId={key}
                    connectNulls={false}
                  />
                );
              })}
              <ChartLegend
                content={
                  <ChartLegendContent className="flex-wrap justify-center gap-2 text-xs" />
                }
                wrapperStyle={{ paddingTop: "10px" }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
