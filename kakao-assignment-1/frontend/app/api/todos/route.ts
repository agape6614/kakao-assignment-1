import { NextResponse } from 'next/server';

// 환경변수 적용: 백엔드 URL
const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/todos`;

export async function GET() {
  try {
    const response = await fetch(BACKEND_URL, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('FastAPI 서버 응답 에러');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route GET 에러:', error);
    return NextResponse.json(
      { error: '데이터를 불러오는 중 문제가 발생했어.' },
      { status: 500 }
    );
  }
}