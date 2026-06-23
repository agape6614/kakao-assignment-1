import EditTodoForm from './EditTodoForm';
import Link from 'next/link';

interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  date: string;
}

async function fetchTodo(todoId: number): Promise<TodoItem | null> {
  try {
    // 서버 컴포넌트이므로 백엔드로 직접 요청
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`, {
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    
    const todos: TodoItem[] = await response.json();
    return todos.find((todo) => todo.id === todoId) || null;
  } catch (error) {
    console.error('Todo 데이터를 불러오는 중 오류 발생:', error);
    return null;
  }
}

export default async function EditTodoPage({ params }: { params: Promise<{ todoId: string }> }) {
  // Next.js 15 규칙: params 비동기 처리
  const resolvedParams = await params;
  const todoId = Number(resolvedParams.todoId);
  
  const todo = await fetchTodo(todoId);

  if (!todo) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>해당 할 일을 찾을 수 없어!</p>
        <Link href="/todos" style={styles.backLink}>목록으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>할 일 수정</h1>
      </header>
      <main>
        <EditTodoForm initialData={todo} />
      </main>
    </div>
  );
}

const styles = {
  container: { maxWidth: '550px', margin: '60px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' },
  title: { fontSize: '24px', fontWeight: '700', color: '#333', margin: 0 },
  errorText: { fontSize: '18px', color: '#ff4d4f', textAlign: 'center' as const, marginTop: '50px' },
  backLink: { display: 'block', textAlign: 'center' as const, color: '#672be0', textDecoration: 'none', marginTop: '20px', fontWeight: '600' }
};