'use client';

import BottomButton from "@/components/BottomButton/BottomButton";
import Button2 from "@/components/Button/Button2";
import ShoppingCartCard from "@/components/Card/ShoppingCartCard";
import Header1 from "@/components/Header/Header_1";
import BoxedInput from "@/components/Input/BoxedInput";
import TopNavigator from "@/components/TopNavigator/TopNavigator";


function ShoppingCartPage() {
  return (
    <div>
      <TopNavigator title="장바구니" />
      <ProductInfo />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px]">
        <BottomButton type="1button" button1Text="다음" button1Type="Brand" />
      </div>
    </div>
  );
}

function ProductInfo() {
  return (
    <div className="flex flex-col p-5 gap-3">
      <div>상품 1개</div>
      <ShoppingCartCard
        trashable={true}
        title={"일반문"} color={"한솔크림화이트"}
        width={"1800"} height={"1800"}
        hingeCount={3} hingeDirection={"우경"}
        boring={"상 40 하 100"} quantity={0} />
      <Button2 type={"BrandInverse"} text={"상품 추가"} />
    </div>

  );
}

export default ShoppingCartPage
