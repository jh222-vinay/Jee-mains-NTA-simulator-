# JEE Main NTA Simulator

A realistic Computer Based Test (CBT) simulator for JEE Main examination practice. This application provides an authentic exam experience with features similar to the actual NTA JEE Main CBT interface.

## Features

- **Authentic Exam Interface**: Mimics the actual JEE Main CBT interface used in the real exam
- **Three Subjects**: Physics, Chemistry, and Mathematics questions
- **Real-time Timer**: Countdown timer with auto-submit when time expires
- **Question Navigation**: Easy navigation between questions with visual status indicators
- **Mark for Review**: Mark questions for later review
- **Question Status Tracking**:
  - Not Visited (Gray)
  - Not Answered (Red)
  - Answered (Green)
  - Marked for Review (Orange)
  - Answered & Marked (Purple)
- **Detailed Results**: Complete analysis with subject-wise breakdown
- **Score Calculation**: Automatic scoring with +4 for correct and -1 for incorrect answers

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Styling**: Inline styles with modern design

## Getting Started

The application comes pre-configured with:
- Sample questions across all three subjects
- A mock test with 30 questions
- Database schema and migrations
- Supabase connection

## Usage

1. Select a test from the test selection page
2. Click "Start Test" to begin
3. Answer questions, navigate between them, and mark questions for review
4. Submit the test when ready or let the timer auto-submit
5. View detailed results with subject-wise analysis

## Database Schema

- **questions**: Stores all exam questions with options and correct answers
- **tests**: Test configurations and metadata
- **test_attempts**: Tracks user test attempts and results
- **test_responses**: Individual question responses for each attempt

## Sample Data

The application includes 30 sample questions:
- 10 Physics questions covering Mechanics, Electrostatics, Optics, and more
- 10 Chemistry questions covering Physical, Organic, and Inorganic Chemistry
- 10 Mathematics questions covering Algebra, Calculus, Trigonometry, and more
