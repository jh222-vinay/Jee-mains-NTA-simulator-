import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Test } from '../types';

interface TestSelectionProps {
  onStartTest: (test: Test, attemptId: string) => void;
}

export default function TestSelection({ onStartTest }: TestSelectionProps) {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tests:', error);
    } else {
      setTests(data || []);
    }
    setLoading(false);
  };

  const handleStartTest = async (test: Test) => {
    const { data: attempt, error } = await supabase
      .from('test_attempts')
      .insert({
        test_id: test.id,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating test attempt:', error);
      alert('Failed to start test. Please try again.');
      return;
    }

    if (attempt) {
      onStartTest(test, attempt.id);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>Loading tests...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>JEE Main CBT Simulator</h1>
        <p style={styles.subtitle}>
          Practice for JEE Main with realistic Computer Based Test interface
        </p>
      </div>

      <div style={styles.testsContainer}>
        {tests.length === 0 ? (
          <div style={styles.noTests}>No tests available</div>
        ) : (
          tests.map((test) => (
            <div key={test.id} style={styles.testCard}>
              <h2 style={styles.testTitle}>{test.title}</h2>
              <p style={styles.testDescription}>{test.description}</p>
              <div style={styles.testDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Duration:</span>
                  <span style={styles.detailValue}>{test.duration_minutes} minutes</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Total Questions:</span>
                  <span style={styles.detailValue}>{test.total_questions}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Physics:</span>
                  <span style={styles.detailValue}>{test.physics_questions}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Chemistry:</span>
                  <span style={styles.detailValue}>{test.chemistry_questions}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Mathematics:</span>
                  <span style={styles.detailValue}>{test.math_questions}</span>
                </div>
              </div>
              <button
                style={styles.startButton}
                onClick={() => handleStartTest(test)}
              >
                Start Test
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    color: 'white',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
  },
  subtitle: {
    fontSize: '18px',
    opacity: 0.9,
  },
  loadingText: {
    color: 'white',
    fontSize: '24px',
    textAlign: 'center',
    padding: '60px',
  },
  testsContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  testCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  testTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: '12px',
  },
  testDescription: {
    fontSize: '16px',
    color: '#4a5568',
    marginBottom: '24px',
    lineHeight: '1.6',
  },
  testDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
    padding: '20px',
    background: '#f7fafc',
    borderRadius: '8px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '14px',
    color: '#718096',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '18px',
    color: '#2d3748',
    fontWeight: 'bold',
  },
  startButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  noTests: {
    color: 'white',
    fontSize: '20px',
    textAlign: 'center',
    padding: '40px',
  },
};
