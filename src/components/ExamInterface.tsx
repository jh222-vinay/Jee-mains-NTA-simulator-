import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Test, Question, TestResponse } from '../types';
import QuestionPanel from './QuestionPanel';
import QuestionNavigator from './QuestionNavigator';
import Timer from './Timer';

interface ExamInterfaceProps {
  test: Test;
  attemptId: string;
  onSubmit: () => void;
}

export default function ExamInterface({ test, attemptId, onSubmit }: ExamInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Map<string, TestResponse>>(new Map());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');

  useEffect(() => {
    loadQuestionsAndResponses();
  }, [test.id, attemptId]);

  const loadQuestionsAndResponses = async () => {
    const { data: physicsQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', 'Physics')
      .limit(test.physics_questions);

    const { data: chemistryQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', 'Chemistry')
      .limit(test.chemistry_questions);

    const { data: mathQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('subject', 'Mathematics')
      .limit(test.math_questions);

    const allQuestions = [
      ...(physicsQuestions || []),
      ...(chemistryQuestions || []),
      ...(mathQuestions || []),
    ];

    setQuestions(allQuestions);

    for (const question of allQuestions) {
      const { data: existingResponse } = await supabase
        .from('test_responses')
        .select('*')
        .eq('attempt_id', attemptId)
        .eq('question_id', question.id)
        .maybeSingle();

      if (!existingResponse) {
        await supabase.from('test_responses').insert({
          attempt_id: attemptId,
          question_id: question.id,
          selected_answer: null,
          is_marked_for_review: false,
          time_spent_seconds: 0,
        });
      }
    }

    const { data: responsesData } = await supabase
      .from('test_responses')
      .select('*')
      .eq('attempt_id', attemptId);

    const responsesMap = new Map<string, TestResponse>();
    responsesData?.forEach((response) => {
      responsesMap.set(response.question_id, response);
    });
    setResponses(responsesMap);
    setLoading(false);
  };

  const handleAnswerSelect = async (answer: 'A' | 'B' | 'C' | 'D') => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = responses.get(currentQuestion.id);

    if (response) {
      const { error } = await supabase
        .from('test_responses')
        .update({
          selected_answer: answer,
          updated_at: new Date().toISOString(),
        })
        .eq('id', response.id);

      if (!error) {
        const updatedResponse = { ...response, selected_answer: answer };
        const newResponses = new Map(responses);
        newResponses.set(currentQuestion.id, updatedResponse);
        setResponses(newResponses);
      }
    }
  };

  const handleMarkForReview = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = responses.get(currentQuestion.id);

    if (response) {
      const newMarkedStatus = !response.is_marked_for_review;
      const { error } = await supabase
        .from('test_responses')
        .update({
          is_marked_for_review: newMarkedStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', response.id);

      if (!error) {
        const updatedResponse = { ...response, is_marked_for_review: newMarkedStatus };
        const newResponses = new Map(responses);
        newResponses.set(currentQuestion.id, updatedResponse);
        setResponses(newResponses);
      }
    }
  };

  const handleClearResponse = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const response = responses.get(currentQuestion.id);

    if (response) {
      const { error } = await supabase
        .from('test_responses')
        .update({
          selected_answer: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', response.id);

      if (!error) {
        const updatedResponse = { ...response, selected_answer: undefined };
        const newResponses = new Map(responses);
        newResponses.set(currentQuestion.id, updatedResponse);
        setResponses(newResponses);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      updateCurrentSubject(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      updateCurrentSubject(currentQuestionIndex - 1);
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    updateCurrentSubject(index);
  };

  const updateCurrentSubject = (index: number) => {
    if (questions[index]) {
      setCurrentSubject(questions[index].subject);
    }
  };

  const handleSubmitTest = async () => {
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalScore = 0;

    questions.forEach((question) => {
      const response = responses.get(question.id);
      if (!response || !response.selected_answer) {
        unansweredCount++;
      } else if (response.selected_answer === question.correct_answer) {
        correctCount++;
        totalScore += question.marks;
      } else {
        incorrectCount++;
        totalScore += question.negative_marks;
      }
    });

    await supabase
      .from('test_attempts')
      .update({
        submitted_at: new Date().toISOString(),
        score: totalScore,
        correct_answers: correctCount,
        incorrect_answers: incorrectCount,
        unanswered: unansweredCount,
      })
      .eq('id', attemptId);

    onSubmit();
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading exam...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentResponse = currentQuestion ? responses.get(currentQuestion.id) : undefined;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.headerTitle}>JEE Main CBT Simulator</h1>
          <span style={styles.subjectBadge}>{currentSubject}</span>
        </div>
        <Timer
          durationMinutes={test.duration_minutes}
          onTimeUp={handleTimeUp}
        />
      </div>

      <div style={styles.mainContent}>
        <div style={styles.questionSection}>
          {currentQuestion && (
            <QuestionPanel
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={currentResponse?.selected_answer}
              isMarkedForReview={currentResponse?.is_marked_for_review || false}
              onAnswerSelect={handleAnswerSelect}
              onMarkForReview={handleMarkForReview}
              onClearResponse={handleClearResponse}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
            />
          )}
        </div>

        <div style={styles.navigatorSection}>
          <QuestionNavigator
            questions={questions}
            responses={responses}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionClick={handleQuestionClick}
            onSubmit={() => setShowSubmitConfirm(true)}
          />
        </div>
      </div>

      {showSubmitConfirm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Submit Test?</h2>
            <p style={styles.modalText}>
              Are you sure you want to submit the test? You won't be able to change your answers after submission.
            </p>
            <div style={styles.modalButtons}>
              <button
                style={{ ...styles.modalButton, ...styles.cancelButton }}
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.modalButton, ...styles.submitButton }}
                onClick={handleSubmitTest}
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  subjectBadge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
  },
  loadingText: {
    fontSize: '24px',
    color: '#4a5568',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    gap: '24px',
    padding: '24px',
    maxWidth: '1600px',
    margin: '0 auto',
    width: '100%',
  },
  questionSection: {
    flex: '1 1 70%',
    minWidth: 0,
  },
  navigatorSection: {
    flex: '0 0 380px',
    minWidth: '380px',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: '#1a202c',
  },
  modalText: {
    fontSize: '16px',
    color: '#4a5568',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelButton: {
    background: '#e2e8f0',
    color: '#2d3748',
  },
  submitButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
};
