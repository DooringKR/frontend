"use client";

import { KakaoSignupUsecase } from "@/DDD/usecase/auth/kakao_signup_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { KakaoAuthSupabaseRepository } from "@/DDD/data/service/kakao_auth_supabase_repository";
import Image from "next/image";
import Header from "@/components/Header/Header";
import PaintBruchVertical from "public/icons/paintbrush_vertical";
import Factory from "public/icons/factory";
import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";
import useSignupStore from "@/store/signupStore";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import useCartStore from "@/store/cartStore";
import useBizClientStore from "@/store/bizClientStore";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import InitAmplitudeUnstable from "@/app/(client-helpers)/init-amplitude-unstable";
import { trackView, trackClick, trackClickAndWait } from "@/services/analytics/amplitude";
import { trackViewUnstable, trackClickUnstable, trackClickAndWaitUnstable } from "@/services/analytics/amplitude-unstable";
import { setScreenName, getPreviousScreenName, getScreenName } from "@/utils/screenName";
import { takeAfterLogin } from "@/utils/afterLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionError, useAction } from "@/components/ui/use-action";
import Field from "@/components/form/Field";
import { useRequired } from "@/components/form/useRequired";
import Sheet from "@/components/overlay/Sheet";
import Notice from "@/components/state/Notice";
import { Loading } from "@/components/state/StateViews";

/** auth/callback 이 실패하면 `?error=` 로 보내는 코드 → 이 화면 위에 띄우는 글 */
const LOGIN_ERRORS: Record<string, string> = {
    network: "일시적인 네트워크 오류입니다. 처음부터 다시 시도해주세요.",
    signup_failed: "회원가입에 실패했습니다. 다시 시도해주세요.",
    auth_failed: "로그인에 실패했습니다. 다시 시도해주세요.",
    unexpected: "일시적인 네트워크 오류입니다. 처음부터 다시 시도해주세요.",
};

// dev 로그인과 동일한 개발자 계정 (테스트 가입 시 ID: test, PW: test1234 입력하면 이 계정으로 로그인)
const DEV_EMAIL = "dooringbizclient@dooring.com";
const DEV_PASSWORD = "187400";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginError = searchParams.get('error');

    const [isLoading, setIsLoading] = useState(true);

    // 개발자용 숨겨진 페이지 접근을 위한 클릭 카운터
    const [clickCount, setClickCount] = useState(0);
    const [lastClickTime, setLastClickTime] = useState(0);

    // 테스트 가입(결제 심사용) 시트
    const [isTestLoginOpen, setIsTestLoginOpen] = useState(false);
    const [testId, setTestId] = useState("");
    const [testPw, setTestPw] = useState("");
    const testReq = useRequired({ id: !!testId.trim(), pw: !!testPw });
    // 로그인은 성공하면 다른 화면으로 넘어간다 — 넘어가는 동안 계속 막아 둔다
    const kakao = useAction({ holdOnSuccess: true });
    const testLogin = useAction({ holdOnSuccess: true });

    const kakaoSignupUsecase = new KakaoSignupUsecase(
        new KakaoAuthSupabaseRepository(),
        new BizClientSupabaseRepository(),
        new CartSupabaseRepository()
    );

    useEffect(() => {
        // 유저 정보 확인 및 리다이렉트 처리
        const checkUserAndRedirect = async () => {
            try {
                if (loginError === 'user_not_found') {
                    return;
                }
                // 1. 유저 로그인 여부 확인
                const { data: { user }, error } = await supabase.auth.getUser();
                const bizClient = useBizClientStore.getState().bizClient;

                if (user && bizClient) {
                    console.log('📡 유저 로그인 되어있음');
                    router.push(takeAfterLogin() ?? "/");
                    return;
                } else if (user && !bizClient) {
                    // 1. 유저는 로그인되어 있지만 bizClient가 없는 경우 - 로그아웃 처리
                    console.log('📡 로그인된 유저가 있지만 bizClient가 없음 - 로그아웃 처리');
                    await supabase.auth.signOut();
                    useBizClientStore.setState({ bizClient: null });
                    useCartStore.setState({ cart: null });
                } else {
                    // 2. 유저가 로그인되어 있지 않은 경우 - 로그인 대기 상태
                    console.log('📡 유저 로그인되어 있지 않음 - 로그인 대기');
                }
            } catch (err) {
                console.error("Error checking user:", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserAndRedirect();
    }, [router]);

    // 현재 화면명을 마운트 시 1회 설정 (이전 화면명은 보존됨)
    useEffect(() => {
        setScreenName('start');
    }, []);

    // 페이지 진입 View 이벤트 트래킹 (로딩 완료 시 전송)
    useEffect(() => {
        if (!isLoading) {
            try {
                const prev = getPreviousScreenName();
                trackView({
                    object_type: "screen",
                    object_name: null,
                    current_screen: typeof window !== 'undefined' ? window.screen_name ?? null : null,
                    previous_screen: prev,
                });
            } catch (e) {
                // no-op
            }
        }
    }, [isLoading]);

    // dev/login과 동일: ID test, PW test1234 입력 시 개발자 계정으로 로그인
    const handleTestLogin = () => {
        if (!testReq.check()) return;
        testLogin.run(async () => {
            if (testId.trim() !== "test" || testPw !== "test1234") {
                throw new Error("ID 또는 비밀번호가 올바르지 않습니다.");
            }
            await supabase.auth.signOut();
            useCartStore.setState({ cart: null });
            useBizClientStore.setState({ bizClient: null });

            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: DEV_EMAIL,
                password: DEV_PASSWORD,
            });
            if (loginError) throw new Error("개발자 계정 로그인에 실패했습니다.");

            const session = loginData.session;
            if (!session) throw new Error("로그인에 실패했습니다.");

            const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
            const bizClientResponse = await readBizClientUsecase.execute(session.user.id);
            if (!bizClientResponse.success || !bizClientResponse.data) {
                throw new Error("사용자 정보를 찾을 수 없습니다. 개발자 계정이 설정되지 않았습니다.");
            }

            const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
            const cart = await readCartUsecase.findById(session.user.id);

            useBizClientStore.setState({ bizClient: bizClientResponse.data });
            useCartStore.setState({ cart: cart ?? null });
            setIsTestLoginOpen(false);
            router.replace(takeAfterLogin() ?? "/");
        });
    };

    const startKakao = () =>
        kakao.run(async () => {
            // Track click and wait briefly to increase delivery chance before redirect
            await trackClickAndWait({
                object_type: "button",
                object_name: "kakao",
                current_page: getScreenName() ?? 'start',
                modal_name: null,
            });
            // OAuth 시작 (uid로 bizClient 확인 후 분기처리를 위해 type=check로 설정)
            let ok = false;
            try {
                const kakaoResponse = await new KakaoAuthSupabaseRepository().checkAndLogin();
                console.log('OAuth 시작 결과:', kakaoResponse);
                ok = kakaoResponse.success;
            } catch (error) {
                console.error('카카오 로그인 처리 중 오류:', error);
            }
            if (!ok) throw new Error("일시적인 에러입니다. 다시 시도해주세요.");
        });

    // 로그인 확인 중
    if (isLoading) {
        return <Loading className="h-screen" />;
    }

    return (
        <div className="flex h-screen w-full flex-col">
            {/* 메인 콘텐츠: 로고, 버튼, 구분선, 전화주문 */}
            <div className="flex flex-col items-center justify-center px-8 pt-8 gap-[40px]">
                {/* 로고 영역 */}
                <div className="text-center gap-5">
                    <div className="mb-6">
                        <Image
                            src="/img/start-page-image.png"
                            alt="로고"
                            width={window.innerWidth}
                            height={window.innerHeight}
                            className="mx-auto"
                        />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-800">
                        급하게 가구가 <br />
                        필요한 모든 순간
                    </h1>
                    <div className="flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="89" height="24" viewBox="0 0 89 24" fill="none">
                            <g clipPath="url(#clip0_2964_13319)">
                                <path d="M83.8723 1.79692V1.42769H69.9155V4.48H80.3387C80.3096 4.95723 80.2341 5.71024 80.1088 6.74968L80.1085 6.75184L80.1083 6.75403C79.9621 8.10195 79.7264 9.54181 79.4003 11.0739L79.3056 11.52H82.8211L82.8805 11.2232C83.1451 9.89984 83.3763 8.43835 83.5741 6.83917C83.7731 5.23115 83.8723 3.55029 83.8723 1.79692Z" fill="#99A1AF" />
                                <path d="M78.7523 14.8923H88.5V11.8154H66.1493V14.8923H75.2816V24H78.7523V14.8923Z" fill="#99A1AF" />
                                <path d="M56.1381 3.4736L56.1981 3.05232H45.0651V6.10461H52.2085C51.2237 9.37309 48.8315 12.6034 44.9773 15.7893L44.6355 16.072L47.1781 18.2015L47.4144 18.0099C52.4155 13.9559 55.3355 9.10896 56.1381 3.4736Z" fill="#99A1AF" />
                                <path d="M66.1493 8.02461H62.26V0H58.8384V23.5569H62.26V11.2H66.1493V8.02461Z" fill="#99A1AF" />
                                <path d="M29.5955 10.2646H39.1216V2.11692H26.0262V5.12H35.6507V7.26155H26.1246V15.5569H31.0968V17.7477H21.62V20.8246H43.9707V17.7477H34.5923V15.5569H39.5893V12.5538H29.5955V10.2646Z" fill="#99A1AF" />
                                <path d="M17.9523 7.95077H21.8415V11.1262H17.9523V23.5569H14.5308V0H17.9523V7.95077ZM3.87232 7.43384H8.59845V2.88H11.9708V16.7877H0.5V2.88H3.87232V7.43384ZM3.87232 10.4615V13.7354H8.59845V10.4615H3.87232Z" fill="#99A1AF" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2964_13319">
                                    <rect width="88" height="24" fill="white" transform="translate(0.5)" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* 로그인 버튼 */}
                <div className="flex flex-col gap-4">
                    {loginError && LOGIN_ERRORS[loginError] && <Notice tone="red">{LOGIN_ERRORS[loginError]}</Notice>}
                    <Button variant="kakao" busy={kakao.busy} onClick={startKakao} className="w-full">
                        {!kakao.busy && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
                                <path d="M9.75 0C4.36519 0 0 3.44184 0 7.6875C0 10.4324 1.82494 12.8409 4.57013 14.201C4.42078 14.716 3.61041 17.5145 3.57816 17.7343C3.57816 17.7343 3.55875 17.8995 3.66572 17.9625C3.77269 18.0255 3.8985 17.9766 3.8985 17.9766C4.20525 17.9337 7.45566 15.6505 8.01825 15.2541C8.58028 15.3337 9.159 15.375 9.75 15.375C15.1348 15.375 19.5 11.9332 19.5 7.6875C19.5 3.44184 15.1348 0 9.75 0Z" fill="black" />
                            </svg>
                        )}
                        카카오로 시작하기
                    </Button>
                    <ActionError error={kakao.error} className="text-center" />
                    <Button asChild variant="outline" size="md" className="w-[300px] h-[40px]">
                        <a
                            href="tel:0315284002"
                            onClick={() =>
                                trackClick({
                                    object_type: "button",
                                    object_name: "phone",
                                    current_page: getScreenName() ?? 'start',
                                    modal_name: null,
                                })
                            }
                        >
                            눌러서 전화 연결
                        </a>
                    </Button>
                    <Button variant="secondary" onClick={() => {
                            setTestId("");
                            setTestPw("");
                            testReq.reset();
                            testLogin.clear();
                            setIsTestLoginOpen(true);
                        }} className="w-[300px] h-[40px]">테스트 가입</Button>
                </div>
                <div
                    className="text-center text-m text-black-400"
                    onClick={() => {
                        // 개발자용 숨겨진 페이지 접근 로직
                        const now = Date.now();

                        // 3초 내에 연속 클릭인지 확인
                        if (now - lastClickTime < 3000) {
                            setClickCount(prev => prev + 1);
                        } else {
                            setClickCount(1); // 새로운 연속 클릭 시작
                        }

                        setLastClickTime(now);

                        // 5번 연속 클릭 시 개발자 로그인 페이지로 이동
                        if (clickCount >= 4) { // 0부터 시작하므로 4면 5번째
                            console.log('🔓 개발자 모드 접근');
                            router.push('/dev/login');
                            setClickCount(0); // 리셋
                            return;
                        }
                    }}
                >
                    고객센터 전화번호 : 031-528-4002
                </div>

            </div>

            {/* 테스트 가입 시트 (결제 심사용) */}
            <Sheet
                open={isTestLoginOpen}
                onOpenChange={(o) => {
                    if (!testLogin.busy) setIsTestLoginOpen(o);
                }}
                title="테스트 가입"
                description="결제 심사용 테스트 계정으로 로그인합니다."
                footer={
                    <div className="flex w-full flex-col gap-3">
                        <ActionError error={testLogin.error} />
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setIsTestLoginOpen(false)} disabled={testLogin.busy} className="flex-1">취소</Button>
                            <Button variant="inverse" onClick={handleTestLogin} busy={testLogin.busy} className="flex-1">로그인</Button>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <Field label="ID" required fieldRef={testReq.ref("id")} error={testReq.error("id")}>
                        <Input
                            placeholder="ID 입력"
                            aria-invalid={!!testReq.error("id")}
                            value={testId}
                            onChange={e => {
                                setTestId(e.target.value);
                                testLogin.clear();
                            }}
                        />
                    </Field>
                    <Field label="비밀번호" required fieldRef={testReq.ref("pw")} error={testReq.error("pw")}>
                        <Input
                            type="password"
                            placeholder="비밀번호 입력"
                            aria-invalid={!!testReq.error("pw")}
                            value={testPw}
                            onChange={e => {
                                setTestPw(e.target.value);
                                testLogin.clear();
                            }}
                        />
                    </Field>
                </div>
            </Sheet>

            {/* 하단 안내 텍스트 */}
            <div className="px-8 pb-8 fixed bottom-0 w-full max-w-[460px]">
                <div className="text-center">
                    <p className="text-xs text-gray-400">
                        로그인 시{" "}
                        <a
                            href="https://dooring.notion.site/barogagu-terms-of-use"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-600"
                        >
                            서비스 이용약관
                        </a>
                        {" "}및{" "}
                        <a
                            href="https://dooring.notion.site/barogagu-privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline hover:text-blue-600"
                        >
                            개인정보처리방침
                        </a>
                        에
                    </p>
                    <p className="text-xs text-gray-400">
                        동의하는 것으로 간주됩니다
                    </p>
                </div>
            </div>
        </div>
    );
}

function LoginPage() {
    return (
        <Suspense fallback={<Loading className="h-screen" />}>
            {/* Amplitude 초기화 (클라이언트 전용) */}
            <InitAmplitude />
            <LoginPageContent />
        </Suspense>
    );
}

export default LoginPage;