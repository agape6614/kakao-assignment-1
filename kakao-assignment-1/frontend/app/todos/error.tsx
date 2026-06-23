"use client";

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TodosErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Todo 페이지에서 에러가 발생했어:', error);
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>⚠️</div>
        <h1 style={styles.title}>앗, 문제가 발생했어!</h1>
        <p style={styles.message}>
          {error.message || '데이터를 불러오는 중 알 수 없는 오류가 발생했어.'}
        </p>
        
        <button onClick={() => reset()} style={styles.retryButton}>
          다시 시도하기
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  card: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', textAlign: 'center' as const, backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)', border: '1px solid #eaeaea', maxWidth: '400px', width: '100%' },
  icon: { fontSize: '48px', marginBottom: '16px' },
  title: { fontSize: '22px', fontWeight: '700', color: '#333', margin: '0 0 12px 0' },
  message: { fontSize: '15px', color: '#666', marginBottom: '24px', lineHeight: '1.5' },
  retryButton: { padding: '12px 24px', backgroundColor: '#672be0', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.2s' },
};