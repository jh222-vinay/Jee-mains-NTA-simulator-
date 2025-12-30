import { useState, useEffect } from 'react';

interface TimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

export default function Timer({ durationMinutes, onTimeUp }: TimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(durationMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const isLowTime = secondsRemaining < 300;

  return (
    <div
      style={{
        ...styles.container,
        ...(isLowTime ? styles.lowTime : {}),
      }}
    >
      <div style={styles.label}>Time Remaining</div>
      <div style={styles.time}>
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    transition: 'all 0.3s',
  },
  lowTime: {
    background: '#fc8181',
    animation: 'pulse 1s infinite',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    opacity: 0.9,
  },
  time: {
    fontSize: '28px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
};
