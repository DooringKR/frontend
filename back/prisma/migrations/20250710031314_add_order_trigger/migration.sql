-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user_phone" VARCHAR(11) NOT NULL,
    "user_type" TEXT NOT NULL,
    "user_road_address" TEXT,
    "user_detail_address" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_type" TEXT NOT NULL,
    "item_count" INTEGER NOT NULL,
    "item_options" JSONB NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" VARCHAR(12) NOT NULL,
    "seq" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "order_type" TEXT NOT NULL,
    "recipient_phone" VARCHAR(11) NOT NULL,
    "order_price" INTEGER NOT NULL,
    "order_options" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_phone_key" ON "User"("user_phone");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_user_id_key" ON "Cart"("user_id");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ------------------------------------------------------------
-- 트리거 함수 & 트리거 생성 (PostgreSQL)
-- ------------------------------------------------------------

-- 1) 트리거 함수 정의
CREATE OR REPLACE FUNCTION public.trg_order_before_insert()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
DECLARE
  next_seq INTEGER;
BEGIN
  -- 해당 유저의 가장 큰 seq + 1 계산
  SELECT COALESCE(MAX(seq), 0) + 1
    INTO next_seq
    FROM "Order"
   WHERE user_id = NEW.user_id;

  -- NEW 레코드에 seq, order_id 설정
  NEW.seq := next_seq;
  NEW.order_id := LPAD(NEW.user_id::text, 8, '0')
                || '-'
                || LPAD(next_seq::text, 3, '0');

  RETURN NEW;
END;
$$;

-- 2) 트리거 생성
CREATE TRIGGER trg_order_before_insert
  BEFORE INSERT ON "Order"
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_order_before_insert();
