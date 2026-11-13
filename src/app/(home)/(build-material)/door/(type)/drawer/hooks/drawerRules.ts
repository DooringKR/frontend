/** 서랍 마에다 치수 — useRequired 규칙 값. 한 변이 1221mm 이상이면 다른 변은 1220mm 까지 */
export function drawerSizeRules(width: number | null, height: number | null) {
    const w: boolean | string =
        width === null
            ? false
            : width < 1
              ? "가로 길이는 최소 1mm 이상이어야 합니다."
              : height !== null && height >= 1221 && width > 1220
                ? "세로 길이가 1221mm 이상일 때는 가로 길이가 최대 1220mm 이하여야 합니다."
                : width > 2440
                  ? "가로 길이는 최대 2440mm 이하여야 합니다."
                  : true;
    const h: boolean | string =
        height === null
            ? false
            : height < 1
              ? "세로 길이는 최소 1mm 이상이어야 합니다."
              : width !== null && width >= 1221 && height > 1220
                ? "가로 길이가 1221mm 이상일 때는 세로 길이가 최대 1220mm 이하여야 합니다."
                : height > 2440
                  ? "세로 길이는 최대 2440mm 이하여야 합니다."
                  : true;
    return { width: w, height: h };
}
