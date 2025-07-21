import { NextResponse } from 'next/server';

interface UserResponse {
    id: number;
    userType: 'company' | 'factory';
    phoneNumber: string;
}

async function getUserProfile(userId: number): Promise<UserResponse> {
    const response = await fetch(`https://dooring-backend.onrender.com/app_user/:${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    console.log('백엔드 사용자 정보 응답 상태:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('백엔드 사용자 정보 오류 응답:', errorText);
        throw new Error('사용자 정보 조회 실패');
    }

    const data = await response.json();
    console.log('백엔드 사용자 정보 응답 데이터:', data);

    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
        id: data.id,
        userType: data.userType === 'INTERIOR' ? 'company' : 'factory',
        phoneNumber: data.phoneNumber,
    };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId 파라미터가 필요합니다.' },
                { status: 400 }
            );
        }

        const userData = await getUserProfile(parseInt(userId));
        return NextResponse.json(userData);
    } catch (error) {
        console.error('사용자 정보 조회 API 오류:', error);
        return NextResponse.json(
            { error: '사용자 정보 조회 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
} 