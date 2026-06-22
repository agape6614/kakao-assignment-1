"use client"; // 이 파일은 클라이언트 브라우저에서 실행되는 Client Component야.

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewTodoPage() {
  const router = useRouter();
  
  // 1. 상태(State) 관리
  // content: 사용자가 입력하는 할 일 내용
  // date: 할 일의 기준 날짜 (기본값은 오늘 날짜 YYYY-MM-DD)
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  // 상태 피드백을 위한 변수 (에러 메시지 및 로딩 상태)
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. 폼 제출 핸들러 (백엔드 API로 데이터 전송)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 브라우저가 새로고침되는 기본 동작을 막아줘.

    // 유효성 검사: 내용이 비어있으면 저장을 막고 에러 메시지를 띄워.
    if (!content.trim()) {
      setErrorMessage('할 일 내용을 입력해 줘!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 백엔드 FastAPI 서버의 POST 엔드포인트 호출
      const response = await fetch('http://localhost:8000/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          date: date,
        }),
      });

      if (!response.ok) {
        throw new Error('서버에 저장하는 데 실패했어.');
      }

      // 저장이 성공적으로 끝나면 목록 페이지(/todos)로 이동해.
      router.push('/todos');
      // 이동한 뒤 서버 컴포넌트가 최신 데이터를 다시 불러오도록 새로고침을 지시해.
      router.refresh(); 
      
    } catch (error) {
      console.error('Todo 생성 에러:', error);
      setErrorMessage('저장 중 문제가 발생했어. 다시 시도해 줘.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>새 할 일 추가</h1>
      </header>

      <main>
        {/* 생성 폼 영역 */}
        <form onSubmit={handleSubmit} style={styles.form}>
          
          <div style={styles.inputGroup}>
            <label htmlFor="todo-content" style={styles.label}>할 일 내용</label>
            <input
              id="todo-content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="무엇을 할 계획인가요?"
              style={styles.textInput}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="todo-date" style={styles.label}>날짜 선택</label>
            <input
              id="todo-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          {/* 에러 메시지 출력 영역 */}
          {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

          <div style={styles.buttonGroup}>
            {/* 목록으로 돌아가기 링크 */}
            <Link href="/todos" style={styles.cancelButton}>
              취소
            </Link>
            {/* 저장 버튼 (제출 중일 때는 비활성화) */}
            <button 
              type="submit" 
              disabled={isSubmitting} 
              style={{
                ...styles.submitButton,
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '저장 중...' : '추가하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ---------------------------------------------------------
// 생산성 앱 테마를 위한 미니멀 스타일 정의 (#672be0 컬러 반영)
// ---------------------------------------------------------
const styles = {
  container: {
    maxWidth: '550px',
    margin: '60px auto',
    padding: '0 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    border: '1px solid #eaeaea',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  textInput: {
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.2s',
    // 포커스 시 메인 컬러 적용을 위해 CSS 클래스 활용을 추천하지만 인라인 스타일로 기본 처리
  },
  dateInput: {
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    outline: 'none',
    color: '#333',
    fontFamily: 'inherit',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: '14px',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '12px 20px',
    backgroundColor: '#f5f5f5',
    color: '#666',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#672be0', // 브랜드 메인 컬러
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
  },
};