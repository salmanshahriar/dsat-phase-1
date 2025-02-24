"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { QuizQuestion } from "../types/quiz"
import { fetchQuizQuestions } from "../lib/api"

interface QuizContextType {
  questions: QuizQuestion[]
  quizState: QuizState
  setAnswer: (questionId: string, answerId: string) => void
  nextQuestion: () => void
  previousQuestion: () => void
  setQuestionIndex: (index: number) => void
  isLoading: boolean
  incrementAttempts: (questionId: string) => void
}

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, string>; 
  attempts: Record<string, number>; 
  extraAttempts: Record<string, number>;
  isComplete: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    attempts: {},
    extraAttempts: {},
    isComplete: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuizQuestions()
      setQuestions(fetchedQuestions)
      setIsLoading(false)
    }
    loadQuestions()
  }, [])

  const setAnswer = (questionId: string, answerId: string) => {
    setQuizState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answerId },
    }))
  }

  const setQuestionIndex = (index: number) => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
    }))
  }

  const nextQuestion = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }))
    } else {
      setQuizState((prev) => ({ ...prev, isComplete: true }))
    }
  }

  const previousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }))
    }
  }

  const incrementAttempts = (questionId: string) => {
    setQuizState((prev) => {
      const currentAttempts = prev.attempts[questionId] || 0;
      const newAttempts = currentAttempts + 1;
      const extraAttempts = newAttempts > 1 ? newAttempts - 1 : 0;
  
      return {
        ...prev,
        attempts: { ...prev.attempts, [questionId]: newAttempts },
        extraAttempts: { ...prev.extraAttempts, [questionId]: extraAttempts },
      };
    });
  };

  return (
    <QuizContext.Provider
      value={{
        questions,
        quizState,
        setAnswer,
        nextQuestion,
        previousQuestion,
        setQuestionIndex,
        isLoading,
        incrementAttempts,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

