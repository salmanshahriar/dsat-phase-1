"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

// Define the interface for individual category data from the API
interface CategoryData {
  primary_class_cd_desc: string
  total_questions: number
  solved: number
  success_rate: number
}

// Define the interface for the chart data structure
interface ChartData {
  category: string
  "Total Questions": number
  "Solved Questions": number
  "Success Rate": number
}

// Define props interface for the component
interface CategoryPerformanceChartProps {
  data: CategoryData[]
}

const CategoryPerformanceChart = ({ data }: CategoryPerformanceChartProps) => {
  const chartData: ChartData[] = data.map((category) => ({
    category: category.primary_class_cd_desc,
    "Total Questions": category.total_questions,
    "Solved Questions": category.solved,
    "Success Rate": category.success_rate,
  }))

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Performance by Category</h3>
        <BarChart
          data={chartData}
          index="category"
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

export default CategoryPerformanceChart