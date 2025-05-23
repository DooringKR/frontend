"use client";

import { checkCabinetPrice } from "@/api/checkcash";
import { CABINET_CATEGORY_LIST } from "@/constants/category";
import { CabinetRequest } from "@/types/apiType";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import SizeInput from "@/components/SIzeInput/SizeInput";

import useCabinetStore from "@/store/Items/cabinetStore";

import Drawer from "./_components/Drawer";
import Finish from "./_components/Finish";
import Flap from "./_components/HandleType/Flap";
import Lower from "./_components/HandleType/Lower";
import Open from "./_components/HandleType/Open";
import Upper from "./_components/HandleType/Upper";
import Material from "./_components/Material";
import Rail from "./_components/Rail";

function SelectPage() {
  if (typeof window === "undefined") return null;

  const searchParams = useSearchParams();
  const router = useRouter();

  const slug = searchParams.get("slug") as "lower" | "flap" | "upper" | "open";
  const color = searchParams.get("color") ?? "";

  const currentCategory = CABINET_CATEGORY_LIST.find(item => item.slug === slug);
  const header = currentCategory?.header || "부분장";

  const [handleType, setHandleType] = useState<"channel" | "outer" | "pull-down" | null>(null);
  const [compartmentCount, setCompartmentCount] = useState("");
  const [flapStayType, setFlapStayType] = useState("");
  const [material, setMaterial] = useState("");
  const [thickness, setThickness] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [finishType, setFinishType] = useState<"urahome" | "makura" | null>(null);
  const [drawerType, setDrawerType] = useState("");
  const [railType, setRailType] = useState("");
  const [cabinetRequests, setCabinetRequests] = useState<string | null>(null);

  const renderTypeComponent = () => {
    if (slug === "lower") {
      return <Lower handleType={handleType} setHandleType={setHandleType} />;
    }
    if (slug === "flap") {
      return (
        <Flap
          handleType={handleType}
          setHandleType={setHandleType}
          flapStayType={flapStayType}
          setFlapStayType={setFlapStayType}
        />
      );
    }
    if (slug === "upper") {
      return <Upper handleType={handleType} setHandleType={setHandleType} />;
    }
    if (slug === "open") {
      return <Open compartmentCount={compartmentCount} setCompartmentCount={setCompartmentCount} />;
    }
    return null;
  };

  const getInputStatusText1 = () => {
    if (slug === "open" && !handleType) return "구성 칸 수를";
    if (!handleType) return "손잡이 종류";
    if (!material) return "소재를";
    if (!thickness) return "두께를";
    if (!width) return "너비를";
    if (!height) return "깊이를";
    if (!depth) return "높이를";
    if (!finishType) return "마감 방식을";
    if (!drawerType) return "서랍 종류를";
    if (!railType) return "레일 종류를";
    if (cabinetRequests === null) return "요청 사항을";
    return "정보를";
  };

  function getInputStatusText2() {
    if (slug === "open" && !handleType) return "입력해주세요";
    if (!material) return "선택해주세요";
    if (!depth) return "입력해주세요";
    if (!railType) return "선택해주세요";
    if (cabinetRequests === null) return "입력해주세요";
    return "확인해주세요";
  }

  // const handleNext = async () => {
  //   if (!slug || !color || !width || !height) return;

  //   const payload : CabinetRequest = {
  //     category: "cabinet",
  //     slug,
  //     color,
  //     handleType,
  //     compartmentCount: Number(compartmentCount),
  //     flapStayType,
  //     material,
  //     thickness,
  //     width: Number(width),
  //     height: Number(height),
  //     depth: Number(depth),
  //     option: [],
  //     finishType,
  //     drawerType,
  //     railType,
  //     cabinetRequests: cabinetRequests ? cabinetRequests : "",
  //   }

  //   console.log("보내는 payload:", payload);

  //   try {
  //     const data = await checkCabinetPrice(payload);

  //     console.log("응답 data:", data);

  //     useCabinetStore.getState().updateItem({
  //       category: "cabinet",
  //       slug: data.slug,
  //       color: data.color,
  //       handleType: data.handleType,
  //       compartmentCount: data.compartmentCount,
  //       flapStayType: data.flapStayType,
  //       material: data.material,
  //       thickness: data.thickness,
  //       width: data.width,
  //       height: data.height,
  //       depth: data.depth,
  //       option: data.option ?? [],  // 혹시 옵션도 올 수 있다면 대비
  //       finishType: data.finishType,
  //       drawerType: data.drawerType,
  //       railType: data.railType,
  //       cabinetRequests: data.cabinetRequests,
  //       price: data.price,
  //     });

  //     router.push("/order/cabinet/confirm");
  //   } catch (err) {
  //     console.error("에러 발생:", err);
  //     alert("가격 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const handleNext = async () => {
    if (!slug || !color || !width || !height) return;

    const payload = {
      slug,
      color,
      handleType,
      compartmentCount: Number(compartmentCount),
      flapStayType,
      material,
      thickness,
      width: Number(width),
      height: Number(height),
      depth: Number(depth),
      finishType,
      drawerType,
      railType,
      cabinetRequests,
    };
    console.log(payload);

    try {
      useCabinetStore.getState().updateItem({
        category: "cabinet",
        slug,
        color,
        handleType,
        compartmentCount: Number(compartmentCount),
        flapStayType,
        material,
        thickness,
        width: Number(width),
        height: Number(height),
        depth: Number(depth),
        option: [],
        finishType,
        drawerType,
        railType,
        cabinetRequests,
        price: 10000,
      });

      router.push("/order/cabinet/confirm");
    } catch (err) {
      alert("가격 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSkipRequest = () => {
    setCabinetRequests("");
  };

  return (
    <div className="flex flex-col gap-6 p-5 pb-24">
      <h1 className="text-2xl font-bold leading-snug">
        {cabinetRequests !== null && <span>입력한 </span>}
        <span className="text-[#AD46FF]">{header}</span> {getInputStatusText1()}
        <br />
        {getInputStatusText2()}
      </h1>

      {color ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/img/Checker.png" width={35} height={35} alt={color} />
            <p className="text-base font-semibold">{color}</p>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-base font-medium text-[#3578ff]"
          >
            변경
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400">색상이 선택되지 않았습니다.</p>
      )}
      {renderTypeComponent()}
      {(handleType || compartmentCount) && (
        <Material material={material} setMaterial={setMaterial} />
      )}
      {material && (
        <SizeInput
          label="두께"
          name="thickness"
          placeholder="두께"
          value={thickness}
          onChange={setThickness}
        />
      )}
      {thickness && (
        <SizeInput
          label="너비"
          name="width"
          placeholder="너비 입력"
          value={width}
          onChange={setWidth}
        />
      )}
      {width && (
        <SizeInput
          label="깊이"
          name="depth"
          placeholder="깊이 입력"
          value={depth}
          onChange={setDepth}
        />
      )}
      {depth && (
        <SizeInput
          label="높이"
          name="height"
          placeholder="높이 입력"
          value={height}
          onChange={setHeight}
        />
      )}
      {height && <Finish finishType={finishType} setFinishType={setFinishType} />}
      {finishType && <Drawer drawerType={drawerType} setDrawerType={setDrawerType} />}
      {drawerType && <Rail railType={railType} setRailType={setRailType} />}
      {railType && (
        <>
          <Input
            label="요청사항"
            type="text"
            name="cabinetRequest"
            placeholder="요청사항을 입력해주세요"
            value={cabinetRequests ?? ""}
            onChange={e => setCabinetRequests(e.target.value)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-10 h-20 w-full bg-white">
            {cabinetRequests === null ? (
              <Button
                selected
                className="fixed bottom-[88px] left-5 right-5 mt-16 rounded-md text-white"
                onClick={handleSkipRequest}
              >
                요청사항 생략하기
              </Button>
            ) : (
              <Button
                selected
                className="fixed bottom-[88px] left-5 right-5 rounded-md text-white"
                onClick={handleNext}
              >
                확인
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SelectPage;
