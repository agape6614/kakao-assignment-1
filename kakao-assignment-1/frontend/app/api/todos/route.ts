// app/api/todos/route.ts
import { NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8000/todos';

export async function GET() {
  try {
    // Next.js 서버가 대신 FastAPI 백엔드로 데이터를 요청해.
    const response = await fetch(BACKEND_URL, {
      cache: 'no-store', // 항상 최신 데이터를 가져오도록 캐시 비활성화
    });

    if (!response.ok) {
      throw new Error('FastAPI 서버 응답 에러');
    }

    const data = await response.json();
    
    // 프론트엔드에게 성공적으로 데이터를 전달해.
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route GET 에러:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 문제가 발생했어.' },
      { status: 500 }
    );
  }
}