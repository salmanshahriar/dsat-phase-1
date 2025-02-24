"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ChevronRight, Brain, Sparkles, Atom } from "lucide-react";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

// Define Question interface
interface Question {
  id: number;
  status: string;
  tags: string[];
  questionCategory: string;
  externalId: string;
  questionInfo: {
    updateDate: number;
    pPcc: string;
    questionId: string;
    skill_cd: string;
    score_band_range_cd: number;
    uId: string;
    skill_desc: string;
    createDate: number;
    program: string;
    primary_class_cd_desc: string;
    ibn: null | string;
    external_id: string;
    primary_class_cd: string;
    difficulty: "E" | "M" | "H";
  };
}

// Define filter options
const filterOptions = {
  difficulty: [
    { label: "All", value: "all" },
    { label: "Easy", value: "E" },
    { label: "Medium", value: "M" },
    { label: "Hard", value: "H" },
  ],
} as const;

// Define type for subjects[subject]
type SubjectDomain = {
  id: string;
  label: string;
  icon: typeof Brain | typeof Sparkles | typeof Atom;
  primary_class_cd: string;
};

type SubjectDomains = SubjectDomain[];

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

// Define props interface with stricter subject type
interface QuizSetupProps {
  subject: "English" | "Math";
  domains: string[];
  onBack: () => void;
  onStart: () => void;
}

export function QuizSetup({ subject, domains, onBack, onStart }: QuizSetupProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ difficulty: "all" | "E" | "M" | "H" }>({ difficulty: "all" });
  const [showSkillCheckboxes, setShowSkillCheckboxes] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const sessionData =
    typeof window !== "undefined"
      ? document.cookie
          .split("; ")
          .find((row) => row.startsWith("session_data="))
          ?.split("=")[1] || ""
      : "";

      const router = useRouter();
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://zoogle.projectdaffodil.xyz/api/v1/getQuestions", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionData}`,
          },
          body: JSON.stringify({
            questionCategory: subject,
            primary_class_cd: domains,
          }),
        });


        if (response.status === 401) {
          document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
          });
          
          router.push("/login");
          router.refresh();
          return;
        }

        if (!response.ok) throw new Error("Failed to fetch questions");

        const data = await response.json();
        if (!data || !data.questions) throw new Error("Invalid response structure");
        setQuestions(data.questions);
        setQuestionsCount(data.count);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (subject && domains.length > 0) fetchQuestions();
  }, [subject, domains, sessionData]);

  const filteredQuestions = questions.filter(
    (question) => filters.difficulty === "all" || question.questionInfo.difficulty === filters.difficulty
  );

  const domainBreakdown = filteredQuestions.reduce(
    (acc, question) => {
      const domain = question.questionInfo.primary_class_cd;
      const skillCd = question.questionInfo.skill_cd;
      const skillDesc = question.questionInfo.skill_desc;

      if (!acc[domain]) acc[domain] = { total: 0, skills: {} };
      acc[domain].total += 1;

      if (!acc[domain].skills[skillCd]) acc[domain].skills[skillCd] = { name: skillDesc, count: 0 };
      acc[domain].skills[skillCd].count += 1;

      return acc;
    },
    {} as Record<string, { total: number; skills: Record<string, { name: string; count: number }> }>
  );

  const handleSkillSelect = (skillCd: string, checked: boolean) => {
    setSelectedSkills((prev) => (checked ? [...prev, skillCd] : prev.filter((cd) => cd !== skillCd)));
  };

  useEffect(() => {
    localStorage.setItem("selected_skills", JSON.stringify(selectedSkills));
  }, [selectedSkills]);

  const handleStartPractice = () => {
    const finalQuestions =
      selectedSkills.length === 0
        ? filteredQuestions
        : filteredQuestions.filter((q) => selectedSkills.includes(q.questionInfo.skill_cd));
    const externalIds = finalQuestions.map((question) => question.externalId);
    localStorage.setItem("questions_externalId_array", JSON.stringify(externalIds));
    onStart();
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] overflow-auto flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-64px)] overflow-auto flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-red-500 p-4">
        <p className="text-sm font-medium">{error}</p>
        <Button
          onClick={onBack}
          className="mt-4 bg-indigo-500 dark:bg-indigo-400 text-white dark:text-slate-900 px-4 py-2 rounded-lg"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="h-[calc(100vh-64px)] overflow-auto space-y-3 w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 rounded-lg md:px-6 mb-20 md:mb-0.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </motion.div>

      {/* Quiz Info */}
      <motion.div
        className="w-full bg-white dark:bg-slate-800 rounded-lg p-3 flex items-center justify-between shadow-sm border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Found {filteredQuestions.length} Questions
        </span>
        <div className="text-sm flex items-center gap-3 font-medium">
          <span className="text-slate-700 dark:text-slate-300">
            Subject: <span className="text-indigo-500 dark:text-indigo-400">{subject}</span>
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-700 dark:text-slate-300">Domains:</span>
            <div className="flex flex-wrap gap-1">
              {domains.map((domain) => (
                <span
                  key={domain}
                  className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-xs rounded-full text-indigo-700 dark:text-indigo-300"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="p-3 bg-white dark:bg-slate-800 shadow-sm rounded-lg">
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(filterOptions).map(([key, options]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                  {key}:
                </span>
                <div className="flex gap-1">
                  {options.map((option) => (
                    <Button
                      key={option.value}
                      variant={filters[key as keyof typeof filters] === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, [key]: option.value } as { difficulty: "all" | "E" | "M" | "H" }))
                      }
                      className={cn(
                        "h-6 px-2 text-xs rounded-lg",
                        filters[key as keyof typeof filters] === option.value
                          ? "bg-indigo-500 text-white dark:bg-indigo-400 dark:text-slate-900"
                          : "text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900"
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
        <div className="space-y-3 mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Question Breakdown
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSkillCheckboxes((prev) => !prev)}
              className="text-indigo-500 dark:text-indigo-400 border-indigo-500 dark:border-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 rounded-lg"
            >
              {showSkillCheckboxes ? "Hide Skills Filter" : "Show Skills Filter"}
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(domainBreakdown).map(([domainKey, domain]) => {
              const domainInfo = subjects[subject].find((d) => d.primary_class_cd === domainKey);
              return (
                <Card
                  key={domainKey}
                  className="p-3 flex flex-col relative bg-white dark:bg-slate-800 shadow-md rounded-lg"
                >
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-xs rounded-full text-indigo-700 dark:text-indigo-300">
                      {domainInfo?.primary_class_cd}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 dark:bg-indigo-400 text-white flex items-center justify-center font-bold text-sm">
                      {domain.total}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {domainInfo?.label}
                    </h3>
                  </div>
                  <div className="flex-grow">
                    <div className="space-y-1.5">
                      {Object.entries(domain.skills).map(([skillCd, skill]) => (
                        <div key={skillCd} className="flex items-center gap-2">
                          {showSkillCheckboxes && (
                            <input
                              type="checkbox"
                              checked={selectedSkills.includes(skillCd)}
                              onChange={(e) => handleSkillSelect(skillCd, e.target.checked)}
                              className="accent-indigo-500 dark:accent-indigo-400 w-4 h-4"
                            />
                          )}
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-medium text-xs">
                            {skill.count}
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-300">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Start Practice */}
      <motion.div
        className="flex justify-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Button
          size="lg"
          className="w-full max-w-xs px-6 py-4 text-base font-bold bg-indigo-500 dark:bg-indigo-400 text-white dark:text-slate-900 rounded-lg hover:bg-indigo-500 dark:hover:bg-indigo-500 transition-colors"
          disabled={filteredQuestions.length === 0}
          onClick={handleStartPractice}
        >
          Start Practice
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </motion.div>
  );
}