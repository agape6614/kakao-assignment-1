import Link from 'next/link';

// Todo 데이터 구조 정의 (TypeScript 타입 안전성 확보)
interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  date: string;
}

/**
 * 백엔드 API로부터 전체 Todo 목록을 가져오는 비동기 함수야.
 * 서버 컴포넌트가 렌더링될 때 서버 측에서 직접 실행돼.
 */
async function fetchTodos(): Promise<TodoItem[]> {
  try {
    // 백엔드 FastAPI 서버(8000포트)의 엔드포인트를 호출해.
    // 할 일 목록은 추가/수정/삭제로 자주 변경되므로 { cache: 'no-store' } 옵션으로 언제나 최신 데이터를 가져오도록 설정했어.
    const response = await fetch('http://localhost:8000/todos', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('서버로부터 데이터를 불러오는 데 실패했어.');
    }

    return await response.json();
  } catch (error) {
    console.error('데이터 패치 중 오류 발생:', error);
    // 에러 발생 시 앱이 멈추지 않도록 빈 배열을 안전하게 반환해.
    return [];
  }
}

export default async function TodosPage() {
  // 1. 서버가 백엔드 서버에 직접 요청하여 최신 Todo 데이터를 받아온다.
  const todoList = await fetchTodos();

  return (
    <div style={styles.container}>
      {/* 상단 헤더 영역 */}
      <header style={styles.header}>
        <h1 style={styles.title}>Minimal Todo</h1>
        {/* 신규 Todo 생성 페이지(/todos/new)로 이동하는 Next.js 링크 버튼 */}
        <Link href="/todos/new" style={styles.createButton}>
          + 새 할 일 추가
        </Link>
      </header>

      {/* Todo 목록 렌더링 영역 */}
      <main style={styles.main}>
        {todoList.length === 0 ? (
          // 할 일이 없을 때 보여줄 미니멀 뷰
          <p style={styles.emptyText}>아직 등록된 할 일이 없어. 새로운 일정을 추가해 봐!</p>
        ) : (
          // 할 일이 존재할 때 리스트 출력
          <ul style={styles.list}>
            {todoList.map((todo) => (
              <li key={todo.id} style={styles.listItem}>
                <div style={styles.todoInfo}>
                  {/* 완료 여부(is_completed)에 따라 시각적으로 취소선 및 텍스트 색상 구분 */}
                  <span
                    style={{
                      ...styles.todoContent,
                      textDecoration: todo.is_completed ? 'line-through' : 'none',
                      color: todo.is_completed ? '#aaa' : '#333',
                    }}
                  >
                    {todo.content}
                  </span>
                  <span style={styles.todoDate}>{todo.date}</span>
                </div>

                {/* 특정 Todo의 수정 페이지(/todos/[todoId])로 이동하는 동적 라우팅 링크 */}
                <Link href={`/todos/${todo.id}`} style={styles.editLink}>
                  수정
                </Link>
              </li>
            ))}
          </ul>
        )}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0f0',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#672be0', // 지정된 브랜드 메인 컬러 활용
    margin: 0,
    letterSpacing: '-0.5px',
  },
  createButton: {
    display: 'inline-block',
    backgroundColor: '#672be0', // 지정된 브랜드 메인 컬러 활용
    color: '#ffffff',
    padding: '10px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(103, 43, 224, 0.2)',
  },
  main: {
    width: '100%',
  },
  emptyText: {
    textAlign: 'center' as const,
    color: '#999',
    fontSize: '15px',
    padding: '48px 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    marginBottom: '14px',
    border: '1px solid #eaeaea',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
  },
  todoInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  todoContent: {
    fontSize: '16px',
    fontWeight: '500',
  },
  todoDate: {
    fontSize: '12px',
    color: '#888',
  },
  editLink: {
    color: '#672be0', // 지정된 브랜드 메인 컬러 활용
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
    backgroundColor: '#f5f0ff',
  },
};