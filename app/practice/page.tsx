"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Atom, Brain, ChevronRight, Book, Calculator } from "lucide-react";
import { QuizSetup } from "@/components/quiz/QuizSetup";
import QuizInterface from "@/components/quiz/QuizInterface";

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

const subjectIcons = {
  English: Book,
  Math: Calculator,
};

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState<"English" | "Math" | "">("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [showQuizSetup, setShowQuizSetup] = useState(false);
  const [showQuizInterface, setShowQuizInterface] = useState(false);

  const handleSubjectChange = (subject: "English" | "Math") => {
    setSelectedSubject(subject);
    setSelectedDomains([]);
  };

  const handleDomainToggle = (domainId: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId) ? prev.filter((id) => id !== domainId) : [...prev, domainId]
    );
  };

  const handleContinue = () => {
    if (selectedSubject && selectedDomains.length > 0) {
      setShowQuizSetup(true);
    }
  };

  const handleQuizSetupBack = () => {
    setShowQuizSetup(false);
  };

  const handleStartQuiz = () => {
    setShowQuizSetup(false);
    setShowQuizInterface(true);
  };

  if (showQuizInterface) {
    return <QuizInterface />;
  }

  if (showQuizSetup) {
    return (
      <div className="container mx-auto px-4 py-6 w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg">
        <QuizSetup
          subject={selectedSubject}
          domains={selectedDomains
            .map((domainId) =>
              subjects[selectedSubject as keyof typeof subjects].find((d) => d.id === domainId)?.primary_class_cd
            )
            .filter(Boolean) as string[]}
          onBack={handleQuizSetupBack}
          onStart={handleStartQuiz}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto flex flex-col items-center justify-start bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-foreground">
      <motion.div
        className="container mx-auto px-4 py-6 w-full max-w-3xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Subject Selection */}
        <div className="space-y-4 bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
          <Label className="text-lg font-semibold block text-slate-800 dark:text-slate-200">
            Select Subject
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.keys(subjects) as Array<"English" | "Math">).map((subject) => {
              const Icon = subjectIcons[subject];
              return (
                <motion.button
                  key={subject}
                  onClick={() => handleSubjectChange(subject)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all w-full shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-600 active:bg-indigo-500 active:text-white active:border-indigo-500 ${
                    selectedSubject === subject
                      ? "bg-indigo-500 dark:bg-indigo-600 text-white  dark:border-indigo-600"
                      : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium flex-grow text-left text-sm">{subject}</span>
                  {selectedSubject === subject && (
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Domain Selection */}
        <AnimatePresence mode="wait">
          {selectedSubject && (
            <motion.div
              key="domains"
              className="space-y-4 bg-white dark:bg-slate-800 shadow-md rounded-lg p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1 }}
            >
              <Label className="text-lg font-semibold block text-slate-800 dark:text-slate-200">
                Select Knowledge Domains
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subjects[selectedSubject].map((domain) => (
                  <motion.button
                    key={domain.id}
                    onClick={() => handleDomainToggle(domain.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all w-full shadow-sm border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-600 active:bg-indigo-500 active:text-white active:border-indigo-500 ${
                      selectedDomains.includes(domain.id)
                        ? "bg-indigo-500 dark:bg-indigo-600 text-white  dark:border-indigo-600"
                        : ""
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <domain.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium flex-grow text-left text-sm">{domain.label}</span>
                    {selectedDomains.includes(domain.id) && (
                      <motion.div
                        className="w-2 h-2 rounded-full bg-white ml-auto"
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
        <AnimatePresence>
          {selectedSubject && (
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                className={`w-full max-w-xs px-6 py-4 text-base font-bold bg-border-indigo-200 bg-indigo-500 text-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:bg-indigo-400 dark:hover:bg-indigo-500 active:bg-indigo-400 active:text-white active:border-indigo-400  ${
                  selectedDomains.length === 0 ? "opacity-50 cursor-not-allowed text-white/80" : ""
                }`}
                size="lg"
                disabled={selectedDomains.length === 0}
                onClick={handleContinue}
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}