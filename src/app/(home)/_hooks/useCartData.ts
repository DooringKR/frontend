import { useEffect } from "react";
import { CrudCartUsecase } from "@/DDD/usecase/crud_cart_usecase";
import { CartSupabaseRepository } from "@/DDD/data/db/CartNOrder/cart_supabase_repository";
import { ReadCartItemsUsecase } from "@/DDD/usecase/read_cart_items_usecase";
import useCartStore from "@/store/cartStore";
import useCartItemStore from "@/store/cartItemStore";
import { useOrderStore } from "@/store/orderStore";
import { BizClient } from "dooring-core-domain/dist/models/User/BizClient";

export function useCartData(bizClient: BizClient | null, checkDelivery: () => Promise<void>) {
    const cart = useCartStore(state => state.cart);
    const setCartItems = useCartItemStore(state => state.setCartItems);

    // BizClient가 있을 때 데이터 로딩 및 배송 정보 확인
    useEffect(() => {
        if (bizClient) {
            console.log('✅ bizClient 존재, 데이터 로딩 시작:', bizClient.id);
            const loadData = async () => {
                try {
                    const readCartUsecase = new CrudCartUsecase(new CartSupabaseRepository());
                    const cart = await readCartUsecase.findById(bizClient.id!);

                    useCartStore.setState({ cart: cart! });
                    useOrderStore.setState({ order: null });

                    console.log('✅ 데이터 로딩 완료, 배송 정보 확인 시작');
                    await checkDelivery();
                    console.log('✅ 배송 정보 확인 완료');
                } catch (err) {
                    console.error("Error loading user data:", err);
                }
            };

            loadData();
        }
    }, [bizClient, checkDelivery]);

    // 초기 로딩 시 cartItems 로드
    useEffect(() => {
        if (cart?.id) {
            const loadCartItems = async () => {
                try {
                    const readCartItemsUsecase = new ReadCartItemsUsecase();
                    const response = await readCartItemsUsecase.readCartItemsByCartId(cart.id!);
                    if (response.success) {
                        setCartItems(response.data || []);
                        console.log('✅ cartItems 로드 완료:', response.data?.length || 0, '개');
                    }
                } catch (err) {
                    console.error("Error loading cart items:", err);
                }
            };

            loadCartItems();
        } else {
            // cart가 null이면 cartItems도 비우기
            setCartItems([]);
        }
    }, [cart?.id, setCartItems]);
}

