"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Clock, Brain, Target } from "lucide-react"


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false, loading: () => <p>Loading chart...</p> })


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)accessToken\s*=\s*([^;]*).*$)|^.*$/, "$1")
      if (!token) {
        router.push("/login")
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  // Mock data (replace with actual data from your quiz context or API)
  const quizData = {
    overallScore: 75,
    completedTime: "00:45:30",
    totalCompletions: 5,
    correctAnswers: 15,
    incorrectAnswers: 3,
    unansweredQuestions: 2,
  }

  const pieChartOptions = {
    labels: ["Correct", "Incorrect", "Unanswered"],
    colors: ["#10B981", "#EF4444", "#F59E0B"],
    legend: {
      position: "bottom" as const,
    },
  }

  const pieChartSeries = [quizData.correctAnswers, quizData.incorrectAnswers, quizData.unansweredQuestions]

  const lineChartOptions = {
    chart: {
      id: "score-progress",
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4", "Quiz 5"],
    },
    stroke: {
      curve: "smooth" as const,
    },
    markers: {
      size: 5,
    },
  }

  const lineChartSeries = [
    {
      name: "Score",
      data: [65, 70, 68, 72, 75],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizData.overallScore}%</div>
            <Progress value={quizData.overallScore} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizData.completedTime}</div>
            <p className="text-xs text-muted-foreground">Last quiz duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
            <Brain className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizData.totalCompletions}</div>
            <p className="text-xs text-muted-foreground">Quizzes taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((quizData.correctAnswers / (quizData.correctAnswers + quizData.incorrectAnswers)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Correct answers ratio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Answer Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart options={pieChartOptions} series={pieChartSeries} type="pie" height={300} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Score Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={300} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

