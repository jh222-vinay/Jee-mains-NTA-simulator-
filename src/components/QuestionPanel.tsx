import { Question } from '../types';

interface QuestionPanelProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  isMarkedForReview: boolean;
  onAnswerSelect: (answer: 'A' | 'B' | 'C' | 'D') => void;
  onMarkForReview: () => void;
  onClearResponse: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionPanel({
  question,
  questionNumber,
  selectedAnswer,
  isMarkedForReview,
  onAnswerSelect,
  onMarkForReview,
  onClearResponse,
  onNext,
  onPrevious,
  isFirst,
  isLast,
}: QuestionPanelProps) {
  const options = [
    { key: 'A' as const, text: question.option_a },
    { key: 'B' as const, text: question.option_b },
    { key: 'C' as const, text: question.option_c },
    { key: 'D' as const, text: question.option_d },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.questionHeader}>
        <span style={styles.questionNumber}>Question {questionNumber}</span>
        <span style={styles.marks}>
          Marks: +{question.marks} | {question.negative_marks}
        </span>
      </div>

      <div style={styles.questionText}>{question.question_text}</div>

      <div style={styles.optionsContainer}>
        {options.map((option) => (
          <div
            key={option.key}
            style={{
              ...styles.optionItem,
              ...(selectedAnswer === option.key ? styles.selectedOption : {}),
            }}
            onClick={() => onAnswerSelect(option.key)}
          >
            <div style={styles.optionKey}>{option.key}</div>
            <div style={styles.optionText}>{option.text}</div>
          </div>
        ))}
      </div>

      <div style={styles.actionsRow}>
        <div style={styles.leftActions}>
          <button
            style={styles.actionButton}
            onClick={onMarkForReview}
          >
            {isMarkedForReview ? 'Unmark for Review' : 'Mark for Review'}
          </button>
          <button
            style={{ ...styles.actionButton, ...styles.clearButton }}
            onClick={onClearResponse}
          >
            Clear Response
          </button>
        </div>

        <div style={styles.navigationButtons}>
          <button
            style={{
              ...styles.navButton,
              ...(isFirst ? styles.navButtonDisabled : {}),
            }}
            onClick={onPrevious}
            disabled={isFirst}
          >
            Previous
          </button>
          <button
            style={{
              ...styles.navButton,
              ...styles.nextButton,
              ...(isLast ? styles.navButtonDisabled : {}),
            }}
            onClick={onNext}
            disabled={isLast}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    height: 'fit-content',
  },
  questionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e2e8f0',
  },
  questionNumber: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2d3748',
  },
  marks: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500',
  },
  questionText: {
    fontSize: '18px',
    lineHeight: '1.8',
    color: '#1a202c',
    marginBottom: '32px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  },
  optionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  selectedOption: {
    background: '#edf2f7',
    borderColor: '#667eea',
  },
  optionKey: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f7fafc',
    borderRadius: '50%',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2d3748',
    flexShrink: 0,
  },
  optionText: {
    fontSize: '16px',
    color: '#2d3748',
    lineHeight: '1.6',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '24px',
    borderTop: '1px solid #e2e8f0',
  },
  leftActions: {
    display: 'flex',
    gap: '12px',
  },
  actionButton: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    background: 'white',
    color: '#2d3748',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  clearButton: {
    borderColor: '#fc8181',
    color: '#c53030',
  },
  navigationButtons: {
    display: 'flex',
    gap: '12px',
  },
  navButton: {
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    background: '#e2e8f0',
    color: '#2d3748',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  nextButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  navButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
