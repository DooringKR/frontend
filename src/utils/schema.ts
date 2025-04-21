import { z } from "zod";

const baseSchema = z.object({
  user_phoneNumber: z.number()
    .min(10, "10~11자리 번호를 모두 입력해주세요")
    .max(11, "11자리 이하로 작성해주세요"),
});

export default baseSchema;
