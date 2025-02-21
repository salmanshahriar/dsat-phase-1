import type { QuizQuestion } from "../types/quiz"

export const fetchQuizQuestions = async (): Promise<QuizQuestion[]> => {
  return new Promise((resolve) => {
    const storedQuestions = localStorage.getItem("questions_externalId_array");
    
    if (storedQuestions) {
      const questions = JSON.parse(storedQuestions);
      setTimeout(() => {
        resolve(questions);
      }, 1000);
    } else {
      setTimeout(() => {
        resolve([]);
      }, 1000);
    }
  });
}