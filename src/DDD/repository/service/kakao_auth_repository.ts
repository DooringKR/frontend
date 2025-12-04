import { Response } from "../../data/response";

export abstract class KakaoAuthRepository {
    // abstract login(): Promise<Response>;
    abstract signup(): Promise<Response>;
    abstract getUserInfo(): Promise<Response>;
    abstract logout(): Promise<Response>;
}