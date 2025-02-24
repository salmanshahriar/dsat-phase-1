"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, HelpCircle, Trophy, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface QuizOverviewPageProps {
  completionCount: number
  completedTime: string
  onClose: () => void
  totalQuestions: number
  questionHistory?: Record<string, any>
}

export function QuizOverviewPage({
  completionCount,
  completedTime,
  onClose,
  totalQuestions,
  questionHistory,
}: QuizOverviewPageProps) {
  const router = useRouter()

  const handleBackToQuiz = () => {
    onClose()
    router.push("/dashboard")
  }

  const questions = questionHistory ? Object.values(questionHistory) : []
  const answeredQuestions = questions.filter((q) => q.answered).length
  const correctAnswers = questions.filter((q) => q.correct).length
  const unansweredQuestions = totalQuestions - answeredQuestions
  const totalExtraAttempts = questions.reduce((sum, q) => sum + (q.extraAttempts || 0), 0)
  const totalScore = questions.reduce((sum, q) => sum + (q.correct ? 1 / (1 + q.extraAttempts) : 0), 0)
  const overallScore = answeredQuestions > 0 ? (totalScore / answeredQuestions) * 100 : 0

  return (
    <div className="min-h-screen bg-background bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="flex flex-col h-full">
          <Button 
            variant="ghost" 
            onClick={handleBackToQuiz} 
            className="mb-6 w-fit bg-background hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Show Dashboard
          </Button>

          <div className="flex-grow space-y-6 md:space-y-8">
            <div className="bg-card border rounded-lg p-4 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h2 className="text-xl md:text-2xl font-semibold">Overall Score</h2>
                <div className="flex items-center justify-center sm:justify-end">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mr-2" />
                  <span className="text-2xl md:text-3xl font-bold">{overallScore.toFixed(1)}%</span>
                </div>
              </div>
              <Progress value={overallScore} className="h-2 mb-4" />
              <div className="text-sm text-muted-foreground mb-4 flex flex-col sm:flex-row sm:justify-between gap-2">
                <span>Completed in: {completedTime}</span>
                <span>Total Completions: {completionCount}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  { icon: CheckCircle, value: correctAnswers, label: "Correct", color: "green" },
                  { icon: XCircle, value: totalExtraAttempts, label: "Extra Attempts", color: "yellow" },
                  { icon: HelpCircle, value: unansweredQuestions, label: "Unanswered", color: "yellow" },
                ].map((stat) => (
                  <div 
                    key={stat.label}
                    className={`flex flex-col items-center p-4 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg`}
                  >
                    <stat.icon className={`w-8 h-8 md:w-10 md:h-10 text-${stat.color}-500 mb-2`} />
                    <span className="text-xl md:text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground text-center">These stats will be updated on your dashboard.</p>
            </div>

            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Question Details</h2>
              <div className="bg-card border rounded-lg p-4 md:p-6 shadow-sm max-h-[50vh] overflow-y-auto">
                {questions.length > 0 ? (
                  questions.map((question, index) => (
                    <div 
                      key={question.externalId} 
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0 gap-2"
                    >
                      <span className="font-medium">Question {index + 1}:</span>
                      <div className="flex items-center justify-start sm:justify-end">
                        {question.answered ? (
                          question.correct ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-yellow-500 mr-2" />
                          )
                        ) : (
                          <HelpCircle className="w-5 h-5 text-yellow-500 mr-2" />
                        )}
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            !question.answered && "text-yellow-500",
                            question.answered && question.correct && "text-green-500",
                            question.answered && !question.correct && "text-yellow-500"
                          )}
                        >
                          {question.answered
                            ? `${question.extraAttempts} extra attempt${question.extraAttempts !== 1 ? "s" : ""}`
                            : "Not answered"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No questions answered yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}