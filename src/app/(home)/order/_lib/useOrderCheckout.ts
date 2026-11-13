"use client";

import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import type { BizClient } from "dooring-core-domain/dist/models/User/BizClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { clearUrgent, withUrgentMemo } from "@/app/(home)/request/_lib/diy";
import { useAction } from "@/components/ui/use-action";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { OrderSupabaseRepository } from "@/DDD/data/db/CartNOrder/order_supabase_repository";
import { OrderItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/orderitem_supabase_repository";
import { EstimateExportEdgeFunctionAdapter } from "@/DDD/data/service/estimate_export_edge_function_adapter";
import { CreateOrderUsecase } from "@/DDD/usecase/create_order_usecase";
import { CrudCartItemUsecase } from "@/DDD/usecase/crud_cart_item_usecase";
import { GenerateOrderEstimateUseCase } from "@/DDD/usecase/generate_order_estimate_usecase";
import { goAfterSubmit } from "@/lib/nav/go";
import { trackPurchase } from "@/services/analytics/amplitude";
import useBizClientStore from "@/store/bizClientStore";
import useCartItemStore from "@/store/cartItemStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { sortDetailProductTypes, sortProductTypes } from "@/utils/formatCartProductTypes";
import {
  getDetailProductTypesFromCartItems,
  getProductTypesFromCartItems,
  getTotalQuantityFromCartItems,
  getTotalValueFromCartItems,
} from "@/utils/getCartProductTypes";

import { DELIVERY_KEYS, PICKUP_KEYS } from "./order";

const FAIL = "주문 처리 중 오류가 발생했습니다.";

/**
 * 배송·픽업 주문하기 — 두 화면에 복사돼 있던 주문 코드를 하나로(업무 동작은 그대로).
 * 세트상품(롱문)이 있으면 세트상품만 주문한다. 성공하면 완료 화면으로 replace.
 * init: 화면에 들어올 때 store 에 넣을 그 방법만의 기본값(주문자·금액은 여기서 넣는다).
 */
export function useOrderCheckout(
  kind: "delivery" | "pickup",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- orderStore.order 가 any
  init?: (current: Record<string, any> | null, user: BizClient) => Record<string, unknown>,
) {
  const router = useRouter();
  const user = useBizClientStore((s) => s.bizClient);
  const order = useOrderStore((s) => s.order);
  const updateOrder = useOrderStore((s) => s.updateOrder);
  const cart = useCartStore((s) => s.cart);
  const decrementCartCount = useCartStore((s) => s.decrementCartCount);
  const cartItems = useCartItemStore((s) => s.cartItems);
  const clearCartItems = useCartItemStore((s) => s.clearCartItems);
  const removeCartItem = useCartItemStore((s) => s.removeCartItem);
  const getTotalPrice = useCartItemStore((s) => s.getTotalPrice);
  const act = useAction({ holdOnSuccess: true });

  const setProducts = cartItems.filter((item) => item.detail_product_type === DetailProductType.LONGDOOR);
  const hasSetProducts = setProducts.length > 0;
  const orderedItems = hasSetProducts ? setProducts : cartItems;
  // 예상 주문금액: 세트상품이 있으면 세트상품만, 없으면 전체
  const expectedPrice = () =>
    hasSetProducts ? setProducts.reduce((sum, item) => sum + (item.unit_price ?? 0) * (item.item_count ?? 0), 0) : getTotalPrice();

  // 화면 진입 시 주문 기본값(로그인 정보가 아직 없으면 넣지 않는다 — 주문하기에서 로그인으로 보낸다)
  useEffect(() => {
    if (!user) return;
    localStorage.removeItem("recentOrder"); // 새 주문 시작 — 직전 주문 정보 삭제
    const current = useOrderStore.getState().order;
    updateOrder({
      // 다른 방법의 칸은 비운다 — 주문 테이블을 delivery_arrival_time 유무로 고르므로(undefined 는 저장·전송에서 빠진다)
      ...Object.fromEntries((kind === "delivery" ? PICKUP_KEYS : DELIVERY_KEYS).map((k) => [k, undefined])),
      user_id: user.id,
      recipient_phone: current?.recipient_phone || user.phone_number,
      order_price: expectedPrice(),
      ...init?.(current, user),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cartItems, updateOrder]);

  const submit = () =>
    act.run(async () => {
      if (!user) {
        router.push("/start");
        return;
      }
      if (!cart?.id) throw new Error("장바구니를 찾을 수 없어요. 장바구니에서 다시 주문해 주세요.");

      // 1. 주문 생성
      const orderRepo = new OrderSupabaseRepository();
      const createOrder = new CreateOrderUsecase(
        orderRepo,
        new OrderItemSupabaseRepository(),
        new CartItemSupabaseRepository(),
        new GenerateOrderEstimateUseCase(orderRepo, new EstimateExportEdgeFunctionAdapter()),
      );
      const response = await createOrder.execute(withUrgentMemo(order), cart.id).catch((e) => {
        console.error("주문 처리 중 오류 발생:", e);
        throw new Error(FAIL);
      });
      if (!response.success) throw new Error(response.message || FAIL);
      clearUrgent();

      // 2. DB에서 장바구니 아이템 삭제 (세트상품이 있으면 세트상품만)
      const deleted = await Promise.all(
        orderedItems.map((item) =>
          item.id
            ? new CrudCartItemUsecase(new CartItemSupabaseRepository())
                .delete(item.id)
                .then(() => true)
                .catch((err) => {
                  console.error(`CartItem 삭제 실패: ${item.id}`, err);
                  return false;
                })
            : true,
        ),
      );
      if (!deleted.every(Boolean)) console.warn("일부 장바구니 항목 삭제에 실패했습니다.");

      // 3. Purchase 이벤트 (실패해도 주문 처리에는 영향 없음)
      try {
        const revenueProduct = getTotalValueFromCartItems(cartItems);
        const t = new Date((kind === "delivery" ? order?.delivery_arrival_time : order?.pickup_time) ?? Date.now());
        const todayDelivery = kind === "delivery" && order?.is_today_delivery; // 오늘배송이면 18시 0분 고정
        await trackPurchase({
          product_type: sortProductTypes(getProductTypesFromCartItems(cartItems)),
          detail_product_type: sortDetailProductTypes(await getDetailProductTypesFromCartItems(cartItems)),
          quantity_total: getTotalQuantityFromCartItems(cartItems),
          quantity_type: cartItems.length,
          revenue_total: revenueProduct,
          revenue_product: revenueProduct,
          revenue_shipping: 0,
          coupon: false,
          discount_total: 0,
          reward_point: 0,
          shipping_method: kind === "delivery" ? "배송" : "픽업",
          shipping_year: t.getFullYear(),
          shipping_month: t.getMonth() + 1,
          shipping_day: t.getDate(),
          shipping_hour: todayDelivery ? 18 : t.getHours(),
          shipping_minute: todayDelivery ? 0 : t.getMinutes(),
        });
      } catch (error) {
        console.error("Purchase 이벤트 전송 실패:", error);
      }

      // 4. 완료 화면용 주문 정보 (스토어 + localStorage, 완료 화면은 스토어 먼저 읽음)
      const payload = { order_id: response.data?.id, order, cartItems: orderedItems };
      localStorage.setItem("recentOrder", JSON.stringify(payload));
      useOrderStore.getState().setRecentOrderForConfirm(payload);

      // 5. 장바구니 개수·store 정리 (세트상품이 있으면 세트상품만 뺀다)
      const deletedCount = orderedItems.reduce((sum, item) => sum + (item.item_count ?? 0), 0);
      if (deletedCount > 0) decrementCartCount(deletedCount);
      if (hasSetProducts) orderedItems.forEach((item) => item.id && removeCartItem(item.id));
      else clearCartItems();
      useOrderStore.getState().clearOrder();

      goAfterSubmit(router, `/order/${kind}/confirm`);
    });

  return { order, updateOrder, hasSetProducts, setProducts, expectedPrice, act, submit };
}
