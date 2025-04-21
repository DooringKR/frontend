// baseSchema.ts
import { z } from "zod";

const baseSchema = z.object({
  user_phoneNumber: z
    .string()
    .min(12, "10~11자리 번호를 모두 입력해주세요")
    .max(13, "11자리 이하로 작성해주세요")
    .regex(/^01[016789]-\d{3,4}-\d{4}$/, "유효한 휴대폰 번호 형식이 아닙니다"),
});

export type PhoneFormData = z.infer<typeof baseSchema>;

export default baseSchema;
