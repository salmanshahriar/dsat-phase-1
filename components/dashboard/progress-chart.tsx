"use client"

import { useState } from "react"
import { LineChart } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

// Define interfaces for the input data from the API
interface ProgressDataItem {
  day?: string // Present in daily data
  week?: string // Present in weekly data
  month?: string // Present in monthly data
  total_questions: number
  solved: number
  success_rate: number
}

// Define the interface for the chart data structure
interface ChartData {
  date: string
  "Total Questions": number
  "Solved Questions": number
  "Success Rate": number
}

// Define props interface for the component
interface ProgressChartProps {
  daily: ProgressDataItem[]
  weekly: ProgressDataItem[]
  monthly: ProgressDataItem[]
}

const ProgressChart = ({ daily, weekly, monthly }: ProgressChartProps) => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("daily")

  const getData = (): ProgressDataItem[] => {
    switch (timeframe) {
      case "daily":
        return daily
      case "weekly":
        return weekly
      case "monthly":
        return monthly
      default:
        return daily
    }
  }

  const chartData: ChartData[] = getData().map((item) => ({
    date: item.day || item.week || item.month || "Unknown", // Fallback for missing date
    "Total Questions": item.total_questions,
    "Solved Questions": item.solved,
    "Success Rate": item.success_rate,
  }))

  return (
    <Card className="bg-white/70 dark:bg-slate-800/70">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Progress Over Time</h3>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <LineChart
          data={chartData}
          index="date"
          categories={["Total Questions", "Solved Questions", "Success Rate"]}
          colors={["#3b82f6", "#10b981", "#f59e0b"]}
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          className="h-[300px]"
        />
      </CardContent>
    </Card>
  )
}

export default ProgressChart