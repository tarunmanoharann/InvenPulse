import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Client } from "@gradio/client"
import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

interface SentimentAnalysisResult {
  total_reviews: number;
  negative_percentage: number;
  neutral_percentage: number;
  positive_percentage: number;
  products_by_category: ProductsByCategory;
}

interface ProductsByCategory {
  negative: string[];
  positive: string[];
}

const chartConfig = {
  sentiment: {
    label: "Sentiment",
  },
  Positive: {
    label: "Positive",
    color: "hsl(var(--chart-1))",
  },
  Neutral: {
    label: "Neutral",
    color: "hsl(var(--chart-3))",
  },
  Negative: {
    label: "Negative",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function  PieChartDash() {
  const id = "pie-interactive"
  const [chartData, setChartData] = React.useState<{ name: string; value: number; fill: string }[]>([])
  const [totalVisitors, setTotalVisitors] = React.useState(0)
  const [activeSentiment, setActiveSentiment] = React.useState("Positive")
  const [pieload, setPieload] = React.useState(true)
const [sentiRev,setSentiRev] = React.useState(0)
  React.useEffect(() => {
    const fetchSenti = async () => {
        const client = await Client.connect("YashwanthSC/Sentina");
        const result = await client.predict("/lambda", { });
      const data = (result.data as unknown[])[0] as SentimentAnalysisResult

      const processedData = [
        { name: "Positive", value: data.positive_percentage, fill: "hsl(var(--chart-1))" },
        { name: "Neutral", value: data.neutral_percentage, fill: "hsl(var(--chart-3))" },
        { name: "Negative", value: data.negative_percentage, fill: "hsl(var(--chart-5))" },
      ]

      setChartData(processedData)
      setTotalVisitors(data.total_reviews)
      setPieload(false)
    }

    fetchSenti()
  }, [])

  React.useEffect(() => {
    const sentimentIndex = chartData.findIndex((item) => item.name === activeSentiment)
    if (sentimentIndex !== -1) {
      setSentiRev(Math.round((totalVisitors * chartData[sentimentIndex].value) / 100))
    }
  }, [activeSentiment, chartData, totalVisitors])

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeSentiment),
    [activeSentiment, chartData]
  )
  const sentiments = React.useMemo(() => chartData.map((item) => item.name), [chartData])

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Sentiment Analysis</CardTitle>
          <CardDescription>Analysis of <span className="font-bold">{totalVisitors}</span> Reviews</CardDescription>
        </div>
        {!pieload ?(<Select value={activeSentiment} onValueChange={setActiveSentiment}>
          <SelectTrigger className="ml-auto w-[160px] rounded-xl pl-2.5" aria-label="Select a sentiment">
            <SelectValue placeholder="Select sentiment" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {sentiments.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig]

              if (!config) {
                return null
              }

              return (
                <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: `var(--color-${key})` }} />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>):(
            <div></div>
        )}
        
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer id={id} config={chartConfig} className="mx-auto aspect-square w-full max-w-[300px]">
          {!pieload ? (
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 10} />
                    <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                            {sentiRev.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Reviews
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          ) : (
            <div className="h-full w-full flex justify-center items-center">Our AI is working out the sentiments...</div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
