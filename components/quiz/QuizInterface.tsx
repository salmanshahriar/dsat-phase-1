"use client"

import { useCallback, useState, useEffect } from "react"
import {
  BookmarkIcon,
  Clock,
  ChevronDown,
  PenLine,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eraser,
  X,
  ChevronUp,
  Calculator,
  StopCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { ExplanationModal } from "./ExplanationModal"
import { useTimer } from "@/hooks/use-timer"
import { cn } from "@/lib/utils"
import { QuestionMap } from "./QuestionMap"
import { StrikeoutTooltip } from "./StrikeoutTooltip"
import { pageVariants, pageTransition, fadeIn, popIn, shake } from "@/utils/animations"
import { FloatingCalculator } from "./FloatingCalculator"
import { ReferenceModal } from "./ReferenceModal"
import { QuizOverviewPage } from "./QuizOverviewPage"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ConfirmationModal } from "./ConfirmationModal"

const MotionCard = motion(Card)

const getOptionLetter = (index: number) => {
  const letters = ["A", "B", "C", "D"]
  return letters[index] || "?"
}

const generateExamId = () => {
  return Math.floor(10000000 + Math.random() * 90000000)
}

export default function QuizInterface() {
  const [externalIds, setExternalIds] = useState(() => {
    const storedIds = localStorage.getItem("questions_externalId_array")
    console.log("Initial externalIds from localStorage:", storedIds)
    return storedIds ? JSON.parse(storedIds) : []
  })

  const [examId, setExamId] = useState<number>(generateExamId())
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [attempts, setAttempts] = useState<Record<string, string[]>>({})
  const [sprInputs, setSprInputs] = useState<Record<string, string>>({})
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [isNavigating, setIsNavigating] = useState(false)
  const [questionHistory, setQuestionHistory] = useState<Record<string, any>>({})

  useEffect(() => {
    localStorage.setItem("questions_externalId_array", JSON.stringify(externalIds))
  }, [externalIds])

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMarkedForReview, setIsMarkedForReview] = useState(false)
  const [showDirections, setShowDirections] = useState(false)
  const { timeElapsed } = useTimer(0)
  const [progress, setProgress] = useState(0)
  const [markedQuestions, setMarkedQuestions] = useState<Set<string>>(new Set())
  const [strikeoutMode, setStrikeoutMode] = useState(false)
  const [strikeouts, setStrikeouts] = useState<Record<string, Set<string>>>({})
  const [wrongAnswer, setWrongAnswer] = useState<string | null>(null)
  const [showGraphingCalculator, setShowGraphingCalculator] = useState(false)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [completionCount, setCompletionCount] = useLocalStorage("quizCompletionCount", 0)
  const [completedTime, setCompletedTime] = useState("")
  const [isQuestionMapOpen, setIsQuestionMapOpen] = useState(false)
  const [isStopConfirmationOpen, setIsStopConfirmationOpen] = useState(false)
  const sessionData = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('session_data='))?.split('=')[1] || "" : ""

  const fetchQuestion = useCallback(async (externalId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/question/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData}`,
        },
        body: JSON.stringify({ externalId }),
      })
      if (!response.ok) throw new Error("Failed to fetch question")
      const data = await response.json()
      setCurrentQuestion(data[0])
      setQuestionStartTime(Date.now())
    } catch (error) {
      console.error("Error fetching question:", error)
    } finally {
      setIsLoading(false)
    }
  }, [sessionData])

  useEffect(() => {
    if (externalIds.length > 0 && externalIds[currentQuestionIndex]) {
      fetchQuestion(externalIds[currentQuestionIndex])
    }
  }, [currentQuestionIndex, externalIds, fetchQuestion])

  useEffect(() => {
    setProgress(externalIds.length > 0 ? ((currentQuestionIndex + 1) / externalIds.length) * 100 : 0)
  }, [currentQuestionIndex, externalIds.length])

  // Synchronize isMarkedForReview with current question
  useEffect(() => {
    if (currentQuestion) {
      setIsMarkedForReview(markedQuestions.has(currentQuestion.externalId))
    }
  }, [currentQuestion, markedQuestions])

  const sendQuestionData = useCallback(async (question: any) => {
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000)
    const lastAttempt = answers[question.externalId]
    const questionType = question.questionType
    const correctAnswers = questionType === "mcq" ? question.questionInfo.keys : question.questionInfo.correct_answer
    const isCorrect = lastAttempt && correctAnswers.includes(lastAttempt)
    const questionAttempts = attempts[question.externalId] || []

    let attemptsLetters: string[]
    if (questionType === "mcq") {
      const optionToLetter = question.questionInfo.answerOptions.reduce(
        (acc: Record<string, string>, option: any, index: number) => {
          acc[option.id] = getOptionLetter(index)
          return acc
        },
        {}
      )
      attemptsLetters = questionAttempts.map((id: string) => optionToLetter[id])
    } else {
      attemptsLetters = questionAttempts
    }

    const data = {
      external_id: question.externalId,
      correct: isCorrect,
      attempts: attemptsLetters,
      time_taken: timeTaken,
      examId: examId,
    }

    try {
      const response = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/submitResult", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData}`,
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to submit result")
      console.log("Result submitted successfully")

      setQuestionHistory((prev) => ({
        ...prev,
        [question.externalId]: {
          ...question,
          attemptsCount: questionAttempts.length,
          extraAttempts: Math.max(0, questionAttempts.length - 1),
          answered: !!lastAttempt,
          correct: isCorrect,
        },
      }))
    } catch (error) {
      console.error("Error submitting result:", error)
    }
  }, [examId, answers, attempts, questionStartTime, sessionData])

  const nextQuestion = useCallback(async () => {
    if (isNavigating) return

    setIsNavigating(true)
    if (answers[currentQuestion?.externalId]) {
      await sendQuestionData(currentQuestion)
    }
    if (currentQuestionIndex < externalIds.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    } else {
      setIsQuizComplete(true)
      setCompletionCount((prevCount) => prevCount + 1)
      setCompletedTime(timeElapsed)
    }
    setIsNavigating(false)
  }, [currentQuestionIndex, externalIds.length, setCompletionCount, timeElapsed, isNavigating, currentQuestion, answers, sendQuestionData])

  const handleStopQuiz = useCallback(() => {
    setIsStopConfirmationOpen(true)
  }, [])

  const confirmStopQuiz = useCallback(async () => {
    setIsStopConfirmationOpen(false)
    if (answers[currentQuestion?.externalId]) {
      await sendQuestionData(currentQuestion)
    }
    setIsQuizComplete(true)
    setCompletionCount((prevCount) => prevCount + 1)
    setCompletedTime(timeElapsed)
  }, [setCompletionCount, timeElapsed, currentQuestion, answers, sendQuestionData])

  const previousQuestion = useCallback(() => {
    if (isNavigating || currentQuestionIndex === 0) return
    setIsNavigating(true)
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
    setTimeout(() => setIsNavigating(false), 500)
  }, [currentQuestionIndex, isNavigating])

  const toggleMarkForReview = useCallback(async () => {
    const id = currentQuestion?.externalId
    if (!id) return // Ensure externalId exists

    const isCurrentlyMarked = markedQuestions.has(id)
    const operation = isCurrentlyMarked ? "remove" : "add"

    try {
      const response = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/markAsReview", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData}`,
        },
        body: JSON.stringify({
          externalId: id,
          operation: operation,
        }),
      })

      if (!response.ok) throw new Error("Failed to mark for review")
      const data = await response.json()

      if (data.success) {
        setMarkedQuestions((prev) => {
          const newSet = new Set(prev)
          if (operation === "add") newSet.add(id)
          else newSet.delete(id)
          return newSet
        })
      } else {
        console.error("Failed to mark for review:", data.message)
      }
    } catch (error) {
      console.error("Error marking for review:", error)
    }
  }, [currentQuestion?.externalId, markedQuestions, sessionData])

  const toggleStrikeoutMode = useCallback(() => {
    setStrikeoutMode((prev) => !prev)
  }, [])

  const toggleStrikeout = useCallback(
    (questionId: string, optionId: string) => {
      if (!strikeoutMode) return
      setStrikeouts((prev) => {
        const questionStrikeouts = prev[questionId] || new Set()
        const newStrikeouts = new Set(questionStrikeouts)
        if (newStrikeouts.has(optionId)) newStrikeouts.delete(optionId)
        else newStrikeouts.add(optionId)
        return { ...prev, [questionId]: newStrikeouts }
      })
    },
    [strikeoutMode]
  )

  const undoStrikeout = useCallback((questionId: string, optionId: string) => {
    setStrikeouts((prev) => {
      const questionStrikeouts = prev[questionId] || new Set()
      const newStrikeouts = new Set(questionStrikeouts)
      newStrikeouts.delete(optionId)
      return { ...prev, [questionId]: newStrikeouts }
    })
  }, [])

  const handleAnswerSelection = useCallback(
    (value: string) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion.externalId]: value }))
      setAttempts((prev) => {
        const questionAttempts = prev[currentQuestion.externalId] || []
        return { ...prev, [currentQuestion.externalId]: [...questionAttempts, value] }
      })
      if (value !== currentQuestion?.questionInfo.keys[0]) {
        setWrongAnswer(value)
        setTimeout(() => setWrongAnswer(null), 500)
      }
    },
    [currentQuestion?.externalId, currentQuestion?.questionInfo?.keys]
  )

  const handleSprCheck = useCallback(() => {
    const inputValue = sprInputs[currentQuestion.externalId] || ""
    if (inputValue) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.externalId]: inputValue }))
      setAttempts((prev) => {
        const questionAttempts = prev[currentQuestion.externalId] || []
        return { ...prev, [currentQuestion.externalId]: [...questionAttempts, inputValue] }
      })
      if (inputValue !== currentQuestion?.questionInfo.correct_answer[0]) {
        setWrongAnswer(inputValue)
        setTimeout(() => setWrongAnswer(null), 500)
      }
    }
  }, [currentQuestion?.externalId, sprInputs, currentQuestion?.questionInfo?.correct_answer])

  const handleCloseOverview = useCallback(() => {
    setIsQuizComplete(false)
    setCurrentQuestionIndex(0)
    setExamId(generateExamId())
    setAnswers({})
    setAttempts({})
    setSprInputs({})
    setQuestionHistory({})
  }, [])

  if (isQuizComplete) {
    return (
      <QuizOverviewPage
        completionCount={completionCount}
        completedTime={completedTime}
        onClose={handleCloseOverview}
        totalQuestions={externalIds.length}
        questionHistory={questionHistory}
      />
    )
  }

  const questionType = currentQuestion?.questionType
  const selectedAnswer = answers[currentQuestion?.externalId]
  const isCorrect = selectedAnswer && (
    questionType === "mcq"
      ? selectedAnswer === currentQuestion.questionInfo.keys[0]
      : selectedAnswer === currentQuestion.questionInfo.correct_answer[0]
  )

  return (
    <motion.div
      className="h-full flex flex-col bg-background bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.div className="bg-card border-b border-border" variants={fadeIn} initial="initial" animate="animate">
        <div className="container max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <h1 className="text-base sm:text-lg font-semibold text-foreground hidden sm:block">
                Reading and Writing
              </h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs sm:text-sm font-medium"
                onClick={() => setShowDirections(!showDirections)}
              >
                {showDirections ? "Hide" : "Show"} Directions
                <ChevronDown
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform duration-300",
                    showDirections ? "transform rotate-180" : ""
                  )}
                />
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 px-2 sm:px-3 bg-primary/10 rounded-md"
                onClick={() => setShowGraphingCalculator(true)}
              >
                <Calculator className="h-4 w-4" />
                <span className="sr-only">Open calculator</span>
              </Button>
              <ReferenceModal />
              <motion.div
                className="flex items-center gap-1 sm:gap-2 bg-primary/10 px-2 sm:px-3 rounded-md h-10"
                variants={popIn}
                initial="initial"
                animate="animate"
              >
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                <span className="text-xs sm:text-sm font-mono font-semibold text-primary">{timeElapsed}</span>
              </motion.div>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1 w-full" />
      </motion.div>

      <AnimatePresence>
        {showDirections && (
          <motion.div
            className="bg-blue-950 dark:bg-blue-900 text-white overflow-hidden"
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], opacity: { duration: 0.2 }, y: { duration: 0.2 } }}
          >
            <div className="container max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium">
              THIS IS A PRACTICE TEST
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow overflow-hidden container max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 flex flex-col lg:flex-row gap-2 sm:gap-4 mb-3 lg:mb-0">
        <MotionCard
          className="flex-1 p-2 sm:p-4 overflow-auto lg:max-h-[calc(100vh-14rem)] max-h-screen mb-2 lg:mb-0 border-0 lg:border sm:shadow-none lg:shadow-md"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentQuestion?.questionInfo.stimulus }} />
          </div>
        </MotionCard>

        <MotionCard
          className="flex-1 p-2 sm:p-4 md:overflow-auto lg:max-h-[calc(100vh-14rem)] max-h-screen "
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs sm:text-sm"
                  variants={popIn}
                  initial="initial"
                  animate="animate"
                >
                  {currentQuestionIndex + 1}
                </motion.div>
                <Button
                  variant={isMarkedForReview ? "default" : "outline"}
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={toggleMarkForReview}
                >
                  <BookmarkIcon className="w-3 h-3" />
                  <span className="hidden sm:inline">{isMarkedForReview ? "Marked" : "Review"}</span>
                </Button>
              </div>
              <div className="flex items-center gap-2 min-w-[4rem] justify-end">
                {isCorrect && (
                  <ExplanationModal explanation={currentQuestion?.questionInfo.rationale} />
                )}
                {questionType === "mcq" && (
                  <StrikeoutTooltip>
                    <Button
                      variant={strikeoutMode ? "default" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={toggleStrikeoutMode}
                    >
                      {strikeoutMode ? <Eraser className="h-4 w-4" /> : <PenLine className="h-4 w-4" />}
                    </Button>
                  </StrikeoutTooltip>
                )}
              </div>
            </div>

            <motion.div
              dangerouslySetInnerHTML={{ __html: currentQuestion?.questionInfo.stem }}
              className="font-medium text-xs sm:text-sm text-foreground"
              variants={fadeIn}
              initial="initial"
              animate="animate"
            />

            {questionType === "mcq" && (
              <RadioGroup
                value={answers[currentQuestion.externalId] || ""}
                onValueChange={handleAnswerSelection}
                className="space-y-2"
              >
                {currentQuestion.questionInfo.answerOptions.map((option: any, index: number) => {
                  const isStrikeout = strikeouts[currentQuestion.externalId]?.has(option.id)
                  return (
                    <motion.div
                      key={option.id}
                      className="relative group flex items-center gap-2"
                      variants={popIn}
                      initial="initial"
                      animate="animate"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div className="flex-1" variants={shake} animate={wrongAnswer === option.id ? "shake" : ""}>
                        <RadioGroupItem value={option.id} id={option.id} className="peer sr-only" />
                        <Label
                          htmlFor={option.id}
                          className={cn(
                            "flex items-center rounded-lg border p-2 sm:p-3 cursor-pointer text-xs sm:text-sm",
                            "transition-all duration-200 ease-in-out",
                            "hover:bg-accent hover:text-accent-foreground",
                            answers[currentQuestion.externalId] === option.id &&
                              option.id === currentQuestion.questionInfo.keys[0] &&
                              "border-green-500 bg-green-50 dark:bg-green-900",
                            answers[currentQuestion.externalId] === option.id &&
                              option.id !== currentQuestion.questionInfo.keys[0] &&
                              "border-red-500 bg-red-50 dark:bg-red-900",
                            !answers[currentQuestion.externalId] && "peer-checked:border-primary peer-checked:bg-primary/5",
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50"
                          )}
                        >
                          <div className="flex mr-3 rounded-full border border-primary/70 items-center justify-center text-primary font-semibold text-xs">
                            <div className="w-6 h-6 md:w-8 md:h-8 flex justify-center items-center md:text-lg">{getOptionLetter(index)}</div>
                          </div>
                          <div
                            className={cn(
                              "flex-grow",
                              isStrikeout &&
                                "relative after:absolute after:left-0 after:right-0 after:top-1/2 after:h-px after:bg-foreground"
                            )}
                          >
                            <span dangerouslySetInnerHTML={{ __html: option.content }} />
                          </div>
                          {answers[currentQuestion.externalId] === option.id &&
                            option.id === currentQuestion.questionInfo.keys[0] && (
                              <CheckCircle2 className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
                            )}
                        </Label>
                      </motion.div>
                      {strikeoutMode && (
                        <motion.div
                          className="flex-shrink-0 w-16"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          {isStrikeout ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-7 px-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground"
                              onClick={() => undoStrikeout(currentQuestion.externalId, option.id)}
                            >
                              Undo
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-7 px-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground flex items-center justify-center gap-1"
                              onClick={() => toggleStrikeout(currentQuestion.externalId, option.id)}
                            >
                              <X className="w-3 h-3" />
                              <span>Strike</span>
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </RadioGroup>
            )}

            {questionType === "spr" && (
              <div className="space-y-2">
                <Input
                  value={sprInputs[currentQuestion.externalId] || ""}
                  onChange={(e) =>
                    setSprInputs((prev) => ({ ...prev, [currentQuestion.externalId]: e.target.value }))
                  }
                  className="w-full"
                  placeholder="Type your answer here"
                />
                <Button onClick={handleSprCheck}>Check</Button>
              </div>
            )}

            <AnimatePresence>
              {selectedAnswer && (
                <motion.div
                  className={cn(
                    "p-2 sm:p-3 text-xs rounded-lg",
                    isCorrect
                      ? "bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700"
                      : "bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700"
                  )}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="font-medium">
                    {isCorrect ? "Correct!" : "Incorrect. Try again!"}
                  </div>
                  <div className="mt-1 text-xs text-foreground">
                    Total attempts: {attempts[currentQuestion.externalId]?.length || 0}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MotionCard>
      </div>

      <motion.div className="border-t border-border bg-card" variants={fadeIn} initial="initial" animate="animate">
        <div className="container max-w-7xl mx-auto px-2 sm:px-4 mb-16 lg:mb-0">
          <div className="flex items-center justify-between py-2 sm:py-3">
            <div className="relative flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQuestionMapOpen(true)}
                className="gap-1 md:min-w-[190px] w-24 font-medium"
                disabled={externalIds.length === 0}
              >
                <span className="hidden md:block">Question </span>{currentQuestionIndex + 1} of {externalIds.length}
                <ChevronUp className="h-3 w-4 opacity-50" />
              </Button>
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={handleStopQuiz} className="flex items-center">
                  <StopCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 hidden md:block" />
                  Stop <span className="hidden md:">Practice</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0 || isNavigating}
              >
                <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 hidden md:block" /> Back
              </Button>
              <Button
                size="sm"
                onClick={nextQuestion}
                disabled={!answers[currentQuestion?.externalId] || isNavigating}
              >
                {currentQuestionIndex === externalIds.length - 1 ? "Finish" : "Next"}{" "}
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 hidden md:block" />
              </Button>
            </div>
          </div>
        </div>
        <ConfirmationModal
          isOpen={isStopConfirmationOpen}
          onClose={() => setIsStopConfirmationOpen(false)}
          onConfirm={confirmStopQuiz}
          title="Stop Quiz"
          message="Are you sure you want to stop the quiz? Your progress will be saved, but you won't be able to continue from where you left off."
        />
      </motion.div>

      <AnimatePresence>
        {showGraphingCalculator && (
          <FloatingCalculator key="graphing" onClose={() => setShowGraphingCalculator(false)} />
        )}
        {isQuestionMapOpen && externalIds.length > 0 && (
          <QuestionMap
            externalIds={externalIds}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            markedQuestions={markedQuestions}
            onClose={() => setIsQuestionMapOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
                          
                          