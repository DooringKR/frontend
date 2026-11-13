/**
 * 일반문·롱문 치수 검사(옛 useDoorValidation 2벌을 하나로) — useRequired 규칙 값을 그대로 돌려준다.
 * true = 됨, false = 비었음, 글자 = 틀림(다음을 누를 때 칸 밑에 뜬다).
 */
export function sizeRule(value: number | null, label: "가로" | "세로", max: number): boolean | string {
    if (value === null) return false;
    if (value < 1) return `${label} 길이는 최소 1mm 이상이어야 합니다.`;
    if (value > max) return `${label} 길이는 최대 ${max}mm 이하여야 합니다.`;
    return true;
}

/** 보링 위치(세로 방향) — 비운 치수는 임시 값으로 채워 순서만 본다. 개수·높이를 모르면 검사하지 않는다 */
export function boringRule(hinge: (number | null)[], boringNum: 2 | 3 | 4 | null, height: number | null): true | string {
    if (hinge.length === 0 || height === null || boringNum === null) return true;
    if (boringNum === 2) {
        if ((hinge[0] ?? 1) + (hinge[1] ?? 1) >= height) return "상단 경첩과 하단 경첩의 합이 문 높이보다 작아야 합니다.";
    } else if (boringNum === 3) {
        const first = hinge[0] ?? 1;
        const second = hinge[1] ?? first + 1;
        const third = hinge[2] ?? 1;
        if (first >= second) return "상단 경첩은 중간 경첩보다 작아야 합니다.";
        if (second + third >= height) return "중간 경첩과 하단 경첩의 합이 문 높이보다 작아야 합니다.";
    } else {
        const first = hinge[0] ?? 1;
        const fourth = hinge[3] ?? 1;
        const second = hinge[1] ?? first + 1;
        const third = hinge[2] ?? fourth + 1;
        if (first >= second) return "상단 경첩은 중상 경첩보다 작아야 합니다.";
        if (second + third >= height) return "중상 경첩과 중하 경첩의 합이 문 높이보다 작아야 합니다.";
        if (third <= fourth) return "하단 경첩은 중하 경첩보다 작아야 합니다.";
    }
    return true;
}
