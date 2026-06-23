import Link from 'next/link';

interface TodoItem {
  id: number;
  content: string;
  is_completed: boolean;
  date: string;
}

async function fetchTodos(): Promise<TodoItem[]> {
  try {
    // 💡 변경됨: 8000포트가 아닌, 우리가 방금 만든 Next.js API Route를 호출해!
    // 서버가 서버를 호출하는 BFF(Backend For Frontend) 구조 완성이야.
    const response = await fetch('http://localhost:3000/api/todos', {
      cache: 'no-store',
    });

    if (!response.ok) throw new Error('데이터 로딩 실패');
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TodosPage() {
  const todoList = await fetchTodos();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Minimal Todo</h1>
        <Link href="/todos/new" style={styles.createButton}>+ 새 할 일 추가</Link>
      </header>

      <main style={styles.main}>
        {todoList.length === 0 ? (
          <p style={styles.emptyText}>아직 등록된 할 일이 없어. 새로운 일정을 추가해 봐!</p>
        ) : (
          <ul style={styles.list}>
            {todoList.map((todo) => (
              <li key={todo.id} style={styles.listItem}>
                <div style={styles.todoInfo}>
                  <span style={{
                    ...styles.todoContent,
                    textDecoration: todo.is_completed ? 'line-through' : 'none',
                    color: todo.is_completed ? '#aaa' : '#333',
                  }}>
                    {todo.content}
                  </span>
                  <span style={styles.todoDate}>{todo.date}</span>
                </div>
                <Link href={`/todos/${todo.id}`} style={styles.editLink}>수정</Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

// (스타일 코드는 기존과 동일하므로 생략하거나 그대로 유지하면 돼!)
const styles = {
  container: { maxWidth: '550px', margin: '60px auto', padding: '0 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' },
  title: { fontSize: '26px', fontWeight: '700', color: '#672be0', margin: 0, letterSpacing: '-0.5px' },
  createButton: { display: 'inline-block', backgroundColor: '#672be0', color: '#ffffff', padding: '10px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' },
  main: { width: '100%' },
  emptyText: { textAlign: 'center' as const, color: '#999', fontSize: '15px', padding: '48px 0' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', backgroundColor: '#ffffff', borderRadius: '12px', marginBottom: '14px', border: '1px solid #eaeaea' },
  todoInfo: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  todoContent: { fontSize: '16px', fontWeight: '500' },
  todoDate: { fontSize: '12px', color: '#888' },
  editLink: { color: '#672be0', textDecoration: 'none', fontSize: '14px', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#f5f0ff' },
};