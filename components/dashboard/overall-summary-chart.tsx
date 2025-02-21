"use client"
import { Card, CardContent } from "@/components/ui/card"
import { DonutChart, BarChart } from "@/components/ui/chart"

const OverallSummaryChart = ({ data }) => {
  const donutData = [
    { name: "Solved", value: data.solved_questions },
    { name: "Unsolved", value: data.total_questions - data.solved_questions },
  ]

  const barData = [
    { name: "Success Rate", value: data.success_rate },
    { name: "Total Attempts", value: data.total_attempts },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="">
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
      <Card className="">
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

