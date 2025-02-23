"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

// Define the interface for individual skill data from the API
interface SkillData {
  skill_desc: string // Description of the skill (e.g., "Algebra", "Programming")
  total_questions: number
  solved: number
  success_rate: number
}

// Define the interface for the chart data structure
interface ChartData {
  skill: string
  "Total Questions": number
  "Solved Questions": number
  "Success Rate": number
}

// Define props interface for the component
interface SkillPerformanceChartProps {
  data: SkillData[]
}

const SkillPerformanceChart = ({ data }: SkillPerformanceChartProps) => {
  const chartData: ChartData[] = data.map((skill) => ({
    skill: skill.skill_desc,
    "Total Questions": skill.total_questions,
    "Solved Questions": skill.solved,
    "Success Rate": skill.success_rate,
  }))

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-4">Skill Performance</h3>
        <BarChart
          data={chartData}
          index="skill"
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

export default SkillPerformanceChart