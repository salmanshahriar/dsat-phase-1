"use client"

import { useRouter } from "next/navigation" // Import useRouter for navigation
import { cn } from "@/lib/utils"
import { CheckCircle, XCircle, HelpCircle, Trophy, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface QuizOverviewPageProps {
  completionCount: number
  completedTime: string
  onClose: () => void
  totalQuestions: number
  questionHistory?: Record<string, any> // Optional to handle undefined
}

export function QuizOverviewPage({
  completionCount,
  completedTime,
  onClose,
  totalQuestions,
  questionHistory,
}: QuizOverviewPageProps) {
  const router = useRouter() // Initialize router for navigation

  // Handle navigation to QuizSetup.tsx
  const handleBackToQuiz = () => {
    onClose() // Call the original onClose to reset quiz state
    router.push("/dashboard") 
  }

  // Safely handle undefined or null questionHistory
  const questions = questionHistory ? Object.values(questionHistory) : []
  const answeredQuestions = questions.filter((q) => q.answered).length // Total attempted questions
  const correctAnswers = questions.filter((q) => q.correct).length
  const unansweredQuestions = totalQuestions - answeredQuestions
  const totalExtraAttempts = questions.reduce((sum, q) => sum + (q.extraAttempts || 0), 0)

  // Calculate total score based on correct answers with extra attempts penalty
  const totalScore = questions.reduce((sum, q) => sum + (q.correct ? 1 / (1 + q.extraAttempts) : 0), 0)
  const overallScore = answeredQuestions > 0 ? (totalScore / answeredQuestions) * 100 : 0

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-4rem)] overflow-y-auto mb-16 sm:mb-20 lg:mb-0">
      <Button variant="ghost" onClick={handleBackToQuiz} className="mb-8 bg-background">
        <ArrowLeft className="mr-2 h-4 w-4" /> Show Dashboard
      </Button>
      <div className="space-y-8">
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Overall Score</h2>
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500 mr-2" />
              <span className="text-2xl sm:text-3xl font-bold">{overallScore.toFixed(1)}%</span>
            </div>
          </div>
          <Progress value={overallScore} className="h-2 mb-4" />
          <div className="text-sm text-muted-foreground mb-4 flex justify-between items-center">
            <span>Completed in: {completedTime}</span>
            <span>Total Completions: {completionCount}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
              <span className="text-xl sm:text-2xl font-bold">{correctAnswers}</span>
              <span className="text-sm">Correct</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <XCircle className="w-10 h-10 text-yellow-500 mb-2" />
              <span className="text-xl sm:text-2xl font-bold">{totalExtraAttempts}</span>
              <span className="text-sm">Extra Attempts</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <HelpCircle className="w-10 h-10 text-yellow-500 mb-2" />
              <span className="text-xl sm:text-2xl font-bold">{unansweredQuestions}</span>
              <span className="text-sm">Unanswered</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">These stats will be updated on your dashboard.</p>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Question Details</h2>
        <div className="bg-card border rounded-lg p-6">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={question.externalId} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <span className="font-medium">Question {index + 1}:</span>
                <div className="flex items-center">
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
            <p className="text-center text-muted-foreground">No questions answered yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}