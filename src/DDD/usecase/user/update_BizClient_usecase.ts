import { BizClientRepository } from "@/DDD/repository/db/User/bizclient_repository";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";

export class UpdateBizClientUsecase {
    constructor(private readonly bizClientRepository: BizClientRepository) { }

    async execute(user: Partial<BizClient>) {
        // 최소한의 검증만 수행
        if (!user) {
            throw new Error("업데이트할 사용자 정보가 없습니다.");
        }

        // repository에 모든 검증과 업데이트 로직 위임
        return this.bizClientRepository.updateUser(user);
    }
}  