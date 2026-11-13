"use client";

import { DetailProductType } from "dooring-core-domain/dist/enums/CartAndOrderEnums";
import { CartItem } from "dooring-core-domain/dist/models/BizClientCartAndOrder/CartItem";
import { Door } from "dooring-core-domain/dist/models/InteriorMaterials/Door";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import LongDoorDoors from "@/components/Card/LongDoorDoors";
import ShoppingCartCardNew from "@/components/Card/ShoppingCartCardNew";
import BottomBar from "@/components/overlay/BottomBar";
import ConfirmSheet from "@/components/overlay/ConfirmSheet";
import PaymentNoticeCard from "@/components/PaymentNoticeCard";
import PriceSummaryCard from "@/components/PriceCheckCard/PriceSummaryCard";
import Notice from "@/components/state/Notice";
import { EmptyState, ErrorBanner, ListSkeleton } from "@/components/state/StateViews";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { ActionError, useAction } from "@/components/ui/use-action";
import { CartItemSupabaseRepository } from "@/DDD/data/db/CartNOrder/cartitem_supabase_repository";
import { ReadCartItemsUsecase } from "@/DDD/usecase/read_cart_items_usecase";
import { ReindexCartItemNickNamesUsecase } from "@/DDD/usecase/reindex_cart_item_nick_names_usecase";
import { UpdateCartItemCountUsecase } from "@/DDD/usecase/update_cart_item_count_usecase";
import { trackClick } from "@/services/analytics/amplitude";
import useCartItemStore from "@/store/cartItemStore";
import useCartStore from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { getScreenName } from "@/utils/screenName";
import { transformCartItemToNewCardProps } from "@/utils/transformers/transformCartItemToNewCardProps";

import { fetchMaterialDetail } from "./_lib/materialDetail";

/** 항목 하나의 자재 상세(카드에 그릴 것) */
type Extra = { detail: any | null; relatedDoors?: Door[] };

const byNickName = (a: CartItem, b: CartItem) => {
  const aNum = Number.parseInt(a.nick_name ?? "", 10);
  const bNum = Number.parseInt(b.nick_name ?? "", 10);
  const aValid = Number.isFinite(aNum);
  const bValid = Number.isFinite(bNum);
  if (aValid && bValid) return aNum - bNum;
  if (aValid) return -1;
  if (bValid) return 1;
  return String(a.id ?? "").localeCompare(String(b.id ?? ""));
};

const sum = (items: CartItem[]) => items.reduce((s, ci) => s + (ci.unit_price ?? 0) * (ci.item_count ?? 0), 0);

/**
 * 수량 저장 — 서버 먼저, 그다음 store(예전과 같음). 0 이면 서버가 지우고 번호(nick_name)를 다시 매긴다.
 * 실패는 던진다 — 누른 자리(카드 밑 ActionError·확인 시트 안)에 뜬다.
 */
async function saveCount(item: CartItem, newCount: number) {
  if (!item.id || newCount < 0) return;
  if (item.detail_product_type === DetailProductType.LONGDOOR && newCount > 1) throw new Error("롱문은 1회 1개 주문만 가능합니다.");
  const result = await new UpdateCartItemCountUsecase(new CartItemSupabaseRepository()).updateCount(item.id, newCount);
  const store = useCartItemStore.getState();
  if (result) return store.updateCartItem(item.id, { item_count: newCount });
  store.removeCartItem(item.id);
  const cartId = useCartStore.getState().cart?.id;
  if (!cartId) return;
  const re = await new ReindexCartItemNickNamesUsecase(new CartItemSupabaseRepository()).execute(cartId);
  if (re.success) store.setCartItems(re.data || []);
  else console.warn("Failed to reindex cart item nick_name", re.message);
}

/** 장바구니 한 줄 — 수량 바꾸기는 도는 동안 막고(useAction), 실패는 카드 밑. 빼기(휴지통·0개)는 시트로 한 번 묻는다 */
function CartRow({ item, extra }: { item: CartItem; extra: Extra }) {
  const act = useAction();
  const [asking, setAsking] = useState(false);
  const cardProps = transformCartItemToNewCardProps(item, extra.detail, extra.relatedDoors);
  if (!cardProps) return null;
  const count = item.item_count ?? 0;
  const card = (
    <ShoppingCartCardNew
      {...cardProps}
      disabled={act.busy}
      onIncrease={() => act.run(() => saveCount(item, count + 1))}
      onDecrease={() => (count <= 1 ? setAsking(true) : act.run(() => saveCount(item, count - 1)))}
      onTrash={() => setAsking(true)}
    />
  );
  return (
    <div className="flex flex-col gap-2">
      {item.detail_product_type === DetailProductType.LONGDOOR ? (
        <div className="overflow-hidden rounded-[16px] border border-gray-200 bg-white">
          {/* 카드 테두리는 바깥 상자가 그린다 */}
          <div className="[&>div]:rounded-none [&>div]:border-0">{card}</div>
          <LongDoorDoors doors={extra.relatedDoors} className="mx-5" />
        </div>
      ) : (
        card
      )}
      <ActionError error={act.error} />
      <ConfirmSheet
        open={asking}
        onOpenChange={setAsking}
        title="장바구니에서 뺄까요?"
        description={cardProps.detailProductType}
        confirmLabel="빼기"
        destructive
        onConfirm={() => saveCount(item, 0)}
      />
    </div>
  );
}

export default function CartClient() {
  const router = useRouter();
  const cartItems = useCartItemStore((s) => s.cartItems);
  // 항목 id → 자재 상세. null = 아직 안 읽음(읽기 전에 「비었어요」를 띄우지 않는다).
  // 들어올 때 한 번만 읽고, 수량이 바뀌면 store 만 바뀌어 그 줄만 다시 그린다(화면 전체를 다시 읽지 않음).
  const [extras, setExtras] = useState<Record<string, Extra> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(null);
    setExtras(null);
    try {
      const cartId = useCartStore.getState().cart?.id;
      if (!cartId) return setExtras({});
      const res = await new ReadCartItemsUsecase().readCartItemsByCartId(cartId);
      if (!res.success) throw new Error("장바구니를 불러오지 못했어요");
      const items = res.data || [];
      useCartItemStore.getState().setCartItems(items);
      const pairs = await Promise.all(
        items.filter((ci) => ci.id).map(async (ci) => [ci.id!, await fetchMaterialDetail(ci.detail_product_type, ci.item_detail)] as const),
      );
      setExtras(Object.fromEntries(pairs));
    } catch (e) {
      console.error("장바구니 읽기 실패", e);
      setLoadError("장바구니를 불러오지 못했어요");
    }
  }, []);

  useEffect(() => {
    useOrderStore.setState({ order: null });
    load();
  }, [load]);

  const handleAddProduct = () => {
    trackClick({ object_type: "button", object_name: "addanother", current_page: getScreenName(), modal_name: null });
    // 품목 메뉴는 홈에서 DIY 화면으로 옮겨졌다
    router.push("/diy");
  };

  const handleNext = () => {
    trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
    // 세트상품이 있으면 세트상품만 주문하도록 CreateOrderUsecase 에서 거른다
    router.push("/order");
  };

  const rows = extras ? cartItems.filter((ci) => ci.id && extras[ci.id]).sort(byNickName) : [];
  const setRows = rows.filter((ci) => ci.detail_product_type === DetailProductType.LONGDOOR);
  const singleRows = rows.filter((ci) => ci.detail_product_type !== DetailProductType.LONGDOOR);
  // 세트상품이 있으면 세트상품만 구매 가능
  const hasSet = setRows.length > 0;
  const total = sum(hasSet ? setRows : rows);
  const pairDoorCount = rows
    .filter((ci) => ci.detail_product_type === DetailProductType.DOOR && extras?.[ci.id!]?.detail?.is_pair_door === true)
    .reduce((s, ci) => s + (ci.item_count ?? 0), 0);

  return (
    <div className="flex min-h-screen flex-col pt-[60px]">
      <TopNavigator title="장바구니" page="/cart" />
      {loadError ? (
        <div className="p-5">
          <ErrorBanner text={loadError} onRetry={load} />
        </div>
      ) : !extras ? (
        <ListSkeleton className="p-5" />
      ) : rows.length === 0 ? (
        <EmptyState text="장바구니가 비었어요" action={{ label: "상품 추가", onClick: handleAddProduct }} className="flex-1" />
      ) : (
        <>
          <div className="flex flex-col gap-6 p-5 pb-[120px]">
            <div className="text-xl font-600">상품 {hasSet ? setRows.length : rows.length}개</div>

            {hasSet && (
              <section className="flex flex-col gap-3">
                <h2 className="text-[16px] font-600 text-gray-800">세트 상품</h2>
                {setRows.map((ci) => (
                  <CartRow key={ci.id} item={ci} extra={extras[ci.id!]} />
                ))}
              </section>
            )}

            {singleRows.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="text-[16px] font-600 text-gray-800">개별 상품</h2>
                {hasSet && <Notice tone="blue">세트상품 구매 후 개별 상품을 구매할 수 있습니다.</Notice>}
                <div className={hasSet ? "pointer-events-none flex flex-col gap-3 opacity-50" : "flex flex-col gap-3"}>
                  {singleRows.map((ci) => (
                    <CartRow key={ci.id} item={ci} extra={extras[ci.id!]} />
                  ))}
                </div>
              </section>
            )}

            <Button variant="inverse" className="w-full" onClick={handleAddProduct}>
              상품 추가
            </Button>

            <div className="flex flex-col gap-3">
              <PriceSummaryCard getTotalPrice={() => total} filteredCartItems={hasSet ? setRows : undefined} />
              {pairDoorCount > 0 && (
                <Notice tone="red">
                  양문 아이템이 {pairDoorCount}개 있어요. 문짝이 {pairDoorCount * 2}개 제작될 예정이에요.
                </Notice>
              )}
              {!hasSet && <PaymentNoticeCard />}
            </div>
          </div>

          <BottomBar
            aside={
              <div className="flex flex-col">
                <span className="text-[17px] font-600 text-gray-700">{total.toLocaleString()}원</span>
                <span className="text-[14px] text-gray-500">예상 주문금액</span>
              </div>
            }
          >
            <Button onClick={handleNext}>다음</Button>
          </BottomBar>
        </>
      )}
    </div>
  );
}
