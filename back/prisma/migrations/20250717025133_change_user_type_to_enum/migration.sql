-- 1. 기존 컬럼 백업
ALTER TABLE "User" RENAME COLUMN "user_type" TO "user_type_old";

-- 2. 새로운 enum 컬럼 추가
ALTER TABLE "User" ADD COLUMN "user_type" "UserType";

-- 3. 기존 텍스트를 enum 값으로 변환(매핑)할 때 explicit cast 사용
UPDATE "User"
SET "user_type" =
  CASE "user_type_old"
    WHEN 'INTERIOR' THEN 'INTERIOR'::"UserType"
    WHEN 'FACTORY' THEN 'FACTORY'::"UserType"
    -- 필요시 추가 매핑
    ELSE NULL
  END;

-- 4. (기존 데이터 전부 채워졌다는 전제하에) NOT NULL 제약 복원
ALTER TABLE "User" ALTER COLUMN "user_type" SET NOT NULL;

-- 5. 임시 old 컬럼 삭제
ALTER TABLE "User" DROP COLUMN "user_type_old";
