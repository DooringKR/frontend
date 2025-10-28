"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button/Button";

export default function DevEnvironmentPage() {
    const router = useRouter();
    const [envInfo, setEnvInfo] = useState<any>({});

    useEffect(() => {
        // 환경 정보 수집
        const info = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            protocol: window.location.protocol,
            host: window.location.host,
            pathname: window.location.pathname,
        };

        setEnvInfo(info);
    }, []);

    const copyToClipboard = () => {
        const text = JSON.stringify(envInfo, null, 2);
        navigator.clipboard.writeText(text).then(() => {
            alert("환경 정보가 클립보드에 복사되었습니다.");
        });
    };

    return (
        <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
            {/* Matrix 배경 */}
            <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-10 gap-1 p-4">
                    {Array.from({ length: 50 }).map((_, index) => (
                        <div key={index} className="text-xs animate-pulse text-green-500">
                            {Math.random() > 0.5 ? '1' : '0'}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <div className="flex items-center justify-between p-4 border-b border-green-500/50 bg-black/80">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-black font-bold text-sm">D</span>
                        </div>
                        <h1 className="text-xl font-bold text-green-400 font-mono">SYSTEM ENVIRONMENT</h1>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-500/20 border-2 border-gray-500 text-gray-400 font-mono py-2 px-4 rounded hover:bg-gray-500/30 hover:border-gray-400 transition-all duration-300"
                    >
                        [BACK]
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-black/80 border-2 border-green-500/50 rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-green-400 font-mono">[SYSTEM DATA]</h2>
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-green-500/20 border-2 border-green-500 text-green-400 font-mono py-2 px-4 rounded hover:bg-green-500/30 hover:border-green-400 transition-all duration-300"
                                >
                                    [COPY]
                                </button>
                            </div>
                            <pre className="text-sm text-green-300 overflow-x-auto bg-black/50 p-4 rounded border border-green-500/30">
                                {JSON.stringify(envInfo, null, 2)}
                            </pre>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black/50 border-2 border-green-500/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-green-400 mb-4 font-mono">[DISPLAY INFO]</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-500">Screen Size:</span>
                                        <span className="text-white font-mono">{envInfo.screenWidth} x {envInfo.screenHeight}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-500">Window Size:</span>
                                        <span className="text-white font-mono">{envInfo.windowWidth} x {envInfo.windowHeight}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-500">Color Depth:</span>
                                        <span className="text-white font-mono">{envInfo.colorDepth}bit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 border-2 border-blue-500/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-blue-400 mb-4 font-mono">[NETWORK INFO]</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-blue-500">Status:</span>
                                        <span className={`font-mono ${envInfo.onLine ? 'text-green-400' : 'text-red-400'}`}>
                                            {envInfo.onLine ? 'ONLINE' : 'OFFLINE'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-500">Protocol:</span>
                                        <span className="text-white font-mono">{envInfo.protocol}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-500">Host:</span>
                                        <span className="text-white font-mono">{envInfo.host}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 border-2 border-purple-500/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-purple-400 mb-4 font-mono">[SYSTEM INFO]</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-purple-500">Platform:</span>
                                        <span className="text-white font-mono">{envInfo.platform}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-500">Language:</span>
                                        <span className="text-white font-mono">{envInfo.language}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-purple-500">Timezone:</span>
                                        <span className="text-white font-mono">{envInfo.timezone}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/50 border-2 border-yellow-500/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-yellow-400 mb-4 font-mono">[PAGE INFO]</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-yellow-500">Current URL:</span>
                                        <span className="text-white text-xs break-all font-mono">{envInfo.url}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-yellow-500">Path:</span>
                                        <span className="text-white font-mono">{envInfo.pathname}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-yellow-500">Referrer:</span>
                                        <span className="text-white text-xs break-all font-mono">{envInfo.referrer || 'NONE'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
