"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button/Button";
import BoxedInput from "@/components/Input/BoxedInput";
import { supabase } from "@/lib/supabase";
import { ReadBizClientUsecase } from "@/DDD/usecase/user/read_bizClient_usecase";
import { BizClientSupabaseRepository } from "@/DDD/data/db/User/bizclient_supabase_repository";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import useBizClientStore from "@/store/bizClientStore";
import useCartStore from "@/store/cartStore";

export default function DevLoginPage() {
    const router = useRouter();
    const [devPassword, setDevPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [matrixChars, setMatrixChars] = useState<string[]>([]);
    // const [glitchText, setGlitchText] = useState("DEVELOPER ACCESS");
    const [showTerminal, setShowTerminal] = useState(false);

    // 개발자 계정 정보
    const DEV_EMAIL = "dooringbizclient@dooring.com";
    const DEV_PASSWORD = "187400";

    // Matrix 효과를 위한 문자 생성
    useEffect(() => {
        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
        const matrixArray = Array.from({ length: 50 }, () =>
            chars[Math.floor(Math.random() * chars.length)]
        );
        setMatrixChars(matrixArray);

        const interval = setInterval(() => {
            setMatrixChars(prev => prev.map(() =>
                chars[Math.floor(Math.random() * chars.length)]
            ));
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Glitch 효과
    // useEffect(() => {
    //     const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    //     const interval = setInterval(() => {
    //         const originalText = "DEVELOPER ACCESS";
    //         let glitched = "";
    //         for (let i = 0; i < originalText.length; i++) {
    //             if (Math.random() < 0.1) {
    //                 glitched += glitchChars[Math.floor(Math.random() * glitchChars.length)];
    //             } else {
    //                 glitched += originalText[i];
    //             }
    //         }
    //         setGlitchText(glitched);
    //     }, 200);

    //     return () => clearInterval(interval);
    // }, []);

    // 터미널 애니메이션
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTerminal(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = async () => {
        if (devPassword !== DEV_PASSWORD) {
            setError("잘못된 비밀번호입니다.");
            setDevPassword("");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            console.log("🔓 개발자 인증 시작");
            supabase.auth.signOut();
            useCartStore.setState({ cart: null });
            useBizClientStore.setState({ bizClient: null });

            // 1. 현재 세션 확인
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            let currentSession = sessionData.session;

            // 2. 세션이 없으면 개발자 계정으로 로그인 시도
            if (!currentSession) {
                console.log("📡 세션 없음 - 개발자 계정으로 로그인 시도");

                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email: DEV_EMAIL,
                    password: DEV_PASSWORD
                });

                if (loginError) {
                    console.error("개발자 계정 로그인 오류:", loginError);
                    setError("개발자 계정 로그인에 실패했습니다.");
                    return;
                }

                currentSession = loginData.session;
                console.log("✅ 개발자 계정 로그인 성공");
            } else {
                console.log("✅ 기존 세션 확인됨");
            }

            if (!currentSession) {
                setError("로그인에 실패했습니다.");
                return;
            }

            console.log("✅ 세션 확인됨, uid로 bizClient 존재 여부 확인 시작");

            // 3. bizClient 조회
            const readBizClientUsecase = new ReadBizClientUsecase(new BizClientSupabaseRepository());
            const bizClientResponse = await readBizClientUsecase.execute(currentSession.user.id);
            console.log("📡 bizClient 조회 결과:", bizClientResponse);

            if (!bizClientResponse.success || !bizClientResponse.data) {
                setError("사용자 정보를 찾을 수 없습니다. 개발자 계정이 설정되지 않았습니다.");
                return;
            }

            // 4. Cart 조회
            const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
            const cart = await readCartUsecase.findById(currentSession.user.id);
            console.log("📡 Cart 조회 결과:", cart);

            // 5. 스토어 업데이트
            useBizClientStore.setState({ bizClient: bizClientResponse.data });
            useCartStore.setState({ cart: cart! });

            // 6. 개발자 모드 인증 완료
            setIsAuthenticated(true);
            setError("");
            console.log("🔓 개발자 인증 성공 - 모든 데이터 로드 완료");

        } catch (error) {
            console.error("개발자 로그인 처리 중 오류:", error);
            setError("로그인 처리 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
                {/* Matrix 배경 */}
                <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-10 gap-1 p-4">
                        {matrixChars.map((char, index) => (
                            <div key={index} className="text-xs animate-pulse">
                                {char}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 네온 그리드 배경 */}
                <div className="absolute inset-0 opacity-10">
                    <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
                        {Array.from({ length: 400 }).map((_, i) => (
                            <div key={i} className="border border-green-500/20"></div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                    {/* 헤더 */}
                    <div className="text-center mb-12">
                        <div className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse">
                            SYSTEM ACCESS
                        </div>
                        <div className="text-green-400 text-lg font-mono">
                            [AUTHENTICATION SUCCESSFUL]
                        </div>
                        <div className="text-green-500 text-sm mt-2">
                            Welcome, Developer
                        </div>
                    </div>

                    {/* 메뉴 그리드 */}
                    <div className="grid grid-cols-1 gap-6 max-w-2xl w-full">
                        <div
                            className="group relative bg-black/50 border-2 border-green-500/50 rounded-lg p-6 cursor-pointer hover:border-green-400 hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                            onClick={() => router.push("/dev/environment")}
                        >
                            <div className="text-green-400 text-2xl mb-2">🔍</div>
                            <div className="text-white font-bold text-lg mb-2">ENVIRONMENT</div>
                            <div className="text-green-500 text-sm">System Information</div>
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>

                        <div
                            className="group relative bg-black/50 border-2 border-gray-500/50 rounded-lg p-6 cursor-pointer hover:border-gray-400 hover:shadow-lg hover:shadow-gray-500/25 transition-all duration-300"
                            onClick={() => router.push("/")}
                        >
                            <div className="text-gray-400 text-2xl mb-2">🏠</div>
                            <div className="text-white font-bold text-lg mb-2">EXIT</div>
                            <div className="text-gray-500 text-sm">Return to Main</div>
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                        </div>
                    </div>

                    {/* 터미널 스타일 상태바 */}
                    <div className="mt-12 w-full max-w-4xl">
                        <div className="bg-black/80 border border-green-500/50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-green-400 text-sm ml-4">developer@dooring:~$</div>
                            </div>
                            <div className="text-green-400 text-sm font-mono">
                                <div>Status: <span className="text-green-500">ONLINE</span></div>
                                <div>Access Level: <span className="text-yellow-500">ADMIN</span></div>
                                <div>Session: <span className="text-blue-500">ACTIVE</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
            {/* Matrix 배경 */}
            <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-10 gap-1 p-4">
                    {matrixChars.map((char, index) => (
                        <div key={index} className="text-xs animate-pulse">
                            {char}
                        </div>
                    ))}
                </div>
            </div>

            {/* 네온 그리드 배경 */}
            <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
                    {Array.from({ length: 400 }).map((_, i) => (
                        <div key={i} className="border border-green-500/20"></div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
                {/* 헤더 */}
                <div className="text-center mb-12">
                    {/* <div className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 animate-pulse">
                        {glitchText}
                    </div> */}
                    <div className="text-green-400 text-lg font-mono mb-2">
                        [SECURE TERMINAL]
                    </div>
                    <div className="text-green-500 text-sm">
                        Restricted Access - Authorized Personnel Only
                    </div>
                </div>

                {/* 터미널 스타일 로그인 폼 */}
                <div className="w-full max-w-md">
                    <div className="bg-black/80 border-2 border-green-500/50 rounded-lg p-8">
                        {/* 터미널 헤더 */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="text-green-400 text-sm ml-4">login@dooring:~$</div>
                        </div>

                        {/* 로그인 폼 */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-green-400 text-sm font-mono mb-2">
                                    PASSWORD:
                                </label>
                                <input
                                    type="password"
                                    value={devPassword}
                                    onChange={(e) => {
                                        setDevPassword(e.target.value);
                                        setError("");
                                    }}
                                    onKeyPress={handleKeyPress}
                                    className="w-full bg-black border-2 border-green-500/50 rounded px-4 py-3 text-green-400 font-mono focus:border-green-400 focus:outline-none transition-colors"
                                    placeholder="Enter access code..."
                                />
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm font-mono text-center bg-red-900/20 border border-red-500/50 rounded px-4 py-2">
                                    [ERROR] {error}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className="flex-1 bg-green-500/20 border-2 border-green-500 text-green-400 font-mono py-3 px-6 rounded hover:bg-green-500/30 hover:border-green-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "[AUTHENTICATING...]" : "[AUTHENTICATE]"}
                                </button>
                                <button
                                    onClick={() => router.back()}
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-500/20 border-2 border-gray-500 text-gray-400 font-mono py-3 px-6 rounded hover:bg-gray-500/30 hover:border-gray-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    [EXIT]
                                </button>
                            </div>
                        </div>

                        {/* 터미널 푸터 */}
                        <div className="mt-6 pt-4 border-t border-green-500/30">
                            <div className="text-green-500 text-xs font-mono">
                                <div>System: Dooring Development Terminal</div>
                                <div>Version: 2.0.24</div>
                                <div>Access Level: Restricted</div>
                                <div>Dev Account: {DEV_EMAIL}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 상태 정보 */}
                <div className="mt-12 text-center">
                    <div className="text-green-500 text-sm font-mono">
                        <div className="mb-2">[WARNING] Unauthorized access is prohibited</div>
                        <div className="text-xs text-gray-500 mb-2">
                            All activities are monitored and logged
                        </div>
                        <div className="text-xs text-yellow-500 mb-1">
                            Auto-login with developer account if not authenticated
                        </div>
                        <div className="text-xs text-blue-400">
                            Dev Account: {DEV_EMAIL}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
