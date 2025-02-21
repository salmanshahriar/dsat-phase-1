"use client"

import { useState } from "react"
import { LineChart } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

const ProgressChart = ({ daily, weekly, monthly }) => {
  const [timeframe, setTimeframe] = useState("daily")

  const getData = () => {
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

  const chartData = getData().map((item) => ({
    date: item.day || item.week || item.month,
    "Total Questions": item.total_questions,
    "Solved Questions": item.solved,
    "Success Rate": item.success_rate,
  }))

  return (
    <Card className="">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Progress Over Time</h3>
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
          valueFormatter={(value) => `${value}`}
          yAxisWidth={48}
          className="h-[300px]"
        />
      </CardContent>
    </Card>
  )
}

export default ProgressChart

