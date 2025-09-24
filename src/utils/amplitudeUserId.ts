// Amplitude user_id 변환 헬퍼
export function toAmplitudeUserId(userId: number | string | null | undefined): string | undefined {
  if (userId === null || userId === undefined) return undefined;
  const str = String(userId);
  return `user_${str}`;
}
