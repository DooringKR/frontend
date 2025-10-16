import { supabase } from "@/lib/supabase";

export interface WithdrawAccountResponse {
    success: boolean;
    message: string;
}

export class WithdrawAccountUsecase {
    async execute(userId: string): Promise<WithdrawAccountResponse> {
        try {
            console.log("🚨 탈퇴 시작:", userId);

            // 1. DeliveryOrder 조회
            const { data: deliveryOrders, error: deliveryError } = await supabase
                .from("DeliveryOrder")
                .select("id, order_status")
                .eq("user_id", userId)
                .in("order_status", ["주문신규", "검수완료", "결제완료"]);

            if (deliveryError) {
                console.error("배송 주문 조회 오류:", deliveryError);
                return {
                    success: false,
                    message: "주문 정보 확인 중 오류가 발생했습니다.",
                };
            }

            // 2. PickUpOrder 조회
            const { data: pickupOrders, error: pickupError } = await supabase
                .from("PickUpOrder")
                .select("id, order_status")
                .eq("user_id", userId)
                .in("order_status", ["주문신규", "검수완료", "결제완료"]);

            if (pickupError) {
                console.error("픽업 주문 조회 오류:", pickupError);
                return {
                    success: false,
                    message: "주문 정보 확인 중 오류가 발생했습니다.",
                };
            }

            // 3. 진행 중인 주문 확인
            const pendingDeliveryCount = deliveryOrders?.length || 0;
            const pendingPickupCount = pickupOrders?.length || 0;
            const totalPendingOrders = pendingDeliveryCount + pendingPickupCount;

            if (totalPendingOrders > 0) {
                console.log(`진행 중인 주문: 배송 ${pendingDeliveryCount}건, 픽업 ${pendingPickupCount}건`);
                return {
                    success: false,
                    message: `진행 중인 주문이 ${totalPendingOrders}건 있어 탈퇴할 수 없습니다.\n주문 완료 후 다시 시도해주세요.`,
                };
            }

            // 4. 장바구니 ID 가져오기
            const { data: cartData } = await supabase
                .from("Cart")
                .select("id")
                .eq("user_id", userId)
                .single();

            // 5. 장바구니 아이템 삭제
            if (cartData?.id) {
                const { error: cartItemError } = await supabase
                    .from("CartItem")
                    .delete()
                    .eq("cart_id", cartData.id);

                if (cartItemError) {
                    console.error("장바구니 아이템 삭제 실패:", cartItemError);
                } else {
                    console.log("✅ 장바구니 아이템 삭제 완료");
                }
            }

            // 6. 장바구니 삭제
            const { error: cartError } = await supabase
                .from("Cart")
                .delete()
                .eq("user_id", userId);

            if (cartError) {
                console.error("장바구니 삭제 실패:", cartError);
            } else {
                console.log("✅ 장바구니 삭제 완료");
            }

            // 7. DeliveryOrder의 user_id NULL 처리 (법적 보관 의무)
            const { error: deliveryOrderError } = await supabase
                .from("DeliveryOrder")
                .update({ user_id: null })
                .eq("user_id", userId);

            if (deliveryOrderError) {
                console.error("DeliveryOrder user_id NULL 처리 실패:", deliveryOrderError);
            } else {
                console.log("✅ DeliveryOrder user_id NULL 처리 완료");
            }

            // 8. PickUpOrder의 user_id NULL 처리 (법적 보관 의무)
            const { error: pickupOrderError } = await supabase
                .from("PickUpOrder")
                .update({ user_id: null })
                .eq("user_id", userId);

            if (pickupOrderError) {
                console.error("PickUpOrder user_id NULL 처리 실패:", pickupOrderError);
            } else {
                console.log("✅ PickUpOrder user_id NULL 처리 완료");
            }

            // 9. 사용자 정보 삭제
            const { error: bizClientError } = await supabase
                .from("BizClient")
                .delete()
                .eq("id", userId);

            if (bizClientError) {
                throw new Error(`사용자 정보 삭제 실패: ${bizClientError.message}`);
            }

            console.log("✅ 사용자 정보 삭제 완료");

            // 10. Auth 계정 삭제는 signOut으로 대체
            // admin.deleteUser는 서버 사이드에서만 가능

            console.log("✅ 탈퇴 완료:", userId);

            return {
                success: true,
                message: "회원 탈퇴가 완료되었습니다.",
            };
        } catch (error) {
            console.error("❌ 탈퇴 처리 오류:", error);
            return {
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "탈퇴 처리 중 오류가 발생했습니다.",
            };
        }
    }
}

