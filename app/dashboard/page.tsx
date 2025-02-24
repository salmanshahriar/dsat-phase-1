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
import { useRouter } from 'next/navigation';

interface OverallSummary {
  solved_questions: number
  total_questions: number
  success_rate: number
  avg_time_taken: number
  total_attempts: number
}

interface PerformanceData {
  overall_summary: OverallSummary
  skill_performance: any 
  difficulty_performance: any 
  time_analysis: any
  category_performance: any 
  score_band_performance: any
  daily_progress: any 
  weekly_progress: any 
  monthly_progress: any 
}

interface StatCardProps {
  title: string
  value: number
  total?: number
  icon: React.ReactNode
  unit?: string
}

const sessionData =
  typeof window !== "undefined"
    ? document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_data="))
        ?.split("=")[1] || ""
    : ""

export default function Dashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter();

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

        if (response.status === 401) {
          document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
          
          router.push("/login");
          router.refresh();
          return;
        }

        if (!response.ok) throw new Error("Network response was not ok")
        const data: PerformanceData = await response.json()
        setPerformanceData(data)
        setLoading(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return (
    <div className="h-[calc(100vh-64px)] overflow-auto flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-lg font-medium text-slate-600 dark:text-slate-300 animate-pulse">Loading...</div>
    </div>
  )
  
  if (error) return (
    <div className="h-[calc(100vh-64px)] overflow-auto flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-lg font-medium text-red-500 dark:text-red-400 text-center">{error}</div>
    </div>
  )
  
  if (!performanceData) return (
    <div className="h-[calc(100vh-64px)] overflow-auto flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-lg font-medium text-slate-600 dark:text-slate-300">No data available</div>
    </div>
  )

  const { overall_summary } = performanceData

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 mb-16 md:mb-0">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-100">
          Performance Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Questions Solved"
            value={overall_summary.solved_questions}
            total={overall_summary.total_questions}
            icon={<BookOpen className="h-5 w-5 text-indigo-500" />}
          />
          <StatCard
            title="Success Rate"
            value={overall_summary.success_rate}
            total={100}
            icon={<Target className="h-5 w-5 text-emerald-500" />}
            unit="%"
          />
          <StatCard
            title="Avg. Time"
            value={Number.parseFloat(overall_summary.avg_time_taken.toString())}
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            unit="s"
          />
          <StatCard
            title="Total Attempts"
            value={overall_summary.total_attempts}
            icon={<Brain className="h-5 w-5 text-violet-500" />}
          />
        </div>

        <Card className="overflow-hidden border-0 ">
        <Tabs defaultValue="overall" className="w-full bg-white/70 dark:bg-slate-800/70">
            <div className="border-b shadow-sm border-slate-200 dark:border-slate-700 backdrop-blur-sm sticky top-0 z-10">
              <div className="relative">
                <div className="overflow-x-auto scrollbar-none">
                  <TabsList className="flex h-12 items-center gap-2 px-4 w-max min-w-full  bg-white/70 dark:bg-slate-800/70">
                    {[
                      { value: "overall", label: "Overall" },
                      { value: "skills", label: "Skills" },
                      { value: "difficulty", label: "Difficulty" },
                      { value: "time", label: "Time" },
                      { value: "category", label: "Category" },
                      { value: "scoreband", label: "Score Band" },
                      { value: "progress", label: "Progress" }
                    ].map(tab => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="relative px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition-all hover:text-slate-900 dark:hover:text-white data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
                <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-white dark:from-slate-800 to-transparent pointer-events-none"></div>
              </div>
            </div>

            <div className="pt-3 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <TabsContent value="overall" className="mt-0 focus-visible:outline-none ">
                <OverallSummaryChart data={performanceData.overall_summary} />
              </TabsContent>
              <TabsContent value="skills" className="mt-0 focus-visible:outline-none">
                <SkillPerformanceChart data={performanceData.skill_performance} />
              </TabsContent>
              <TabsContent value="difficulty" className="mt-0 focus-visible:outline-none">
                <DifficultyPerformanceChart data={performanceData.difficulty_performance} />
              </TabsContent>
              <TabsContent value="time" className="mt-0 focus-visible:outline-none">
                <TimeAnalysisChart data={performanceData.time_analysis} />
              </TabsContent>
              <TabsContent value="category" className="mt-0 focus-visible:outline-none">
                <CategoryPerformanceChart data={performanceData.category_performance} />
              </TabsContent>
              <TabsContent value="scoreband" className="mt-0 focus-visible:outline-none">
                <ScoreBandPerformanceChart data={performanceData.score_band_performance} />
              </TabsContent>
              <TabsContent value="progress" className="mt-0 focus-visible:outline-none">
                <ProgressChart
                  daily={performanceData.daily_progress}
                  weekly={performanceData.weekly_progress}
                  monthly={performanceData.monthly_progress}
                />
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, total, icon, unit = "" }: StatCardProps) {
  const percentage = total ? (value / total) * 100 : 100

  return (
    <Card className="overflow-hidden border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-all group">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {title}
          </h2>
          <div className="transform group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
        <div className="text-lg font-semibold text-slate-900 dark:text-white truncate">
          {value.toFixed(2)}
          {unit}
          {total && (
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
              /{total}
              {unit}
            </span>
          )}
        </div>
        {total && (
          <Progress 
            value={percentage} 
            className="h-1 mt-2 bg-slate-200 dark:bg-slate-700 [&>div]:bg-indigo-500 dark:[&>div]:bg-indigo-400"
          />
        )}
      </CardContent>
    </Card>
  )
}