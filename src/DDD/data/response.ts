export interface Response<T = any> {
	success: boolean; // 성공/실패 여부
	message: string; // 디버깅 메시지
	data?: T; // 반환값 (object)
}