"use client";

import { HardwareMadeBy, RailLength, RailType } from "dooring-core-domain/dist/enums/InteriorMateralsEnums";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Choose from "@/components/form/Choose";
import Field from "@/components/form/Field";
import NumberInput from "@/components/form/NumberInput";
import { useRequired } from "@/components/form/useRequired";
import Header from "@/components/Header/Header";
import BottomBar from "@/components/overlay/BottomBar";
import ProgressBar from "@/components/Progress";
import TopNavigator from "@/components/TopNavigator/TopNavigator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackClick, trackView } from "@/services/analytics/amplitude";
import useItemStore from "@/store/itemStore";
import { getPreviousScreenName, getScreenName, setScreenName } from "@/utils/screenName";

const MADEBY = [
	{ value: HardwareMadeBy.MOONJOO, label: "국산 (문주)", description: "+ 1,500원" },
	{ value: HardwareMadeBy.HAFFLE, label: "헤펠레 (Haffle)", description: "+ 2,500원" },
	{ value: HardwareMadeBy.BLUM, label: "블룸 (Blum)", description: "+ 10,500원" },
	{ value: HardwareMadeBy.DIRECT_INPUT, label: "직접 입력" },
];
const opts = <V extends string>(e: Record<string, V>) => Object.values(e).map((v) => ({ value: v, label: v }));
const hasLength = (t: string | null) => t === RailType.BALL || t === RailType.UNDER || t === RailType.DIRECT_INPUT;

/** 레일 — 제조사·종류·길이(볼·언더·직접 입력일 때)·댐핑(볼레일일 때), 요청사항. 값은 고르는 즉시 itemStore 에 */
export default function RailPage() {
	const router = useRouter();
	const item = useItemStore((s) => s.item);
	const set = useItemStore((s) => s.updateItem);
	const madeby = item?.madeby || null;
	const railType = item?.railType || null;
	const railLength = item?.railLength || null;
	const damping = item?.railDamping === true ? "yes" : item?.railDamping === false ? "no" : null;
	const req = useRequired({
		madeby: !!madeby && (madeby !== HardwareMadeBy.DIRECT_INPUT || !!item?.madebyInput?.trim() || "제조사를 입력해주세요"),
		railType: !!railType && (railType !== RailType.DIRECT_INPUT || !!item?.railTypeInput?.trim() || "레일 종류를 입력해주세요"),
		// 길이 칸이 보이면 필수(예전엔 직접 입력 종류일 때 * 만 붙고 검사가 없었다)
		railLength: !hasLength(railType) || (!!railLength && (railLength !== RailLength.DIRECT_INPUT || !!item?.railLengthInput || "길이를 입력해주세요")),
	});

	useEffect(() => {
		setScreenName("hardware_rail");
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
			previous_screen: getPreviousScreenName(),
		});
	}, []);

	// 종류를 바꾸면 그 종류에 없는 길이·댐핑을 지운다(예전 effect 와 같은 값)
	const pickType = (t: RailType) =>
		set({
			railType: t,
			railTypeInput: t === RailType.DIRECT_INPUT ? item?.railTypeInput ?? "" : "",
			...(t === RailType.BALL || t === RailType.UNDER ? {} : { railLength: "", railLengthInput: "" }),
			...(t === RailType.BALL ? {} : { railDamping: "" }),
		});

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={60} />
			<Header title="레일 정보를 입력해주세요" />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				<Field label="제조사" required fieldRef={req.ref("madeby")} error={req.error("madeby")}>
					<Choose<HardwareMadeBy>
						aria-label="제조사"
						value={madeby}
						onChange={(v) => set({ madeby: v, madebyInput: v === HardwareMadeBy.DIRECT_INPUT ? item?.madebyInput ?? "" : "" })}
						options={MADEBY}
					/>
					{madeby === HardwareMadeBy.DIRECT_INPUT && (
						<Input
							placeholder="제조사 직접 입력"
							aria-invalid={!!req.error("madeby")}
							value={item?.madebyInput ?? ""}
							onChange={(e) => set({ madebyInput: e.target.value })}
						/>
					)}
				</Field>
				<Field label="레일 종류" required fieldRef={req.ref("railType")} error={req.error("railType")}>
					<Choose<RailType> aria-label="레일 종류" value={railType} onChange={pickType} options={opts(RailType)} />
					{railType === RailType.DIRECT_INPUT && (
						<Input
							placeholder="레일 종류 직접 입력"
							aria-invalid={!!req.error("railType")}
							value={item?.railTypeInput ?? ""}
							onChange={(e) => set({ railTypeInput: e.target.value })}
						/>
					)}
				</Field>
				{hasLength(railType) && (
					<Field label="레일 길이" required fieldRef={req.ref("railLength")} error={req.error("railLength")}>
						<Choose<RailLength>
							aria-label="레일 길이"
							value={railLength}
							onChange={(v) => set({ railLength: v, railLengthInput: v === RailLength.DIRECT_INPUT ? item?.railLengthInput ?? "" : "" })}
							options={opts(RailLength)}
						/>
						{railLength === RailLength.DIRECT_INPUT && (
							<NumberInput
								unit="mm"
								placeholder="길이 직접 입력"
								aria-invalid={!!req.error("railLength")}
								value={item?.railLengthInput ?? ""}
								onChange={(v) => set({ railLengthInput: v })}
							/>
						)}
					</Field>
				)}
				{railType === RailType.BALL && (
					<Field label="댐핑 여부">
						<Choose
							aria-label="댐핑 여부"
							value={damping}
							onChange={(v) => set({ railDamping: v === "yes" })}
							options={[
								{ value: "yes", label: "댐핑 O" },
								{ value: "no", label: "댐핑 X" },
							]}
						/>
					</Field>
				)}
				<Field label="제작 시 요청사항">
					<Input placeholder="제작 시 요청사항을 입력해주세요" value={item?.request ?? ""} onChange={(e) => set({ request: e.target.value })} />
				</Field>
			</div>
			<div className="h-[100px]" />
			<BottomBar>
				<Button
					onClick={() => {
						if (!req.check()) return;
						trackClick({ object_type: "button", object_name: "confirm", current_page: getScreenName(), modal_name: null });
						router.push("/hardware/report");
					}}
				>
					다음
				</Button>
			</BottomBar>
		</div>
	);
}
