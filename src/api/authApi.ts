import { SigninUser, SignupUser, User } from "@/types/apiType";

import useUserStore from "@/store/userStore";

// 전화번호 중복 확인 (HEAD 방식)
export async function checkPhoneDuplicate(phoneNumber: string): Promise<boolean> {
  // 하이픈 제거하여 11자리 숫자만 추출
  const cleanPhoneNumber = phoneNumber.replace(/-/g, "");

  const response = await fetch(`/api/auth/check-phone?user_phone=${cleanPhoneNumber}`, {
    method: "HEAD",
  });

  // 200: 중복되지 않음 (사용 가능)
  // 409: 중복됨 (이미 존재)
  // 400: 잘못된 형식
  if (response.status === 200) {
    return false; // 중복되지 않음
  } else if (response.status === 409) {
    return true; // 중복됨
  } else {
    throw new Error("전화번호 형식이 올바르지 않습니다.");
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