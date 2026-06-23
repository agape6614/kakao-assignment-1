"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 💡 라우터 훅 추가
import Link from 'next/link';
import { createTodoAction } from '@/app/todos/actions'; 

export default function NewTodoPage() {
  const router = useRouter(); // 💡 라우터 활성화
  
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrorMessage('할 일 내용을 입력해 줘!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await createTodoAction(content, date);
      // 💡 서버 연동이 에러 없이 끝나면 클라이언트가 직접 이동해!
      router.push('/todos');
    } catch (error) {
      console.error(error);
      setErrorMessage('저장 중 문제가 발생했어. 다시 시도해 줘.');
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>새 할 일 추가</h1>
      </header>

      <main>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>할 일 내용</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={styles.textInput}
              autoFocus
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>날짜 선택</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>

          {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

          <div style={styles.buttonGroup}>
            <Link href="/todos" style={styles.cancelButton}>취소</Link>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ ...styles.submitButton, opacity: isSubmitting ? 0.6 : 1 }}
            >
              {isSubmitting ? '저장 중...' : '추가하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

const styles = {
  container: { maxWidth: '550px', margin: '60px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' },
  title: { fontSize: '24px', fontWeight: '700', color: '#333', margin: 0 },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '24px', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea' },
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#555' },
  textInput: { padding: '14px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  dateInput: { padding: '14px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  errorText: { color: '#ff4d4f', fontSize: '14px', margin: 0 },
  buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelButton: { padding: '12px 20px', backgroundColor: '#f5f5f5', color: '#666', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' },
  submitButton: { padding: '12px 24px', backgroundColor: '#672be0', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600' },
};