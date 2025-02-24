"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

const TimeAnalysisChart = ({ data }) => {
  const barData = [
    { name: "Avg Time Solved", value: Number.parseFloat(data.avg_time_solved) },
    { name: "Avg Time Unsolved", value: Number.parseFloat(data.avg_time_unsolved) },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white/70 dark:bg-slate-800/70">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Average Time: Solved vs Unsolved</h3>
          <BarChart
            data={barData}
            index="name"
            categories={["value"]}
            colors={["#3b82f6"]}
            valueFormatter={(value) => `${value.toFixed(2)} seconds`}
            yAxisWidth={48}
            className="h-80"
          />
        </CardContent>
      </Card>
      <Card className="bg-white/70 dark:bg-slate-800/70">
        <CardContent className="p-4 flex flex-col justify-center items-center h-full">
          <h3 className="text-lg font-semibold mb-4">Efficiency Ratio</h3>
          <div className="text-4xl font-bold">{Number.parseFloat(data.efficiency_ratio).toFixed(4)}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimeAnalysisChart

