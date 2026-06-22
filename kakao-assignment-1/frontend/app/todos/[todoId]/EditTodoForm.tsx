"use client"; // 상태 관리와 이벤트 핸들링을 위해 클라이언트 컴포넌트로 선언!

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  date: string;
}

export default function EditTodoForm({ initialData }: { initialData: TodoItem }) {
  const router = useRouter();

  // 서버에서 넘겨준 초기 데이터(initialData)를 State의 기본값으로 세팅해.
  const [content, setContent] = useState(initialData.content);
  const [date, setDate] = useState(initialData.date);
  const [isCompleted, setIsCompleted] = useState(initialData.is_completed);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. 할 일 수정 (PUT 요청) 핸들러
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrorMessage('할 일 내용을 입력해 줘!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 기존에 백엔드에 만들었던 PUT 엔드포인트를 호출해 데이터 덮어쓰기
      const response = await fetch(`http://localhost:8000/todos/${initialData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content,
          is_completed: isCompleted,
          date: date,
        }),
      });

      if (!response.ok) throw new Error('수정에 실패했어.');

      // 성공 시 목록으로 이동하고 서버 데이터 새로고침
      router.push('/todos');
      router.refresh();
      
    } catch (error) {
      console.error(error);
      setErrorMessage('수정 중 문제가 발생했어.');
      setIsSubmitting(false);
    }
  };

  // 2. 할 일 삭제 (DELETE 요청) 핸들러
  const handleDelete = async () => {
    const isConfirm = window.confirm('정말 이 할 일을 삭제할까?');
    if (!isConfirm) return;

    try {
      // 기존에 백엔드에 만들었던 DELETE 엔드포인트 호출
      const response = await fetch(`http://localhost:8000/todos/${initialData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('삭제에 실패했어.');

      router.push('/todos');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('삭제 중 문제가 발생했어.');
    }
  };

  return (
    <form onSubmit={handleUpdate} style={styles.form}>
      <div style={styles.inputGroup}>
        <label htmlFor="todo-content" style={styles.label}>할 일 내용</label>
        <input
          id="todo-content"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textInput}
        />
      </div>

      <div style={styles.inputGroup}>
        <label htmlFor="todo-date" style={styles.label}>날짜 수정</label>
        <input
          id="todo-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      {/* 완료 여부를 체크할 수 있는 토글 영역 */}
      <div style={styles.checkboxGroup}>
        <input
          id="todo-completed"
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          style={styles.checkbox}
        />
        <label htmlFor="todo-completed" style={styles.checkboxLabel}>
          이 할 일을 완료했어!
        </label>
      </div>

      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

      <div style={styles.buttonContainer}>
        {/* 삭제 버튼은 폼 동작과 분리하기 위해 type="button" 사용 */}
        <button type="button" onClick={handleDelete} style={styles.deleteButton}>
          삭제
        </button>
        
        <div style={styles.rightButtons}>
          <Link href="/todos" style={styles.cancelButton}>취소</Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.6 : 1,
            }}
          >
            {isSubmitting ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </div>
    </form>
  );
}

// ---------------------------------------------------------
// 미니멀 & 메인 컬러(#672be0) 기반 폼 스타일 정의
// ---------------------------------------------------------
const styles = {
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
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#555' },
  textInput: {
    padding: '14px 16px', fontSize: '16px', borderRadius: '8px',
    border: '1px solid #ddd', outline: 'none',
  },
  dateInput: {
    padding: '14px 16px', fontSize: '16px', borderRadius: '8px',
    border: '1px solid #ddd', outline: 'none', color: '#333', fontFamily: 'inherit',
  },
  checkboxGroup: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px',
  },
  checkbox: { width: '18px', height: '18px', accentColor: '#672be0' },
  checkboxLabel: { fontSize: '15px', fontWeight: '500', color: '#333', cursor: 'pointer' },
  errorText: { color: '#ff4d4f', fontSize: '14px', margin: 0 },
  buttonContainer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px',
  },
  rightButtons: { display: 'flex', gap: '12px' },
  deleteButton: {
    padding: '10px 16px', backgroundColor: '#fff', color: '#ff4d4f',
    border: '1px solid #ff4d4f', borderRadius: '8px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
  },
  cancelButton: {
    padding: '12px 20px', backgroundColor: '#f5f5f5', color: '#666',
    borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600',
  },
  submitButton: {
    padding: '12px 24px', backgroundColor: '#672be0', color: '#ffffff', // 메인 컬러 적용
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
  },
};