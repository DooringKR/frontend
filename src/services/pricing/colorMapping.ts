// 색상명을 견적용 색상명으로 변환 (추출 + 정규화 통합)
export function getPricingColorName(fullName: string): string {
  // 헤링본 색상들의 특별 처리
  if (fullName === "PB,, 18T, 헤링본") {
    return "헤링본 18T";
  }
  if (fullName === "PB,, 15T, 헤링본") {
    return "헤링본 15T";
  }
  if (fullName === "PB, 동화, 3T 우라, 헤링본") {
    return "헤링본 3T 우라";
  }
  if (fullName === "PB,, 15T, 헤링본 - 미백색") {
    return "헤링본 미백색";
  }

  if (fullName === "유리문") {
    return "유리문";
  }

  if (fullName === "거울문") {
    return "거울문";
  }

  // 일반적인 색상명 처리
  const parts = fullName.split(", ");
  const colorName = parts[parts.length - 1];

  const colorMap: Record<string, string> = {
    // 문짝/부분장 색상들
    // 필름부착용합판: "필름부착용합판",
    크림화이트: "한솔크림화이트",
    퍼펙트화이트: "한솔퍼펙트화이트",
    새틴베이지: "한솔새틴베이지",
    코튼블루: "한솔코튼블루",
    도브화이트: "한솔도브화이트",
    포그그레이: "한솔포그그레이",
    샌드그레이: "한솔샌드그레이",
    테네시월넛: "한솔테네시월넛",
    베이내츄럴오크: "한솔베이내츄럴오크",
    내츄럴크랙오크: "한솔내츄럴크랙오크",
    칼프브라운: "한솔칼프브라운우드",
    콘크리트샌드: "한솔콘크리트샌드",
    콘크리트화이트: "한솔콘크리트화이트",
    밀크화이트: "동화밀크화이트",
    카본그레이: "동화카본그레이",
    파타고니아크림: "한솔파타고니아크림",
  };

  return colorMap[colorName] || colorName;
}
