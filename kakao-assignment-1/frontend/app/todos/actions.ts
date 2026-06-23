"use server";

import { revalidatePath } from 'next/cache';

// 환경변수 적용
const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`;

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

  // 💡 데이터가 변경되었으니 캐시만 새로고침하고, 이동(redirect)은 지웠어!
  revalidatePath('/todos');
}

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

  revalidatePath('/todos');
}

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

  // 💡 데이터가 변경되었으니 캐시만 새로고침해.
  revalidatePath('/todos');
}