import { BusinessType } from "dooring-core-domain/dist/enums/UserEnums";

/**
 * BusinessType enum을 영어 문자열로 변환
 * @param businessType - 한글로 된 BusinessType enum 값
 * @returns 영어로 변환된 business type 문자열
 */
export function formatBusinessTypeToEnglish(businessType: string | undefined): string {
  if (!businessType) return "unknown";

  switch (businessType) {
    case BusinessType.INTERIOR:
      return "interior";
    case BusinessType.FACTORY:
      return "factory";
    case BusinessType.CONSTRUCTION:
      return "construction";
    case BusinessType.INDIVIDUAL_SALES:
      return "sinkmanager";
    case BusinessType.ETC:
      return "etc";
    default:
      return "unknown";
  }
}
