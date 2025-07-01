import React, { useEffect, useRef, useState } from "react";

// HEX → RGB 변환
function hexToRgb(hex: string): [number, number, number] {
    const n = hex.replace("#", "");
    return [
        parseInt(n.substring(0, 2), 16),
        parseInt(n.substring(2, 4), 16),
        parseInt(n.substring(4, 6), 16),
    ];
}

// RGB → HEX 변환
function rgbToHex([r, g, b]: number[]) {
    return (
        "#" +
        [r, g, b]
            .map((x) => {
                const hex = x.toString(16);
                return hex.length === 1 ? "0" + hex : hex;
            })
            .join("")
    );
}

// 두 색상 사이 보간
function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
    return [
        Math.round(a[0] + (b[0] - a[0]) * t),
        Math.round(a[1] + (b[1] - a[1]) * t),
        Math.round(a[2] + (b[2] - a[2]) * t),
    ];
}

// keyframes 정의
const keyframes = [
    { stop: 0, color: "#44BE83" },   // 초록
    { stop: 0.33, color: "#4287f5" },// 파랑
    { stop: 0.66, color: "#f5e642" },// 노랑
    { stop: 1, color: "#44BE83" },   // 다시 초록
];

const duration = 2000; // ms

const GradientText: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [color, setColor] = useState<string>(keyframes[0].color);
    const frame = useRef<number | null>(null);

    useEffect(() => {
        let stopped = false;
        function startAnim() {
            const start = performance.now();
            function animate(now: number) {
                if (stopped) return;
                const elapsed = Math.min(now - start, duration);
                const t = elapsed / duration;

                // 현재 구간 찾기
                let i = 0;
                while (i < keyframes.length - 1 && t > keyframes[i + 1].stop) i++;
                const kfA = keyframes[i];
                const kfB = keyframes[i + 1] || keyframes[i];

                // 구간 내에서의 t
                const stopDiff = kfB.stop - kfA.stop;
                const localT = stopDiff === 0 ? 0 : (t - kfA.stop) / stopDiff;

                // 색상 보간
                const rgbA = hexToRgb(kfA.color);
                const rgbB = hexToRgb(kfB.color);
                const rgb = lerpColor(rgbA, rgbB, localT);
                setColor(rgbToHex(rgb));

                if (elapsed < duration) {
                    frame.current = requestAnimationFrame(animate);
                } else {
                    setColor(keyframes[keyframes.length - 1].color);
                    // 무한 루프: 다시 시작
                    frame.current = requestAnimationFrame(() => startAnim());
                }
            }
            frame.current = requestAnimationFrame(animate);
        }
        startAnim();
        return () => {
            stopped = true;
            if (frame.current) cancelAnimationFrame(frame.current);
        };
    }, []);

    return (
        <span style={{ color, transition: "color 0.1s linear" }}>{children}</span>
    );
};

export default GradientText; 