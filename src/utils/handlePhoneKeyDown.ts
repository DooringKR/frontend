export default function handlePhoneKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "-"]; //  뒤로가기, 삭제, 화살표, 탭, 하이픈만 허용
  const isNumber = /^[0-9]$/.test(e.key);

  if (!isNumber && !allowed.includes(e.key)) {
    e.preventDefault();
  }
}
