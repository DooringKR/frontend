import { SigninUser, SignupUser, User } from "@/types/apiType";

import useUserStore from "@/store/userStore";

// 전화번호 중복 확인 (HEAD 방식)
export async function checkPhoneDuplicate(phoneNumber: string): Promise<boolean> {
  // 하이픈 제거하여 11자리 숫자만 추출
  const cleanPhoneNumber = phoneNumber.replace(/-/g, "");

  try {
    const response = await fetch(`/api/auth/check-phone?user_phone=${cleanPhoneNumber}`, {
      method: "HEAD",
    });

    console.log("전화번호 중복 확인 응답:", response.status);

    // 200: 중복되지 않음 (사용 가능)
    // 409: 중복됨 (이미 존재)
    // 400: 잘못된 형식
    if (response.status === 200) {
      return false; // 중복되지 않음
    } else if (response.status === 409) {
      return true; // 중복됨
    } else if (response.status === 400) {
      throw new Error("전화번호 형식이 올바르지 않습니다.");
    } else {
      console.error("예상치 못한 응답 상태:", response.status);
      throw new Error("전화번호 확인 중 오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("전화번호 중복 확인 중 에러:", error);

    // 네트워크 에러나 기타 에러의 경우
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("전화번호 확인 중 오류가 발생했습니다.");
    }
  }
}

// 로그인
export async function signin(body: SigninUser): Promise<number> {
  console.log("111");
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("로그인 요청 실패");
  }

  const data = await response.json();
  console.log("로그인 응답:", data);

  // getUserProfile에서 localStorage 저장까지 처리
  const userInfo = await getUserProfile(data.user_id);

  return data.user_id;
}

// 회원가입
export async function signup(body: SignupUser): Promise<{ user_id: number }> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
    body: JSON.stringify(body),
  });
  console.log(response);
  if (!response.ok) {
    throw new Error("회원가입 요청 실패");
  }

  const data: { user_id: number } = await response.json();

  // getUserProfile에서 localStorage 저장까지 처리
  await getUserProfile(data.user_id);

  return data;
}

// 유저 정보 조회 + localStorage 저장 통합 관리
export async function getUserProfile(userId: number): Promise<User> {
  const response = await fetch(`/api/app_user/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("유저 정보 조회 실패");
  }

  const resData = await response.json();
  console.log("유저 정보 응답:", resData);

  const userInfo: User = {
    user_id: userId,
    user_type: resData.user_type,
    user_phone: resData.user_phone
  };

  // 장바구니 정보 조회
  try {
    const cartResponse = await fetch(`https://dooring-backend.onrender.com/cart/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (cartResponse.ok) {
      const cartData = await cartResponse.json();
      console.log("장바구니 정보 응답:", cartData);

      // cart_id가 있으면 설정
      if (cartData.cart_id) {
        const userStore = useUserStore.getState();
        userStore.setCartId(cartData.cart_id);
        console.log("장바구니 ID 설정:", cartData.cart_id);
      }
    } else {
      console.log("장바구니 정보 조회 실패:", cartResponse.status);
    }
  } catch (error) {
    console.error("장바구니 정보 조회 중 에러:", error);
    // 장바구니 조회 실패해도 유저 정보는 정상 처리
  }

  // localStorage 저장 통합 관리
  const userStore = useUserStore.getState();
  userStore.setUserId(userInfo.user_id);
  userStore.setUserType(userInfo.user_type);
  userStore.setUserPhoneNumber(userInfo.user_phone);

  return userInfo;
}

// 앱 시작시 자동 로그인 체크
export async function checkAutoLogin(): Promise<User | null> {
  const userStore = useUserStore.getState();
  const userId = userStore.id;

  if (userId) {
    try {
      return await getUserProfile(userId);
    } catch (error) {
      console.error("자동 로그인 실패:", error);
      userStore.resetUser();
      return null;
    }
  }

  return null;
}

// 로그아웃 - localStorage 초기화
export function logout(): void {
  const userStore = useUserStore.getState();
  userStore.resetUser();
  console.log("로그아웃 완료 - localStorage 초기화");
}