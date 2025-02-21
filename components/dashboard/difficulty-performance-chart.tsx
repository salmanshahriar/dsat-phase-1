"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

const DifficultyPerformanceChart = ({ data }) => {
  const chartData = data.map((difficulty) => ({
    difficulty: difficulty.difficulty,
    "Total Questions": difficulty.total_questions,
    "Solved Questions": difficulty.solved,
    "Success Rate": difficulty.success_rate,
    "Avg Time Taken": Number.parseFloat(difficulty.avg_time_taken),
  }))

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Performance by Difficulty</h3>
        <BarChart
          data={chartData}
          index="difficulty"
          categories={["Total Questions", "Solved Questions", "Success Rate", "Avg Time Taken"]}
          colors={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]}
          valueFormatter={(value) => `${value}`}
          yAxisWidth={48}
          className="h-[400px]"
        />
      </CardContent>
    </Card>
  )
}

export default DifficultyPerformanceChart

