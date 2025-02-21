"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

const CategoryPerformanceChart = ({ data }) => {
  const chartData = data.map((category) => ({
    category: category.primary_class_cd_desc,
    "Total Questions": category.total_questions,
    "Solved Questions": category.solved,
    "Success Rate": category.success_rate,
  }))

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
        <BarChart
          data={chartData}
          index="category"
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

export default CategoryPerformanceChart

