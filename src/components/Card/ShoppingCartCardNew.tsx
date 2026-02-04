"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HingeDirection } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import DoorPreviewIcon from "../DoorPreviewIcon/DoorPreviewIcon";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

// ============================================================================
// Type Definitions (Exported for use in transformers)
// ============================================================================

export type DetailProductType =
  | "일반문"
  | "플랩문"
  | "서랍 마에다"
  | "롱문"
  | "EP마감"
  | "몰딩"
  | "걸레받이"
  | "하부장"
  | "상부장"
  | "서랍장"
  | "플랩장"
  | "키큰장"
  | "오픈장"
  | "싱크볼"
  | "쿡탑"
  | "후드"
  | "경첩"
  | "레일"
  | "피스";

// 일반문 상세 정보
export interface DoorStandardDetails {
  color: string;
  width?: number;
  height?: number; // 롱문 공통 카드에서는 미표시(undefined)
  handleType?: string; // 롱문 손잡이 종류 (공통 사항)
  handleTypeDirectInput?: string; // 겉손잡이 선택 시 직접 입력
  hingeCount?: number | "모름";
  hingeDirection?: "좌경" | "우경" | "모름";
  boringDimensions?: (number | "모름")[];
  location?: string;
  doorConstruct?: boolean;
  addOnHinge?: boolean;
  hingeThickness?: string; // HingeThickness enum 값 ("15T", "18T", "모름")
  request?: string;
  images?: string[];
  is_pair_door?: boolean;
}

// 플랩문 상세 정보
export interface DoorFlapDetails {
  color: string;
  width: number;
  height: number;
  hingeCount?: number | "모름";
  boringDimensions?: (number | "모름")[];
  location?: string;
  doorConstruct?: boolean;
  addOnHinge?: boolean;
  hingeThickness?: string; // HingeThickness enum 값 ("15T", "18T", "모름")
  request?: string;
  images?: string[];
}

// 서랍 마에다 상세 정보
export interface DoorDrawerDetails {
  color: string;
  width: number;
  height: number;
  location?: string;
  doorConstruct?: boolean;
  request?: string;
  images?: string[];
}

// 마감재 상세 정보 (EP마감, 몰딩, 걸레받이)
export interface FinishDetails {
  color: string;
  width: number;
  height: number;
  widthIncrease?: number;
  heightIncrease?: number;
  edgeCount?: number;
  location?: string;
  request?: string;
  images?: string[];
}

// 부분장 공통 속성
export interface CabinetBaseDetails {
  color: string;
  width: number;
  height: number;
  depth: number;
  bodyMaterial?: string;
  handleType?: string;
  behindType?: string;
  cabinetConstruct?: boolean;
  location?: string;
  request?: string;
  images?: string[];
}

// 하부장 상세 정보
export interface CabinetLowerDetails extends CabinetBaseDetails {
  legType?: string;
}

// 상부장 상세 정보
export interface CabinetUpperDetails extends CabinetBaseDetails {
}

// 서랍장 상세 정보
export interface CabinetDrawerDetails extends CabinetBaseDetails {
  drawerType?: string;
  railType?: string;
  legType?: string;
  absorberType?: string;
}

// 플랩장 상세 정보
export interface CabinetFlapDetails extends CabinetBaseDetails {
  absorberType?: string;
}

// 키큰장 상세 정보
export interface CabinetTallDetails extends CabinetBaseDetails {
  legType?: string;
}

// 오픈장 상세 정보
export interface CabinetOpenDetails extends CabinetBaseDetails {
  addRiceCookerRail?: boolean;
  addBottomDrawer?: boolean;
}

// 부속 상세 정보
export interface AccessoryDetails {
  manufacturer?: string;
  modelName?: string;
  size?: string;
  request?: string;
  images?: string[];
}

// 하드웨어 공통 속성
export interface HardwareBaseDetails {
  manufacturer?: string;
  color?: string;
  size?: string;
  request?: string;
  images?: string[];
}

// 경첩 상세 정보
export interface HardwareHingeDetails extends HardwareBaseDetails {
  thickness?: string;
  angle?: string;
}

// 레일 상세 정보
export interface HardwareRailDetails extends HardwareBaseDetails {
  railType?: string;
  railLength?: string;
  railDamping?: boolean;
}

// 피스 상세 정보
export interface HardwarePieceDetails extends HardwareBaseDetails {
  // 피스는 color와 size만 사용
}

// 모든 Details 타입 Union
export type ProductDetails =
  | { type: "일반문"; data: DoorStandardDetails }
  | { type: "플랩문"; data: DoorFlapDetails }
  | { type: "서랍 마에다"; data: DoorDrawerDetails }
  | { type: "롱문"; data: DoorStandardDetails }
  | { type: "마감재" | "EP마감" | "몰딩" | "걸레받이"; data: FinishDetails }
  | { type: "하부장"; data: CabinetLowerDetails }
  | { type: "상부장"; data: CabinetUpperDetails }
  | { type: "서랍장"; data: CabinetDrawerDetails }
  | { type: "플랩장"; data: CabinetFlapDetails }
  | { type: "키큰장"; data: CabinetTallDetails }
  | { type: "오픈장"; data: CabinetOpenDetails }
  | { type: "싱크볼" | "쿡탑" | "후드"; data: AccessoryDetails }
  | { type: "경첩"; data: HardwareHingeDetails }
  | { type: "레일"; data: HardwareRailDetails }
  | { type: "피스"; data: HardwarePieceDetails };

// ============================================================================
// Component Props
// ============================================================================

interface ShoppingCartCardNewProps {
  // 메타 정보
  hasPreviewIcon: boolean;
  hasPrice: boolean;
  hasStepper: boolean;

  // 핵심 데이터
  detailProductType: DetailProductType;
  details: ProductDetails;
  price?: number;

  // 수량 관리
  quantity: number;
  trashable: boolean;
  onDecrease?: () => void;
  onIncrease?: () => void;
  onTrash?: () => void;
}

// ============================================================================
// Detail Renderers
// ============================================================================

const DetailRow: React.FC<{ label: string; value: string | number | boolean }> = ({ label, value }) => {
  const displayValue = typeof value === "boolean" ? (value ? "예" : "아니오") : value;
  return <div>{label} : {displayValue}</div>;
};

function renderDoorStandardDetails(data: DoorStandardDetails) {
  return (
    <>
      <DetailRow label="색상" value={data.color} />
      {data.width !== undefined && data.width !== 0 && (
        <DetailRow label="너비" value={`${data.width}mm`} />
      )}
      {data.height != null && data.height !== 0 && (
        <DetailRow label="높이" value={`${data.height}mm`} />
      )}
      {data.handleType && <DetailRow label="손잡이 종류" value={data.handleType} />}
      {data.handleTypeDirectInput && <DetailRow label="손잡이 상세" value={data.handleTypeDirectInput} />}
      {data.hingeCount && (
        <DetailRow
          label="경첩 개수"
          value={data.hingeCount === "모름" ? "모름" : `${data.hingeCount}개`}
        />
      )}
      {data.hingeDirection && !data.is_pair_door && <DetailRow label="경첩 방향" value={data.hingeDirection} />}
      {data.boringDimensions && data.boringDimensions.length > 0 && (
        <DetailRow label="보링 치수" value={data.boringDimensions.join(", ")} />
      )}
      {data.location && <DetailRow label="용도 ∙ 장소" value={data.location} />}
      {(data.addOnHinge !== undefined || data.doorConstruct !== undefined) && (() => {
        const options: string[] = [];
        if (data.addOnHinge) {
          const hingeText = data.hingeThickness
            ? `경첩도 같이 받을래요(${data.hingeThickness})`
            : "경첩도 같이 받을래요";
          options.push(hingeText);
        }
        if (data.doorConstruct) options.push("시공도 필요해요");
        return <DetailRow label="추가 선택" value={options.length > 0 ? options.join(", ") : "없음"} />;
      })()}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

function renderDoorFlapDetails(data: DoorFlapDetails) {
  return (
    <>
      <DetailRow label="색상" value={data.color} />
      <DetailRow label="너비" value={`${data.width}mm`} />
      <DetailRow label="높이" value={`${data.height}mm`} />
      {data.hingeCount && (
        <DetailRow
          label="경첩 개수"
          value={data.hingeCount === "모름" ? "모름" : `${data.hingeCount}개`}
        />
      )}
      {data.boringDimensions && data.boringDimensions.length > 0 && (
        <DetailRow label="보링 치수" value={data.boringDimensions.join(", ")} />
      )}
      {data.location && <DetailRow label="용도 ∙ 장소" value={data.location} />}
      {(data.addOnHinge !== undefined || data.doorConstruct !== undefined) && (() => {
        const options: string[] = [];
        if (data.addOnHinge) {
          const hingeText = data.hingeThickness
            ? `경첩도 같이 받을래요(${data.hingeThickness})`
            : "경첩도 같이 받을래요";
          options.push(hingeText);
        }
        if (data.doorConstruct) options.push("시공도 필요해요");
        return <DetailRow label="추가 선택" value={options.length > 0 ? options.join(", ") : "없음"} />;
      })()}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

function renderDoorDrawerDetails(data: DoorDrawerDetails) {
  return (
    <>
      <DetailRow label="색상" value={data.color} />
      <DetailRow label="너비" value={`${data.width}mm`} />
      <DetailRow label="높이" value={`${data.height}mm`} />
      {data.location && <DetailRow label="용도 ∙ 장소" value={data.location} />}
      {data.doorConstruct !== undefined && (() => {
        const options: string[] = [];
        if (data.doorConstruct) options.push("시공도 필요해요");
        return <DetailRow label="추가 선택" value={options.length > 0 ? options.join(", ") : "없음"} />;
      })()}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

function renderFinishDetails(data: FinishDetails) {
  return (
    <>
      <DetailRow label="색상" value={data.color} />
      {data.edgeCount && <DetailRow label="엣지 면 수" value={data.edgeCount} />}
      <DetailRow label="가로" value={`${data.width}mm`} />
      {data.widthIncrease && data.widthIncrease > 0 && (
        <>
          <DetailRow label="⤷ 가로 키우기" value={`${data.widthIncrease}mm`} />
          <DetailRow label="⤷ 합산 가로" value={`${data.width + data.widthIncrease}mm`} />
        </>
      )}
      <DetailRow label="높이" value={`${data.height}mm`} />
      {data.heightIncrease && data.heightIncrease > 0 && (
        <>
          <DetailRow label="⤷ 높이 키우기" value={`${data.heightIncrease}mm`} />
          <DetailRow label="⤷ 합산 높이" value={`${data.height + data.heightIncrease}mm`} />
        </>
      )}
      {data.location && <DetailRow label="용도 ∙ 장소" value={data.location} />}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

function renderCabinetDetails(data: CabinetBaseDetails & Partial<CabinetLowerDetails & CabinetDrawerDetails & CabinetFlapDetails & CabinetTallDetails & CabinetOpenDetails>) {
  return (
    <>
      <DetailRow label="색상" value={data.color} />
      {data.bodyMaterial && <DetailRow label="몸통 소재 및 두께" value={data.bodyMaterial} />}
      <DetailRow label="너비" value={`${data.width}mm`} />
      <DetailRow label="깊이" value={`${data.depth}mm`} />
      <DetailRow label="높이" value={`${data.height}mm`} />
      {data.absorberType && <DetailRow label="쇼바 종류" value={data.absorberType} />}
      {data.drawerType && <DetailRow label="서랍 종류" value={data.drawerType} />}
      {data.handleType && <DetailRow label="손잡이 종류" value={data.handleType} />}
      {data.railType && <DetailRow label="레일 종류" value={data.railType} />}
      {data.addRiceCookerRail !== undefined && (
        <DetailRow
          label="밥솥 레일 추가 여부"
          value={data.addRiceCookerRail ? "추가" : "추가 안 함"}
        />
      )}
      {data.addBottomDrawer !== undefined && (
        <DetailRow
          label="하부 서랍장 추가 여부"
          value={data.addBottomDrawer ? "추가" : "추가 안 함"}
        />
      )}
      {data.behindType && <DetailRow label="마감 방식" value={data.behindType} />}
      {data.location && <DetailRow label="용도 ∙ 장소" value={data.location} />}
      {data.cabinetConstruct !== undefined && (
        <DetailRow
          label="시공 필요 여부"
          value={data.cabinetConstruct ? "시공도 필요해요" : "필요 없어요"}
        />
      )}
      {data.legType && <DetailRow label="다리발" value={data.legType} />}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

function renderAccessoryDetails(data: AccessoryDetails) {
  return (
    <>
      {data.manufacturer && <DetailRow label="제조사" value={data.manufacturer} />}
      {data.modelName && <DetailRow label="모델명" value={data.modelName} />}
      {data.size && <DetailRow label="사이즈" value={data.size} />}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

function renderHardwareDetails(data: HardwareBaseDetails & Partial<HardwareHingeDetails & HardwareRailDetails & HardwarePieceDetails>) {
  return (
    <>
      {data.manufacturer && <DetailRow label="제조사" value={data.manufacturer} />}
      {data.color && <DetailRow label="색상" value={data.color} />}
      {data.size && <DetailRow label="사이즈" value={data.size} />}
      {data.thickness && <DetailRow label="합판 두께" value={data.thickness} />}
      {data.angle && <DetailRow label="각도" value={data.angle} />}
      {data.railType && <DetailRow label="레일 종류" value={data.railType} />}
      {data.railLength && <DetailRow label="레일 길이" value={data.railLength} />}
      {data.railDamping !== undefined && (
        <DetailRow label="레일 댐핑" value={data.railDamping ? "있음" : "없음"} />
      )}
      {data.request && <DetailRow label="제작 시 요청 사항" value={data.request} />}
    </>
  );
}

// 타입별 렌더러 맵핑
const detailRenderers: Record<DetailProductType, (details: any) => React.ReactElement> = {
  일반문: renderDoorStandardDetails,
  플랩문: renderDoorFlapDetails,
  "서랍 마에다": renderDoorDrawerDetails,
  롱문: renderDoorStandardDetails,
  EP마감: renderFinishDetails,
  몰딩: renderFinishDetails,
  걸레받이: renderFinishDetails,
  하부장: renderCabinetDetails,
  상부장: renderCabinetDetails,
  서랍장: renderCabinetDetails,
  플랩장: renderCabinetDetails,
  키큰장: renderCabinetDetails,
  오픈장: renderCabinetDetails,
  싱크볼: renderAccessoryDetails,
  쿡탑: renderAccessoryDetails,
  후드: renderAccessoryDetails,
  경첩: renderHardwareDetails,
  레일: renderHardwareDetails,
  피스: renderHardwareDetails,
};

// ============================================================================
// Main Component
// ============================================================================

const ShoppingCartCardNew: React.FC<ShoppingCartCardNewProps> = ({
  hasPreviewIcon,
  hasPrice,
  hasStepper,
  detailProductType,
  details,
  price,
  quantity,
  trashable,
  onDecrease,
  onIncrease,
  onTrash,
}) => {
  const renderDetails = detailRenderers[detailProductType];

  return (
    <div className="flex w-full flex-col gap-3 rounded-[16px] border-[1px] border-gray-200 bg-white p-[20px]">
      {/* 상품 정보 */}
      <div className="flex justify-between gap-[20px]">
        <div className="flex flex-col gap-2">
          <div className="text-[17px] font-600 text-gray-800">
            {detailProductType === "일반문" && (details.data as DoorStandardDetails).is_pair_door
              ? "일반문 (양문 세트)"
              : detailProductType}
          </div>
          <div className="flex flex-col text-[15px] font-400 text-gray-500">
            {renderDetails(details.data)}
          </div>
        </div>
        {/* 프리뷰는 경첩 개수와 방향을 모두 알 때만 표시 (입력 화면과 동일) */}
        {/* TODO: 프리뷰 이미지 임시 주석 처리 
        {hasPreviewIcon && 
         detailProductType === "일반문" && 
         (details.data as DoorStandardDetails).hingeCount &&
         (details.data as DoorStandardDetails).hingeCount !== "모름" &&
         (details.data as DoorStandardDetails).hingeDirection &&
         (details.data as DoorStandardDetails).hingeDirection !== "모름" && (
          <DoorPreviewIcon
            DoorType="일반문"
            FatOrTall={
              (details.data as DoorStandardDetails).width >
              (details.data as DoorStandardDetails).height
                ? "Fat"
                : "Tall"
            }
            BoringDirection={
              (details.data as DoorStandardDetails).hingeDirection === "우경"
                ? "right"
                : "left"
            }
            BoringNum={
              typeof (details.data as DoorStandardDetails).hingeCount === "number"
                ? ((details.data as DoorStandardDetails).hingeCount as 2 | 3 | 4)
                : 2
            }
          />
        )}
        {hasPreviewIcon && 
         detailProductType === "플랩문" && 
         (details.data as DoorFlapDetails).hingeCount &&
         (details.data as DoorFlapDetails).hingeCount !== "모름" && (
          <DoorPreviewIcon
            DoorType="플랩문"
            FatOrTall={
              (details.data as DoorFlapDetails).width > (details.data as DoorFlapDetails).height
                ? "Fat"
                : "Tall"
            }
            BoringDirection="left"
            BoringNum={
              typeof (details.data as DoorFlapDetails).hingeCount === "number"
                ? ((details.data as DoorFlapDetails).hingeCount as 2 | 3 | 4)
                : 2
            }
          />
        )}
        */}
      </div>

      {/* 총 금액 */}
      {hasPrice && price && (
        <div className="flex items-end justify-end text-[20px]/[28px] font-600 text-gray-900">
          {price.toLocaleString()}원{detailProductType !== "롱문" && <>&nbsp;<span className="text-gray-600">부터~</span></>}
        </div>
      )}

      {/* Stepper */}
      {hasStepper && (
        <div className="ml-auto flex w-fit items-center gap-3">
          <QuantitySelector
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            trashable={trashable}
            onTrash={onTrash}
          />
        </div>
      )}
    </div>
  );
};

export default ShoppingCartCardNew;
