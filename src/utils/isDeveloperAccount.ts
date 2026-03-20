const DEVELOPER_PHONE_NUMBERS = ["01012345678"];

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function isDeveloperAccount(phoneNumber: string | undefined | null): boolean {
  if (!phoneNumber) return false;
  return DEVELOPER_PHONE_NUMBERS.includes(normalizePhone(phoneNumber));
}
