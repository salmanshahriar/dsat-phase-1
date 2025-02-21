export interface AnswerOption {
  id: string
  content: string
}

export interface QuizQuestion {
  id: string
  stimulus: string
  stem: string
  answerOptions: AnswerOption[]
  correctAnswer: string
  rationale: string
}

export interface QuizState {
  currentQuestionIndex: number
  answers: Record<string, string>
  isComplete: boolean
}

export interface Question {
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

export interface ApiResponse {
  count: number
  questions: Question[]
}

export interface Domain {
  id: string
  label: string
  icon: any
  primary_class_cd: string
}

export interface DomainBreakdown {
  [key: string]: {
    total: number
    subdomains: {
      [key: string]: number
    }
  }
}

export interface QuizFilters {
  difficulty: "all" | "easy" | "medium" | "hard"
  markedForReview: "all" | "yes" | "no"
}