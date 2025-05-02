import useUserStore from "@/store/userStore";
import { SigninUser, SignupUser, User } from "@/types/apiType";


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
export async function signup(body: SignupUser): Promise<void>{
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