import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TestAttempt, TestResponse, Question } from '../types';

interface ResultsPageProps {
  attemptId: string;
  onBackToSelection: () => void;
}

export default function ResultsPage({ attemptId, onBackToSelection }: ResultsPageProps) {
  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [responses, setResponses] = useState<(TestResponse & { question: Question })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    const { data: attemptData } = await supabase
      .from('test_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    const { data: responsesData } = await supabase
      .from('test_responses')
      .select(`
        *,
        question:questions(*)
      `)
      .eq('attempt_id', attemptId);

    if (attemptData) setAttempt(attemptData);
    if (responsesData) setResponses(responsesData as any);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Loading results...</div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>No results found</div>
      </div>
    );
  }

  const totalQuestions = attempt.correct_answers + attempt.incorrect_answers + attempt.unanswered;
  const accuracy = totalQuestions > 0
    ? ((attempt.correct_answers / (attempt.correct_answers + attempt.incorrect_answers)) * 100).toFixed(1)
    : '0';

  const physicsResponses = responses.filter((r) => r.question.subject === 'Physics');
  const chemistryResponses = responses.filter((r) => r.question.subject === 'Chemistry');
  const mathResponses = responses.filter((r) => r.question.subject === 'Mathematics');

  const getSubjectStats = (subjectResponses: typeof responses) => {
    const correct = subjectResponses.filter(
      (r) => r.selected_answer === r.question.correct_answer
    ).length;
    const incorrect = subjectResponses.filter(
      (r) => r.selected_answer && r.selected_answer !== r.question.correct_answer
    ).length;
    const unanswered = subjectResponses.filter((r) => !r.selected_answer).length;
    return { correct, incorrect, unanswered };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Test Results</h1>
      </div>

      <div style={styles.content}>
        <div style={styles.scoreCard}>
          <div style={styles.scoreSection}>
            <div style={styles.mainScore}>
              <div style={styles.scoreLabel}>Your Score</div>
              <div style={styles.scoreValue}>{attempt.score || 0}</div>
              <div style={styles.scoreSubtext}>
                out of {totalQuestions * 4} marks
              </div>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{attempt.correct_answers}</div>
              <div style={styles.statLabel}>Correct</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{attempt.incorrect_answers}</div>
              <div style={styles.statLabel}>Incorrect</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{attempt.unanswered}</div>
              <div style={styles.statLabel}>Unanswered</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statValue}>{accuracy}%</div>
              <div style={styles.statLabel}>Accuracy</div>
            </div>
          </div>
        </div>

        <div style={styles.subjectAnalysis}>
          <h2 style={styles.sectionTitle}>Subject-wise Analysis</h2>

          <div style={styles.subjectCard}>
            <h3 style={styles.subjectName}>Physics</h3>
            <div style={styles.subjectStats}>
              {(() => {
                const stats = getSubjectStats(physicsResponses);
                return (
                  <>
                    <div style={styles.subjectStat}>
                      <span>Correct:</span>
                      <span style={styles.correctText}>{stats.correct}</span>
                    </div>
                    <div style={styles.subjectStat}>
                      <span>Incorrect:</span>
                      <span style={styles.incorrectText}>{stats.incorrect}</span>
                    </div>
                    <div style={styles.subjectStat}>
                      <span>Unanswered:</span>
                      <span style={styles.unansweredText}>{stats.unanswered}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div style={styles.subjectCard}>
            <h3 style={styles.subjectName}>Chemistry</h3>
            <div style={styles.subjectStats}>
              {(() => {
                const stats = getSubjectStats(chemistryResponses);
                return (
                  <>
                    <div style={styles.subjectStat}>
                      <span>Correct:</span>
                      <span style={styles.correctText}>{stats.correct}</span>
                    </div>
                    <div style={styles.subjectStat}>
                      <span>Incorrect:</span>
                      <span style={styles.incorrectText}>{stats.incorrect}</span>
                    </div>
                    <div style={styles.subjectStat}>
                      <span>Unanswered:</span>
                      <span style={styles.unansweredText}>{stats.unanswered}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div style={styles.subjectCard}>
            <h3 style={styles.subjectName}>Mathematics</h3>
            <div style={styles.subjectStats}>
              {(() => {
                const stats = getSubjectStats(mathResponses);
                return (
                  <>
                    <div style={styles.subjectStat}>
                      <span>Correct:</span>
                      <span style={styles.correctText}>{stats.correct}</span>
                    </div>
                    <div style={styles.subjectStat}>
                      <span>Incorrect:</span>
                      <span style={styles.incorrectText}>{stats.incorrect}</span>
                    </div>
                    <div style={styles.subjectStat}>
                      <span>Unanswered:</span>
                      <span style={styles.unansweredText}>{stats.unanswered}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <button style={styles.backButton} onClick={onBackToSelection}>
          Back to Test Selection
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '24px',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  loadingText: {
    fontSize: '24px',
    color: 'white',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  scoreCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  scoreSection: {
    textAlign: 'center',
    marginBottom: '32px',
    paddingBottom: '32px',
    borderBottom: '2px solid #e2e8f0',
  },
  mainScore: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  scoreLabel: {
    fontSize: '18px',
    color: '#718096',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: '72px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1',
  },
  scoreSubtext: {
    fontSize: '16px',
    color: '#a0aec0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  statCard: {
    textAlign: 'center',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '12px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500',
  },
  subjectAnalysis: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    marginBottom: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '24px',
  },
  subjectCard: {
    padding: '24px',
    background: '#f7fafc',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  subjectName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '16px',
  },
  subjectStats: {
    display: 'flex',
    gap: '32px',
  },
  subjectStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '14px',
    color: '#718096',
  },
  correctText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#48bb78',
  },
  incorrectText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#f56565',
  },
  unansweredText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#a0aec0',
  },
  backButton: {
    width: '100%',
    padding: '16px',
    background: 'white',
    color: '#764ba2',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
