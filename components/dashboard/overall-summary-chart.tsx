"use client"
import { Card, CardContent } from "@/components/ui/card"
import { DonutChart, BarChart } from "@/components/ui/chart"

// Define the interface for the input data from the API
interface OverallSummaryData {
  solved_questions: number
  total_questions: number
  success_rate: number
  total_attempts: number
}

// Define the interface for the DonutChart data structure
interface DonutChartData {
  name: string
  value: number
}

// Define the interface for the BarChart data structure
interface BarChartData {
  name: string
  value: number
}

// Define props interface for the component
interface OverallSummaryChartProps {
  data: OverallSummaryData
}

const OverallSummaryChart = ({ data }: OverallSummaryChartProps) => {
  const donutData: DonutChartData[] = [
    { name: "Solved", value: data.solved_questions },
    { name: "Unsolved", value: Math.max(0, data.total_questions - data.solved_questions) }, // Prevent negative values
  ]

  const barData: BarChartData[] = [
    { name: "Success Rate", value: data.success_rate },
    { name: "Total Attempts", value: data.total_attempts },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Questions Solved</h3>
          <DonutChart
            data={donutData}
            index="name"
            category="value"
            valueFormatter={(value) => `${value} questions`}
            colors={["#3b82f6", "#1f2937"]}
            className="h-64"
          />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Success Rate & Attempts</h3>
          <BarChart
            data={barData}
            index="name"
            categories={["value"]}
            colors={["#3b82f6"]}
            valueFormatter={(value) => `${value}`}
            yAxisWidth={48}
            className="h-64"
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default OverallSummaryChart