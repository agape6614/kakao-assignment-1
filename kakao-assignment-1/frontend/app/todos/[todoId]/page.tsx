import EditTodoForm from './EditTodoForm';
import Link from 'next/link';

// 데이터 타입 정의
interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  date: string;
}

/**
 * 백엔드에서 데이터를 가져오는 서버 함수야.
 */
async function fetchTodo(todoId: number): Promise<TodoItem | null> {
  try {
    const response = await fetch('http://localhost:8000/todos', {
      cache: 'no-store', // 항상 최신 데이터를 가져오도록 캐시 비활성화
    });
    
    if (!response.ok) {
      return null;
    }
    
    const todos: TodoItem[] = await response.json();
    return todos.find((todo) => todo.id === todoId) || null;
  } catch (error) {
    console.error('Todo 데이터를 불러오는 중 오류 발생:', error);
    return null;
  }
}

// 💡 핵심 변경: Next.js 15 규칙에 맞게 params의 타입을 Promise로 지정해.
export default async function EditTodoPage({ params }: { params: Promise<{ todoId: string }> }) {
  
  // 💡 핵심 변경: params 객체를 바로 쓰지 않고, await로 한 번 풀어준(resolve) 뒤 사용해!
  const resolvedParams = await params;
  const todoId = Number(resolvedParams.todoId);
  
  // 1. 서버 측에서 미리 데이터를 불러온다.
  const todo = await fetchTodo(todoId);

  // 2. 만약 해당 ID의 데이터가 없다면 에러 화면을 보여준다.
  if (!todo) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>해당 할 일을 찾을 수 없어!</p>
        <Link href="/todos" style={styles.backLink}>목록으로 돌아가기</Link>
      </div>
    );
  }

  // 3. 데이터를 성공적으로 찾았다면, 클라이언트 컴포넌트에 초기값(initialData)으로 넘겨준다.
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>할 일 수정</h1>
      </header>
      <main>
        {/* 사용자와 상호작용할 폼을 클라이언트 컴포넌트로 분리하여 호출해 */}
        <EditTodoForm initialData={todo} />
      </main>
    </div>
  );
}

// 미니멀 레이아웃 스타일
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
  errorText: {
    fontSize: '18px',
    color: '#ff4d4f',
    textAlign: 'center' as const,
    marginTop: '50px',
  },
  backLink: {
    display: 'block',
    textAlign: 'center' as const,
    color: '#672be0', // 브랜드 메인 컬러
    textDecoration: 'none',
    marginTop: '20px',
    fontWeight: '600',
  }
};