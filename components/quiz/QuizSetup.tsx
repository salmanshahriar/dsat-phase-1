"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ChevronRight, Brain, Sparkles, Atom } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  status: string
  tags: string[]
  questionCategory: string
  externalId: string
  questionInfo: {
    updateDate: number
    pPcc: string
    questionId: string
    skill_cd: string
    score_band_range_cd: number
    uId: string
    skill_desc: string
    createDate: number
    program: string
    primary_class_cd_desc: string
    ibn: null | string
    external_id: string
    primary_class_cd: string
    difficulty: "E" | "M" | "H"
  }
}

const filterOptions = {
  difficulty: [
    { label: "All", value: "all" },
    { label: "Easy", value: "E" },
    { label: "Medium", value: "M" },
    { label: "Hard", value: "H" },
  ]
} as const

interface QuizSetupProps {
  subject: string
  domains: string[]
  onBack: () => void
  onStart: () => void
}

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
} as const;



export function QuizSetup({ subject, domains, onBack, onStart }: QuizSetupProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsCount, setQuestionsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    difficulty: "all",
  })
  const [filtering, setFiltering] = useState(false)
  const sessionData = typeof window !== "undefined" ? document.cookie.split('; ').find(row => row.startsWith('session_data='))?.split('=')[1] || "" : "";
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/getQuestions", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionData}`,
          },
          body: JSON.stringify({
            questionCategory: subject,
            primary_class_cd: domains,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }

        const data = await response.json()
        if (!data || !data.questions) {
          throw new Error("Invalid response structure")
        }
        setQuestions(data.questions)
        setQuestionsCount(data.count)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (subject && domains.length > 0) {
      fetchQuestions()
    }
  }, [subject, domains])

  // Filter questions based on selected difficulty
  const filteredQuestions = questions.filter((question) => {
    if (filters.difficulty === "all") return true;
    return question.questionInfo.difficulty === filters.difficulty;
  });

  // Calculate domain breakdown based on filtered questions
  const domainBreakdown = filteredQuestions.reduce((acc, question) => {
    const domain = question.questionInfo.primary_class_cd;
    const subdomain = question.questionInfo.skill_desc;

    if (!acc[domain]) {
      acc[domain] = { total: 0, subdomains: {} };
    }

    acc[domain].total += 1;

    if (!acc[domain].subdomains[subdomain]) {
      acc[domain].subdomains[subdomain] = 0;
    }
    acc[domain].subdomains[subdomain] += 1;

    return acc;
  }, {} as Record<string, { total: number; subdomains: Record<string, number> }>);

  const handleStartPractice = () => {
    // Extract externalIds from filtered questions
    const externalIds = filteredQuestions.map(question => question.externalId);

    // Store externalIds in local storage
    localStorage.setItem("questions_externalId_array", JSON.stringify(externalIds));

    // Call the onStart function to proceed
    onStart();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header with User Info */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        
      </motion.div>

      {/* Quiz Info */}
      <motion.div
        className="w-full bg-muted rounded-lg px-4 py-3 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="text-sm font-medium">
          Found {filteredQuestions.length} Questions
        </span>

        <div className="text-sm items-center flex justify-between font-medium">
          <span className="mr-4 font-medium">Subject: <span className="text-muted-foreground">{subject}</span></span>
          
          <div className="flex gap-2 items-center">
          <div className="font-medium">Domains: </div>
          <div className="flex flex-wrap gap-2">
          {domains.map((domain) => (
            <span
              key={domain}
              className="px-2 py-1 bg-background text-xs rounded-full border border-border text-muted-foreground"
            >
              {domain}
            </span>
          ))}
        </div>
        
          </div>
        </div>
      </motion.div>

    

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {Object.entries(filterOptions).map(([key, options]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground capitalize">{key}:</span>
                <div className="flex gap-1">
                  {options.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters[key as keyof typeof filters] === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setFiltering(true);
                        setFilters((prev) => ({ ...prev, [key]: option.value }));
                        setTimeout(() => setFiltering(false), 500); // Simulate loading time
                      }}
                      className={cn(
                        "h-6 px-2 text-xs",
                        filters[key as keyof typeof filters] === option.value && "bg-primary text-primary-foreground"
                      )}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Question Breakdown */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Question Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(domainBreakdown).sort((a, b) => {
              // Define a static order for domains
              const order = ["Craft and Structure", "Information and Ideas"];
              return order.indexOf(a[0]) - order.indexOf(b[0]);
            }).map(([domainKey, { total, subdomains }]) => {
              const domain = subjects[subject].find(d => d.primary_class_cd === domainKey); // Find the domain object
              return (
                <Card key={domainKey} className="p-4 flex flex-col relative">
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-background text-xs rounded-full border border-border text-muted-foreground">
                      {domain?.primary_class_cd} {/* Show the label */}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {total}
                    </div>
                    <h3 className="text-sm font-semibold">{domain?.label}</h3> {/* Show the primary_class_cd */}
                  </div>
                  <div className="flex-grow">
                    <div className="space-y-2">
                      {Object.entries(subdomains).map(([subdomainName, count]) => (
                        <div key={subdomainName} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-medium text-xs">
                            {count}
                          </div>
                          <span className="text-xs">{subdomainName}</span>
                        </div>
                      ))}
                      {/* Ensure a fixed number of entries */}
                      {subdomains.length < 3 && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-medium text-xs">
                              0
                            </div>
                            <span className="text-xs">Placeholder</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center font-medium text-xs">
                              0
                            </div>
                            <span className="text-xs">Placeholder</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>


      {/* Start Practice Button */}
      <motion.div
        className="flex justify-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button 
          size="lg" 
          className="w-full max-w-md px-8 py-6 text-lg font-bold" 
          disabled={questions.length === 0}
          onClick={handleStartPractice}
        >
          Start Practice
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  )
}