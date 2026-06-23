// app/todos/actions.ts
"use server"; // 💡 이 파일 안의 모든 함수는 오직 서버에서만 실행된다는 아주 중요한 선언!

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const BACKEND_URL = 'http://localhost:8000/todos';

// 1. Todo 생성 액션 (POST)
export async function createTodoAction(content: string, date: string) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, date }),
    });

    if (!response.ok) throw new Error('생성 실패');
  } catch (error) {
    console.error('Todo 생성 에러:', error);
    throw new Error('생성 중 오류가 발생했어.');
  }

  // 성공 시 캐시를 지워 최신 상태로 만들고, 목록 페이지로 이동시켜! (router.refresh()가 필요 없어짐)
  revalidatePath('/todos');
  redirect('/todos');
}

// 2. Todo 수정 액션 (PUT)
export async function updateTodoAction(id: number, content: string, isCompleted: boolean, date: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, is_completed: isCompleted, date }),
    });

    if (!response.ok) throw new Error('수정 실패');
  } catch (error) {
    console.error('Todo 수정 에러:', error);
    throw new Error('수정 중 오류가 발생했어.');
  }

  // 수정 후 목록 페이지 데이터를 최신화해.
  revalidatePath('/todos');
}

// 3. Todo 삭제 액션 (DELETE)
export async function deleteTodoAction(id: number) {
  try {
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('삭제 실패');
  } catch (error) {
    console.error('Todo 삭제 에러:', error);
    throw new Error('삭제 중 오류가 발생했어.');
  }

  // 삭제 후 목록 페이지 데이터를 최신화하고 이동해.
  revalidatePath('/todos');
  redirect('/todos');
}