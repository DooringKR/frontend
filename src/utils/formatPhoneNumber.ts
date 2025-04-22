export function formatPhoneNumber(value: string): string {
  const numeric = value.replace(/\D/g, "");

  if (!numeric.startsWith("010")) return value;

  const trimmed = numeric.slice(0, 11);

  const part1 = trimmed.slice(0, 3);
  const part2 = trimmed.slice(3, 7);
  const part3 = trimmed.slice(7, 11);

  if (trimmed.length <= 3) return part1;
  if (trimmed.length <= 7) return `${part1}-${part2}`;
  return `${part1}-${part2}-${part3}`;
}
