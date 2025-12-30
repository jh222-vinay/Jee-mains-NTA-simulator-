/*
  # JEE Main CBT Simulator Database Schema

  ## Overview
  Creates the complete database schema for a JEE Main Computer Based Test simulator,
  including questions, tests, test attempts, and user responses.

  ## Tables Created

  ### 1. questions
  Stores all JEE Main questions with their options and correct answers.
  - `id` (uuid, primary key) - Unique question identifier
  - `subject` (text) - Subject area (Physics, Chemistry, Mathematics)
  - `topic` (text) - Specific topic within the subject
  - `question_text` (text) - The question content
  - `option_a` (text) - First option
  - `option_b` (text) - Second option
  - `option_c` (text) - Third option
  - `option_d` (text) - Fourth option
  - `correct_answer` (text) - Correct option (A, B, C, or D)
  - `marks` (integer) - Marks for correct answer (default: 4)
  - `negative_marks` (integer) - Negative marks for wrong answer (default: -1)
  - `difficulty` (text) - Question difficulty (easy, medium, hard)
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. tests
  Stores test configurations and metadata.
  - `id` (uuid, primary key) - Unique test identifier
  - `title` (text) - Test title
  - `description` (text) - Test description
  - `duration_minutes` (integer) - Test duration in minutes
  - `total_questions` (integer) - Total number of questions
  - `physics_questions` (integer) - Number of physics questions
  - `chemistry_questions` (integer) - Number of chemistry questions
  - `math_questions` (integer) - Number of mathematics questions
  - `created_at` (timestamptz) - Creation timestamp

  ### 3. test_attempts
  Tracks user test attempts and their results.
  - `id` (uuid, primary key) - Unique attempt identifier
  - `test_id` (uuid, foreign key) - Reference to test
  - `started_at` (timestamptz) - When the test was started
  - `submitted_at` (timestamptz, nullable) - When the test was submitted
  - `time_taken_seconds` (integer, nullable) - Total time taken
  - `score` (integer, nullable) - Final score
  - `correct_answers` (integer, default: 0) - Number of correct answers
  - `incorrect_answers` (integer, default: 0) - Number of incorrect answers
  - `unanswered` (integer, default: 0) - Number of unanswered questions
  - `created_at` (timestamptz) - Creation timestamp

  ### 4. test_responses
  Stores individual question responses for each test attempt.
  - `id` (uuid, primary key) - Unique response identifier
  - `attempt_id` (uuid, foreign key) - Reference to test attempt
  - `question_id` (uuid, foreign key) - Reference to question
  - `selected_answer` (text, nullable) - User's selected answer (A, B, C, D, or null)
  - `is_marked_for_review` (boolean, default: false) - Whether question is marked for review
  - `time_spent_seconds` (integer, default: 0) - Time spent on this question
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access to questions and tests (for demo purposes)
  - Users can create and read their own test attempts and responses
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL CHECK (subject IN ('Physics', 'Chemistry', 'Mathematics')),
  topic text NOT NULL,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  marks integer DEFAULT 4,
  negative_marks integer DEFAULT -1,
  difficulty text DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now()
);

-- Create tests table
CREATE TABLE IF NOT EXISTS tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 180,
  total_questions integer NOT NULL DEFAULT 90,
  physics_questions integer DEFAULT 30,
  chemistry_questions integer DEFAULT 30,
  math_questions integer DEFAULT 30,
  created_at timestamptz DEFAULT now()
);

-- Create test_attempts table
CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id uuid NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  started_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  time_taken_seconds integer,
  score integer,
  correct_answers integer DEFAULT 0,
  incorrect_answers integer DEFAULT 0,
  unanswered integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create test_responses table
CREATE TABLE IF NOT EXISTS test_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer text CHECK (selected_answer IN ('A', 'B', 'C', 'D') OR selected_answer IS NULL),
  is_marked_for_review boolean DEFAULT false,
  time_spent_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_responses ENABLE ROW LEVEL SECURITY;

-- Questions policies (public read for demo)
CREATE POLICY "Anyone can read questions"
  ON questions FOR SELECT
  TO public
  USING (true);

-- Tests policies (public read for demo)
CREATE POLICY "Anyone can read tests"
  ON tests FOR SELECT
  TO public
  USING (true);

-- Test attempts policies (public insert and read for demo)
CREATE POLICY "Anyone can create test attempts"
  ON test_attempts FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read test attempts"
  ON test_attempts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update test attempts"
  ON test_attempts FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Test responses policies (public insert and read for demo)
CREATE POLICY "Anyone can create test responses"
  ON test_responses FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read test responses"
  ON test_responses FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update test responses"
  ON test_responses FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_test_responses_attempt_id ON test_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_test_responses_question_id ON test_responses(question_id);
