"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// @ 치트키 경로 적용
import { updateTodoAction, deleteTodoAction } from '@/app/todos/actions';

interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  date: string;
}

export default function EditTodoForm({ initialData }: { initialData: TodoItem }) {
  const router = useRouter();

  const [content, setContent] = useState(initialData.content);
  const [date, setDate] = useState(initialData.date);
  const [isCompleted, setIsCompleted] = useState(initialData.is_completed);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setErrorMessage('할 일 내용을 입력해 줘!');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await updateTodoAction(initialData.id, content, isCompleted, date);
      router.push('/todos');
    } catch (error) {
      console.error(error);
      setErrorMessage('수정 중 문제가 발생했어.');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const isConfirm = window.confirm('정말 이 할 일을 삭제할까?');
    if (!isConfirm) return;

    try {
      await deleteTodoAction(initialData.id);
    } catch (error) {
      console.error(error);
      alert('삭제 중 문제가 발생했어.');
    }
  };

  return (
    <form onSubmit={handleUpdate} style={styles.form}>
      <div style={styles.inputGroup}>
        <label style={styles.label}>할 일 내용</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textInput}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>날짜 수정</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.dateInput}
        />
      </div>

      <div style={styles.checkboxGroup}>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={(e) => setIsCompleted(e.target.checked)}
          style={styles.checkbox}
        />
        <label style={styles.checkboxLabel}>
          이 할 일을 완료했어!
        </label>
      </div>

      {errorMessage && <p style={styles.errorText}>{errorMessage}</p>}

      <div style={styles.buttonContainer}>
        <button type="button" onClick={handleDelete} style={styles.deleteButton}>
          삭제
        </button>
        
        <div style={styles.rightButtons}>
          <Link href="/todos" style={styles.cancelButton}>취소</Link>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            style={{ ...styles.submitButton, opacity: isSubmitting ? 0.6 : 1 }}
          >
            {isSubmitting ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </div>
    </form>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column' as const, gap: '24px', backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #eaeaea' },
  inputGroup: { display: 'flex', flexDirection: 'column' as const, gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#555' },
  textInput: { padding: '14px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' },
  dateInput: { padding: '14px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', color: '#333', fontFamily: 'inherit' },
  checkboxGroup: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  checkbox: { width: '18px', height: '18px', accentColor: '#672be0' },
  checkboxLabel: { fontSize: '15px', fontWeight: '500', color: '#333', cursor: 'pointer' },
  errorText: { color: '#ff4d4f', fontSize: '14px', margin: 0 },
  buttonContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' },
  rightButtons: { display: 'flex', gap: '12px' },
  deleteButton: { padding: '10px 16px', backgroundColor: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  cancelButton: { padding: '12px 20px', backgroundColor: '#f5f5f5', color: '#666', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600' },
  submitButton: { padding: '12px 24px', backgroundColor: '#672be0', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
};