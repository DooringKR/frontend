import { NextRequest, NextResponse } from 'next/server';

export async function HEAD(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userPhone = searchParams.get('user_phone');

    if (!userPhone) {
        return NextResponse.json({ error: '전화번호가 필요합니다.' }, { status: 400 });
    }

    // 백엔드 서버가 다운된 경우를 위한 임시 처리
    const isDevelopment = process.env.NODE_ENV === 'development';

    console.log(`NODE_ENV: ${process.env.NODE_ENV}, isDevelopment: ${isDevelopment}`);

    try {
        const response = await fetch(`https://dooring-backend.onrender.com/auth?user_phone=${userPhone}`, {
            method: 'HEAD',
        });

        console.log(`백엔드 응답 상태: ${response.status}`);

        // 백엔드 서버가 502 오류를 반환하는 경우 개발 환경에서는 임시 처리
        if (response.status === 502 && isDevelopment) {
            console.log('개발 환경에서 백엔드 서버 502 오류, 임시로 200 응답 반환');
            return new NextResponse(null, { status: 200 });
        }

        // 백엔드 응답 상태를 그대로 반환
        return new NextResponse(null, { status: response.status });
    } catch (error) {
        console.error('전화번호 중복 확인 오류:', error);

        // 개발 환경에서 백엔드 서버가 다운된 경우 임시로 200 응답 (중복되지 않음)
        if (isDevelopment) {
            console.log('개발 환경에서 백엔드 서버 연결 실패, 임시로 200 응답 반환');
            return new NextResponse(null, { status: 200 });
        }

        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
} 