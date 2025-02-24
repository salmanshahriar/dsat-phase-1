"use client"
import { MapPin, BookmarkIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import cn from "classnames"
import { motion } from "framer-motion"

interface QuestionMapProps {
  externalIds: string[]
  answers: Record<string, string>
  currentQuestionIndex: number
  setCurrentQuestionIndex: (index: number) => void
  markedQuestions: Set<string>
  onClose?: () => void
}

export function QuestionMap({
  externalIds,
  answers,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  markedQuestions,
  onClose,
}: QuestionMapProps) {
  const getQuestionStatus = (index: number) => {
    const id = externalIds[index] 
    const isAnswered = !!answers[id]
    const isMarked = markedQuestions.has(id)
    const isCurrent = currentQuestionIndex === index
    return { isAnswered, isMarked, isCurrent }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Question Map</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {externalIds.length === 0 ? (
          <p className="text-muted-foreground text-sm">No questions available.</p>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-2 mb-4">
            {externalIds.map((id, index) => {
              const { isAnswered, isMarked, isCurrent } = getQuestionStatus(index)
              return (
                <Button
                  key={id}
                  variant="outline"
                  className={cn(
                    "relative h-8 sm:h-10 text-xs sm:text-sm font-medium transition-all duration-200",
                    "border-2",
                    isAnswered && !isCurrent && "border-[#4361ee]/30 bg-[#4361ee]/5 border-solid",
                    isCurrent && "bg-[#4361ee] text-white border-[#4361ee] border-solid",
                    !isAnswered && !isCurrent && "border-dashed hover:border-solid",
                    "hover:bg-[#4361ee]/10"
                  )}
                  onClick={() => {
                    setCurrentQuestionIndex(index)
                    onClose?.() 
                  }}
                >
                  {index + 1} {/* Display question number */}
                  {isMarked && (
                    <BookmarkIcon
                      className={cn(
                        "absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3",
                        isCurrent ? "text-white" : "text-rose-500"
                      )}
                    />
                  )}
                  {isCurrent && (
                    <MapPin className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 text-white" />
                  )}
                </Button>
              )
            })}
          </div>
        )}
        <div className="flex flex-col mt-4 space-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#4361ee]" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-dashed border-muted-foreground rounded-sm"></div>
            <span className="text-muted-foreground">Unanswered</span>
          </div>
          <div className="flex items-center gap-2">
            <BookmarkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500" />
            <span className="text-muted-foreground">For Review</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}