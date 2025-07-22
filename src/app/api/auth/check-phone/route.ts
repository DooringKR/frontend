import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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
        // 백엔드는 여전히 HEAD 방식으로 호출 (백엔드 개발자 요구사항 유지)
        const response = await fetch(`https://dooring-backend.onrender.com/auth?user_phone=${userPhone}`, {
            method: 'HEAD',
        });

        console.log(`백엔드 응답 상태: ${response.status}`);

        // 백엔드 응답 상태에 따라 JSON 응답 반환
        if (response.status === 200) {
            return NextResponse.json({ isDuplicate: false, message: '사용 가능한 전화번호입니다.' });
        } else if (response.status === 409) {
            return NextResponse.json({ isDuplicate: true, message: '이미 가입된 전화번호입니다.' }, { status: 409 });
        } else {
            return NextResponse.json({ error: '전화번호 확인 중 오류가 발생했습니다.' }, { status: response.status });
        }
    } catch (error) {
        console.error('전화번호 중복 확인 오류:', error);

        // 배포 환경에서 백엔드 서버 연결 실패시 500 에러 반환
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
}

// CORS preflight 요청 처리
export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Methods': 'GET, POST, HEAD, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
        },
    });
} 