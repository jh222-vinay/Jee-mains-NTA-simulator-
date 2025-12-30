export interface Question {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  negative_marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  total_questions: number;
  physics_questions: number;
  chemistry_questions: number;
  math_questions: number;
  created_at: string;
}

export interface TestAttempt {
  id: string;
  test_id: string;
  started_at: string;
  submitted_at?: string;
  time_taken_seconds?: number;
  score?: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  created_at: string;
}

export interface TestResponse {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer?: 'A' | 'B' | 'C' | 'D';
  is_marked_for_review: boolean;
  time_spent_seconds: number;
  created_at: string;
  updated_at: string;
}

export type QuestionStatus = 'not-visited' | 'not-answered' | 'answered' | 'marked' | 'answered-marked';
