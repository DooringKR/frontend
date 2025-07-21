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

  // 유저 정보(factory, interior 여부 등) 가져와서 local storage에 저장
  const userInfo = await getUserProfile(data.user_id);

  const userStore = useUserStore.getState();
  userStore.setUserId(userInfo.user_id);
  userStore.setUserType(userInfo.user_type);
  userStore.setUserPhoneNumber(userInfo.user_phone);

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

  // 회원가입 성공 후 사용자 정보를 store에 저장
  const { user_id, user_type, user_phone } = await getUserProfile(data.user_id);

  const userStore = useUserStore.getState();
  userStore.setUserId(user_id);
  userStore.setUserType(user_type);
  userStore.setUserPhoneNumber(user_phone);

  return data;
}

// 유저 정보 조회
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

  const data: User = {
    user_id: userId,
    user_type: resData.user_type,
    user_phone: resData.user_phone
  };
  return data;
}