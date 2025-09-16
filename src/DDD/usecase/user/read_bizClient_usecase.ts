import { BizClientRepository } from "@/DDD/repository/db/User/bizclient_repository";

export class ReadBizClientUsecase {
    constructor(private readonly bizClientRepository: BizClientRepository) { }

    async execute(id: string) {
        try {
            const response = await this.bizClientRepository.findUserById(id);
            if (!response.success) {
                return {
                    success: false,
                    data: undefined as any,
                    message: '사용자 정보 조회 실패',
                };
            }
            return {
                success: true,
                data: response.data,
                message: '사용자 정보 조회 성공',
            };
        } catch (error) {
            return {
                success: false,
                data: undefined as any,
                message: '사용자 정보 조회 실패',
            };
        }
    }
}
