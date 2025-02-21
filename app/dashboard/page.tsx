// import OverallSummaryChart from "@/components/dashboard/overall-summary-chart"
// import SkillPerformanceChart from "@/components/dashboard/skill-performance-chart"
// import DifficultyPerformanceChart from "@/components/dashboard/difficulty-performance-chart"
// import TimeAnalysisChart from "@/components/dashboard/time-analysis-chart"
// import CategoryPerformanceChart from "@/components/dashboard/category-performance-chart"
// import ScoreBandPerformanceChart from "@/components/dashboard/score-band-performance-chart"
// import ProgressChart from "@/components/dashboard/progress-chart"

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import OverallSummaryChart from "@/components/dashboard/overall-summary-chart"
import SkillPerformanceChart from "@/components/dashboard/skill-performance-chart"
import DifficultyPerformanceChart from "@/components/dashboard/difficulty-performance-chart"
import TimeAnalysisChart from "@/components/dashboard/time-analysis-chart"
import CategoryPerformanceChart from "@/components/dashboard/category-performance-chart"
import ScoreBandPerformanceChart from "@/components/dashboard/score-band-performance-chart"
import ProgressChart from "@/components/dashboard/progress-chart"
import { BookOpen, Brain, Clock, Target } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const sessionData = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('session_data='))?.split('=')[1] || "" : ""

export default function Dashboard() {
  const [performanceData, setPerformanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/performance", {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${sessionData}`,
          },
        })
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setPerformanceData(data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-screen">Error: {error}</div>
  if (!performanceData) return <div className="flex items-center justify-center h-screen">No data available</div>

  const { overall_summary } = performanceData

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Performance Dashboard</h1>
        
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Questions Solved"
          value={overall_summary.solved_questions}
          total={overall_summary.total_questions}
          icon={<BookOpen className="h-6 w-6 text-blue-400" />}
        />
        <StatCard
          title="Success Rate"
          value={overall_summary.success_rate.toFixed(2)}
          total={100}
          icon={<Target className="h-6 w-6 text-green-400" />}
          unit="%"
        />
        <StatCard
          title="Avg. Time"
          value={Number.parseFloat(overall_summary.avg_time_taken).toFixed(2)}
          icon={<Clock className="h-6 w-6 text-yellow-400" />}
          unit="s"
        />
        <StatCard
          title="Total Attempts"
          value={overall_summary.total_attempts}
          icon={<Brain className="h-6 w-6 text-purple-400" />}
        />
      </div>

      <Tabs defaultValue="overall" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2  p-1 rounded-lg">
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="category">Category</TabsTrigger>
          <TabsTrigger value="scoreband">Score Band</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <OverallSummaryChart data={performanceData.overall_summary} />
        </TabsContent>
        <TabsContent value="skills">
          <SkillPerformanceChart data={performanceData.skill_performance} />
        </TabsContent>
        <TabsContent value="difficulty">
          <DifficultyPerformanceChart data={performanceData.difficulty_performance} />
        </TabsContent>
        <TabsContent value="time">
          <TimeAnalysisChart data={performanceData.time_analysis} />
        </TabsContent>
        <TabsContent value="category">
          <CategoryPerformanceChart data={performanceData.category_performance} />
        </TabsContent>
        <TabsContent value="scoreband">
          <ScoreBandPerformanceChart data={performanceData.score_band_performance} />
        </TabsContent>
        <TabsContent value="progress">
          <ProgressChart
            daily={performanceData.daily_progress}
            weekly={performanceData.weekly_progress}
            monthly={performanceData.monthly_progress}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value, total, icon, unit = "" }) {
  const percentage = total ? (value / total) * 100 : 100

  return (
    <Card className="">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-gray-300">{title}</h2>
          {icon}
        </div>
        <div className="text-2xl font-bold">
          {value}
          {unit}
          {total && (
            <span className="text-sm text-gray-400 ml-1">
              /{total}
              {unit}
            </span>
          )}
        </div>
        {total && <Progress value={percentage} className="h-1 mt-2" />}
      </CardContent>
    </Card>
  )
}

