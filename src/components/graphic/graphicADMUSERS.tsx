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

interface PatientsChartData {
  date: string;
  quantidade: number;
}

interface PatientsChartResponse {
  period: string;
  data: PatientsChartData[];
  total: number;
}

const chartConfig = {
  quantidade: {
    label: "Cadastros",
    color: "#3d251e",
  },
} satisfies ChartConfig;

export function ChartBarInteractive() {
  const [chartData, setChartData] = React.useState<PatientsChartData[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/patients-chart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Erro ao buscar dados dos pacientes");
        }

        const result: PatientsChartResponse = await response.json();

        // Converter datas do formato DD/MM/YYYY para YYYY-MM-DD para o gráfico
        const formattedData = result.data.map((item) => {
          const [day, month, year] = item.date.split("/");
          return {
            date: `${year}-${month}-${day}`,
            quantidade: item.quantidade,
          };
        });

        setChartData(formattedData);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientsData();
  }, []);

  if (loading) {
    return (
      <Card className="py-0 h-full">
        <CardHeader className="flex flex-col items-stretch border-b !p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Carregando dados...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="text-muted-foreground">Carregando...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="py-0 h-full">
        <CardHeader className="flex flex-col items-stretch border-b !p-0">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3">
            <CardTitle>Usuários</CardTitle>
            <CardDescription>Erro ao carregar dados</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
          <div className="text-destructive">{error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0 h-full">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-6">
          <CardTitle>Usuários</CardTitle>
          <CardDescription>
            Mostra os usuários cadastrados nos últimos 3 meses.
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6">
            <span className="text-muted-foreground text-xs">Total</span>
            <span className="text-lg leading-none font-bold sm:text-3xl">
              {total.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-muted-foreground">
              Nenhum dado disponível para o período selecionado
            </div>
          </div>
        ) : (
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
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey="quantidade"
                fill="var(--color-quantidade)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
