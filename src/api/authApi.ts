import { SigninUser, SignupUser, User } from "@/types/apiType";

import useUserStore from "@/store/userStore";

// 전화번호 중복 확인 (HEAD 방식)
export async function checkPhoneDuplicate(phoneNumber: string): Promise<boolean> {
  // 하이픈 제거하여 11자리 숫자만 추출
  const cleanPhoneNumber = phoneNumber.replace(/-/g, "");

  const response = await fetch(`http://localhost:3001/auth?user_phone=${cleanPhoneNumber}`, {
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

// 로그인 & 기존 유저 체크
export async function signin(body: SigninUser): Promise<{ isRegistered: boolean }> {
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

  if (!data.isRegistered) {
    return { isRegistered: false };
  }
  const { id, userType, phoneNumber } = await getUserProfile();

  const userStore = useUserStore.getState();
  userStore.setUserId(id);
  userStore.setUserType(userType);
  userStore.setUserPhoneNumber(phoneNumber);

  return { isRegistered: true };
}

// 회원가입
export async function signup(body: SignupUser): Promise<void> {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키 포함
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("회원가입 요청 실패");
  }

  const data = await response.json();

  const { id, userType, phoneNumber } = await getUserProfile();

  const userStore = useUserStore.getState();
  userStore.setUserId(id);
  userStore.setUserType(userType);
  userStore.setUserPhoneNumber(phoneNumber);

  return data;
}

// 유저 정보 조회
export async function getUserProfile(): Promise<User> {
  const response = await fetch("/api/user", {
    method: "GET",
    credentials: "include",
  });
  const data: User = await response.json();
  return data;
}
