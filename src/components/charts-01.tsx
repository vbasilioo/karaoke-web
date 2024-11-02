"use client"

import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useGetStats } from "@/hook/stats/use-get-stats"

export default function MusicCharts() {
  const { data } = useGetStats();

  const chartData = data?.data.data.map(item => ({
    name: item.music.name,
    requests: item.request_count
  })) || [];

  console.log('chartData: ', chartData);

  return (
    <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
      <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
        <Card
          x-chunk="Um gráfico de barras mostrando a contagem de solicitações para diferentes músicas nos últimos 7 dias."
          className="lg:max-w-md"
        >
          <CardHeader className="space-y-0 pb-2">
            <CardDescription>Solicitações nos Últimos 7 Dias</CardDescription>
            <CardTitle className="text-4xl tabular-nums">
              Principais Solicitações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                requests: {
                  label: "Solicitações",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <BarChart
                accessibilityLayer
                margin={{
                  left: -4,
                  right: -4,
                }}
                data={chartData}
              >
                <Bar
                  dataKey="requests"
                  fill="var(--color-requests)"
                  radius={5}
                  fillOpacity={0.6}
                  activeBar={<Rectangle fillOpacity={0.8} />}
                />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={4}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      hideIndicator
                      labelFormatter={(value) => value}
                    />
                  }
                  cursor={false}
                />
                <ReferenceLine
                  y={10}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                >
                  <Label
                    position="insideBottomLeft"
                    value="Solicitações Médias"
                    offset={10}
                    fill="hsl(var(--foreground))"
                  />
                </ReferenceLine>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-1">
            {chartData.length > 0 && (
              <CardDescription>
                Nos últimos 7 dias, a música mais solicitada foi:{" "}
                <span className="font-medium text-foreground">
                  {chartData[0].name} com {chartData[0].requests} solicitações.
                </span>
              </CardDescription>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
