"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

// Define the interface for individual score band data from the API
interface ScoreBandData {
  score_band: string // e.g., "0-20", "21-40", etc.
  total_questions: number
  solved: number
  success_rate: number
}

// Define the interface for the chart data structure
interface ChartData {
  "Score Band": string
  "Total Questions": number
  "Solved Questions": number
  "Success Rate": number
}

// Define props interface for the component
interface ScoreBandPerformanceChartProps {
  data: ScoreBandData[]
}

const ScoreBandPerformanceChart = ({ data }: ScoreBandPerformanceChartProps) => {
  const chartData: ChartData[] = data.map((band) => ({
    "Score Band": band.score_band,
    "Total Questions": band.total_questions,
    "Solved Questions": band.solved,
    "Success Rate": band.success_rate,
  }))

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Score Band Performance</h3>
        <BarChart
          data={chartData}
          index="Score Band"
          categories={["Total Questions", "Solved Questions", "Success Rate"]}
          colors={["#3b82f6", "#10b981", "#f59e0b"]}
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          className="h-[400px]"
        />
      </CardContent>
    </Card>
  )
}

export default ScoreBandPerformanceChart