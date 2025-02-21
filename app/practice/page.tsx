"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Sparkles, Atom, Brain, ChevronRight, Book, Calculator } from "lucide-react"
import { QuizSetup } from "@/components/quiz/QuizSetup"
import { Domain } from "@/types/quiz"
import QuizInterface from "@/components/quiz/QuizInterface"

const subjects = {
  English: [
    { id: "info-ideas", label: "Information and Ideas", icon: Brain, primary_class_cd: "INI" },
    { id: "craft-structure", label: "Craft and Structure", icon: Sparkles, primary_class_cd: "CAS" },
    { id: "expression-ideas", label: "Expression of Ideas", icon: Sparkles, primary_class_cd: "EOI" },
    { id: "english-conventions", label: "Standard English Conventions", icon: Brain, primary_class_cd: "SEC" },
  ],
  Math: [
    { id: "algebra", label: "Algebra", icon: Atom, primary_class_cd: "H" },
    { id: "advanced-math", label: "Advanced Math", icon: Brain, primary_class_cd: "P" },
    { id: "problem-solving", label: "Problem-Solving and Data Analysis", icon: Sparkles, primary_class_cd: "Q" },
    { id: "geometry-trig", label: "Geometry and Trigonometry", icon: Atom, primary_class_cd: "S" },
  ],
} as const

const subjectIcons = {
  English: Book,
  Math: Calculator,
}

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState<"English" | "Math" | "">("")
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [showQuizSetup, setShowQuizSetup] = useState(false)
  const [showQuizInterface, setShowQuizInterface] = useState(false)

  const handleSubjectChange = (subject: "English" | "Math") => {
    setSelectedSubject(subject)
    setSelectedDomains([])
  }

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId) ? prev.filter((id) => id !== domainId) : [...prev, domainId]
    )
  }

  const handleContinue = () => {
    if (selectedSubject && selectedDomains.length > 0) {
      setShowQuizSetup(true)
    }
  }

  const handleQuizSetupBack = () => {
    setShowQuizSetup(false)
  }

  const handleStartQuiz = () => {
    setShowQuizSetup(false)
    setShowQuizInterface(true)
  }

  if (showQuizInterface) {
    return <QuizInterface />
  }

  if (showQuizSetup) {
    return (
      <div className="container mx-auto px-4 py-8 w-full">
        <QuizSetup
          subject={selectedSubject}
          domains={selectedDomains.map(domainId =>
            subjects[selectedSubject as keyof typeof subjects].find(d => d.id === domainId)?.primary_class_cd
          ).filter(Boolean) as string[]}
          onBack={handleQuizSetupBack}
          onStart={handleStartQuiz}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-start bg-background text-foreground">
      <motion.div
        className="w-full max-w-4xl space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Subject Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold block text-center">Select Subject</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(subjects) as Array<"English" | "Math">).map((subject) => {
              const Icon = subjectIcons[subject]
              return (
                <motion.button
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  className={`flex items-center space-x-3 p-4 rounded-lg transition-all w-full h-16 ${
                    selectedSubject === subject
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground border border-border"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className="font-medium flex-grow text-left text-lg">{subject}</span>
                  {selectedSubject === subject && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary-foreground ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Domain Selection */}
        <AnimatePresence mode="wait">
          {selectedSubject && (
            <motion.div
              key="domains"
              className="space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Label className="text-lg font-semibold block">Select Knowledge Domains</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subjects[selectedSubject].map((domain) => (
                  <motion.button
                    key={domain.id}
                    onClick={() => handleDomainToggle(domain.id)}
                    className={`flex items-center space-x-3 p-4 rounded-lg transition-all w-full h-16 ${
                      selectedDomains.includes(domain.id)
                        ? "bg-secondary text-secondary-foreground border-2 border-primary"
                        : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground border border-border"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <domain.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-grow text-left">{domain.label}</span>
                    {selectedDomains.includes(domain.id) && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-primary ml-auto"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        {selectedSubject && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              className="w-full max-w-md px-8 py-6 text-lg font-bold"
              size="lg"
              disabled={selectedDomains.length === 0}
              onClick={handleContinue}
            >
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}