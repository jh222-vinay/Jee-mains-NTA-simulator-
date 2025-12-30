import { Question, TestResponse, QuestionStatus } from '../types';

interface QuestionNavigatorProps {
  questions: Question[];
  responses: Map<string, TestResponse>;
  currentQuestionIndex: number;
  onQuestionClick: (index: number) => void;
  onSubmit: () => void;
}

export default function QuestionNavigator({
  questions,
  responses,
  currentQuestionIndex,
  onQuestionClick,
  onSubmit,
}: QuestionNavigatorProps) {
  const getQuestionStatus = (question: Question): QuestionStatus => {
    const response = responses.get(question.id);
    if (!response) return 'not-visited';

    if (response.selected_answer && response.is_marked_for_review) return 'answered-marked';
    if (response.selected_answer) return 'answered';
    if (response.is_marked_for_review) return 'marked';
    return 'not-answered';
  };

  const getStatusColor = (status: QuestionStatus): string => {
    switch (status) {
      case 'not-visited':
        return '#cbd5e0';
      case 'not-answered':
        return '#fc8181';
      case 'answered':
        return '#68d391';
      case 'marked':
        return '#f6ad55';
      case 'answered-marked':
        return '#a78bfa';
      default:
        return '#cbd5e0';
    }
  };

  const physicsQuestions = questions.filter((q) => q.subject === 'Physics');
  const chemistryQuestions = questions.filter((q) => q.subject === 'Chemistry');
  const mathQuestions = questions.filter((q) => q.subject === 'Mathematics');

  const renderQuestionGrid = (subjectQuestions: Question[]) => {
    return (
      <div style={styles.questionGrid}>
        {subjectQuestions.map((question) => {
          const globalIndex = questions.indexOf(question);
          const status = getQuestionStatus(question);
          const isActive = globalIndex === currentQuestionIndex;

          return (
            <div
              key={question.id}
              style={{
                ...styles.questionButton,
                background: getStatusColor(status),
                ...(isActive ? styles.activeQuestion : {}),
              }}
              onClick={() => onQuestionClick(globalIndex)}
            >
              {globalIndex + 1}
            </div>
          );
        })}
      </div>
    );
  };

  const countByStatus = (status: QuestionStatus): number => {
    return questions.filter((q) => getQuestionStatus(q) === status).length;
  };

  return (
    <div style={styles.container}>
      <div style={styles.legend}>
        <h3 style={styles.legendTitle}>Question Status</h3>
        <div style={styles.legendItems}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#68d391' }} />
            <span>Answered ({countByStatus('answered')})</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#fc8181' }} />
            <span>Not Answered ({countByStatus('not-answered')})</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#cbd5e0' }} />
            <span>Not Visited ({countByStatus('not-visited')})</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#f6ad55' }} />
            <span>Marked ({countByStatus('marked')})</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendColor, background: '#a78bfa' }} />
            <span>Answered & Marked ({countByStatus('answered-marked')})</span>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Physics</h3>
        {renderQuestionGrid(physicsQuestions)}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Chemistry</h3>
        {renderQuestionGrid(chemistryQuestions)}
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Mathematics</h3>
        {renderQuestionGrid(mathQuestions)}
      </div>

      <button style={styles.submitButton} onClick={onSubmit}>
        Submit Test
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  legend: {
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
  },
  legendTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '12px',
  },
  legendItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#4a5568',
  },
  legendColor: {
    width: '20px',
    height: '20px',
    borderRadius: '4px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  questionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
  },
  questionButton: {
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a202c',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '2px solid transparent',
  },
  activeQuestion: {
    border: '2px solid #2d3748',
    transform: 'scale(1.05)',
  },
  submitButton: {
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '12px',
  },
};
