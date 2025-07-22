import { NextRequest, NextResponse } from 'next/server';

export async function HEAD(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userPhone = searchParams.get('user_phone');

    if (!userPhone) {
        return NextResponse.json({ error: '전화번호가 필요합니다.' }, { status: 400 });
    }

    // 전화번호 형식 검증 (11자리 숫자)
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(userPhone)) {
        return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    console.log(`전화번호 중복 확인 요청: ${userPhone}`);

    try {
        const response = await fetch(`https://dooring-backend.onrender.com/auth?user_phone=${userPhone}`, {
            method: 'HEAD',
        });

        console.log(`백엔드 응답 상태: ${response.status}`);

        // 백엔드 응답 상태를 그대로 반환
        return new NextResponse(null, { status: response.status });
    } catch (error) {
        console.error('전화번호 중복 확인 오류:', error);

        // 배포 환경에서 백엔드 서버 연결 실패시 500 에러 반환
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
} 