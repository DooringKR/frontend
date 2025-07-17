/*
  Warnings:

  - Changed the type of `product_type` on the `CartItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_type` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_type` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DELIVERY', 'PICK_UP');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INTERIOR', 'FACTORY');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('DOOR', 'FINISH', 'CABINET', 'HARDWARE', 'ACCESSORY');

-- ① 기존 필드 임시 백업
ALTER TABLE "CartItem" RENAME COLUMN "product_type" TO "product_type_old";

-- ② 새 ENUM 타입 컬럼 추가
ALTER TABLE "CartItem" ADD COLUMN "product_type" "ProductType";

-- ③ 값 변환 입력 (매핑 필요)
UPDATE "CartItem"
SET "product_type" = 
  CASE "product_type_old"
    WHEN 'DOOR' THEN 'DOOR'::"ProductType"
    WHEN 'FINISH' THEN 'FINISH'::"ProductType"
    WHEN 'CABINET' THEN 'CABINET'::"ProductType"
    WHEN 'HARDWARE' THEN 'HARDWARE'::"ProductType"
    WHEN 'ACCESSORY' THEN 'ACCESSORY'::"ProductType"
    ELSE NULL -- 예상치 못한 값은 직접 처리
  END;

-- ④ NOT NULL 제약 복원 (모두 채워졌을 때만)
ALTER TABLE "CartItem" ALTER COLUMN "product_type" SET NOT NULL;

-- ⑤ 임시 old 컬럼 삭제
ALTER TABLE "CartItem" DROP COLUMN "product_type_old";
