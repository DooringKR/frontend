import { Badge } from "@/components/ui/badge";

interface ContactStatusChipProps {
  isContactAvailable: boolean;
}

export default function ContactStatusChip({ isContactAvailable }: ContactStatusChipProps) {
  return <Badge color={isContactAvailable ? "blue" : "yellow"}>{isContactAvailable ? "바로 연결" : "연결 느림"}</Badge>;
}
