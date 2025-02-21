"use client"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart } from "@/components/ui/chart"

const SkillPerformanceChart = ({ data }) => {
  const chartData = data.map((skill) => ({
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
          valueFormatter={(value) => `${value}`}
          yAxisWidth={48}
          className="h-[400px]"
        />
      </CardContent>
    </Card>
  )
}

export default SkillPerformanceChart

