"use client"; // Next.js 규칙: 에러 바운더리 컴포넌트는 반드시 클라이언트 컴포넌트여야 해!

import { useEffect } from 'react';

// Next.js에서 Error 컴포넌트에게 기본적으로 전달해 주는 Props 타입 정의
interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void; // 에러를 복구하고 컴포넌트를 다시 렌더링하도록 시도하는 함수
}

export default function TodosErrorPage({ error, reset }: ErrorProps) {
  // 1. 에러 로깅
  // 에러가 발생하면 개발자가 확인할 수 있도록 콘솔에 출력해.
  // 실제 서비스라면 Sentry 같은 에러 수집 도구로 전송하는 로직이 이곳에 들어가.
  useEffect(() => {
    console.error('Todo 페이지에서 에러가 발생했어:', error);
  }, [error]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>⚠️</div>
        <h1 style={styles.title}>앗, 문제가 발생했어!</h1>
        <p style={styles.message}>
          {/* 에러의 구체적인 메시지를 화면에 보여줘서 상황을 파악하게 해 */}
          {error.message || '데이터를 불러오는 중 알 수 없는 오류가 발생했어.'}
        </p>
        
        {/* 사용자에게 문제를 해결할 수 있는 '다시 시도' 액션을 제공해 */}
        <button 
          onClick={() => reset()} 
          style={styles.retryButton}
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// 미니멀 & 메인 컬러(#672be0) 기반 에러 화면 스타일 정의
// ---------------------------------------------------------
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh', // 화면 중앙에 오도록 높이 설정
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
    border: '1px solid #eaeaea',
    maxWidth: '400px',
    width: '100%',
  },
  icon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 12px 0',
  },
  message: {
    fontSize: '15px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: '#672be0', // 브랜드 메인 컬러 적용
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
};