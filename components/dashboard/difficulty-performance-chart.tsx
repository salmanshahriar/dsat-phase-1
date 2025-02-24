"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

// Define the interface for individual difficulty data from the API
interface DifficultyData {
  difficulty: string
  total_questions: number
  solved: number
  success_rate: number
  avg_time_taken: number | string // Allowing both as we parse it to float
}

// Define the interface for the chart data structure
interface ChartData {
  difficulty: string
  "Total Questions": number
  "Solved Questions": number
  "Success Rate": number
  "Avg Time Taken": number
}

// Define props interface for the component
interface DifficultyPerformanceChartProps {
  data: DifficultyData[]
}

const DifficultyPerformanceChart = ({ data }: DifficultyPerformanceChartProps) => {
  const chartData: ChartData[] = data.map((difficulty) => ({
    difficulty: difficulty.difficulty,
    "Total Questions": difficulty.total_questions,
    "Solved Questions": difficulty.solved,
    "Success Rate": difficulty.success_rate,
    "Avg Time Taken": Number.parseFloat(difficulty.avg_time_taken.toString()),
  }))

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Performance by Difficulty</h3>
        <BarChart
          data={chartData}
          index="difficulty"
          categories={["Total Questions", "Solved Questions", "Success Rate", "Avg Time Taken"]}
          colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          className="h-[400px]"
        />
      </CardContent>
    </Card>
  )
}

export default DifficultyPerformanceChart