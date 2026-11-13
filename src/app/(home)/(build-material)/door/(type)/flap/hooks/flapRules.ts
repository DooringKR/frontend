/** 플랩문 보링 위치(가로 방향) — useRequired 규칙 값. 비운 치수는 임시 값으로 채워 순서만 본다 */
export function flapBoringRule(hinge: (number | null)[], boringNum: 2 | 3 | 4 | null, width: number | null): true | string {
    if (boringNum === null || hinge.length === 0 || width === null) return true;
    if (boringNum === 2) {
        if ((hinge[0] ?? 1) + (hinge[1] ?? 1) >= width) return "좌측 경첩과 우측 경첩의 합이 문 너비보다 작아야 합니다.";
    } else if (boringNum === 3) {
        const first = hinge[0] ?? 1;
        const second = hinge[1] ?? first + 1;
        const third = hinge[2] ?? 1;
        if (first >= second) return "좌측 경첩은 중간 경첩보다 작아야 합니다.";
        if (second + third >= width) return "중간 경첩과 우측 경첩의 합이 문 너비보다 작아야 합니다.";
    } else {
        const first = hinge[0] ?? 1;
        const fourth = hinge[3] ?? 1;
        const second = hinge[1] ?? first + 1;
        const third = hinge[2] ?? fourth + 1;
        if (first >= second) return "좌측 경첩은 중좌 경첩보다 작아야 합니다.";
        if (second + third >= width) return "중좌 경첩과 중우 경첩의 합이 문 너비보다 작아야 합니다.";
        if (third <= fourth) return "우측 경첩은 중우 경첩보다 작아야 합니다.";
    }
    return true;
}
