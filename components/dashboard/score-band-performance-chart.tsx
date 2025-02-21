"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

const ScoreBandPerformanceChart = ({ data }) => {
  const chartData = data.map((band) => ({
    "Score Band": band.score_band,
    "Total Questions": band.total_questions,
    "Solved Questions": band.solved,
    "Success Rate": band.success_rate,
  }))

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Score Band Performance</h3>
        <BarChart
          data={chartData}
          index="Score Band"
          categories={["Total Questions", "Solved Questions", "Success Rate"]}
          colors={["#3b82f6", "#10b981", "#f59e0b"]}
          valueFormatter={(value) => `${value}`}
          yAxisWidth={48}
          className="h-[400px]"
        />
      </CardContent>
    </Card>
  )
}

export default ScoreBandPerformanceChart

