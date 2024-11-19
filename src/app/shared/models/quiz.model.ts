export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface Topic {
  topic: string;
  questions: Question[];
}

export interface QuizData {
  [courseId: number]: Topic[];
}