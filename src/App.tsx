import { useState } from 'react';
import { Test } from './types';
import TestSelection from './components/TestSelection';
import ExamInterface from './components/ExamInterface';
import ResultsPage from './components/ResultsPage';

type AppState = 'selection' | 'exam' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('selection');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const handleStartTest = (test: Test, newAttemptId: string) => {
    setSelectedTest(test);
    setAttemptId(newAttemptId);
    setAppState('exam');
  };

  const handleSubmitTest = () => {
    setAppState('results');
  };

  const handleBackToSelection = () => {
    setAppState('selection');
    setSelectedTest(null);
    setAttemptId(null);
  };

  return (
    <div>
      {appState === 'selection' && (
        <TestSelection onStartTest={handleStartTest} />
      )}
      {appState === 'exam' && selectedTest && attemptId && (
        <ExamInterface
          test={selectedTest}
          attemptId={attemptId}
          onSubmit={handleSubmitTest}
        />
      )}
      {appState === 'results' && attemptId && (
        <ResultsPage
          attemptId={attemptId}
          onBackToSelection={handleBackToSelection}
        />
      )}
    </div>
  );
}

export default App;
