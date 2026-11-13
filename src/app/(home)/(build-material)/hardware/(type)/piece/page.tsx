"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import InitAmplitude from "@/app/(client-helpers)/init-amplitude";
import Field from "@/components/form/Field";
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

/** 피스 — 색상·사이즈(필수), 요청사항. 값은 칠 때마다 itemStore 에 */
export default function PiecePage() {
	const router = useRouter();
	const item = useItemStore((s) => s.item);
	const set = useItemStore((s) => s.updateItem);
	const req = useRequired({ color: !!item?.color?.trim(), size: !!item?.size?.trim() });

	useEffect(() => {
		setScreenName("hardware_piece");
		trackView({
			object_type: "screen",
			object_name: null,
			current_screen: typeof window !== "undefined" ? window.screen_name ?? null : null,
			previous_screen: getPreviousScreenName(),
		});
	}, []);

	return (
		<div className="flex flex-col pt-[90px]">
			<InitAmplitude />
			<TopNavigator />
			<ProgressBar progress={60} />
			<Header title="피스 정보를 입력해주세요" />
			<div className="h-5" />
			<div className="flex flex-col gap-5 px-5">
				<Field label="색상" required fieldRef={req.ref("color")} error={req.error("color")}>
					<Input
						placeholder="색상을 입력해주세요"
						aria-invalid={!!req.error("color")}
						value={item?.color ?? ""}
						onChange={(e) => set({ color: e.target.value })}
					/>
				</Field>
				<Field label="사이즈" required fieldRef={req.ref("size")} error={req.error("size")}>
					<Input
						placeholder="사이즈를 입력해주세요"
						aria-invalid={!!req.error("size")}
						value={item?.size ?? ""}
						onChange={(e) => set({ size: e.target.value })}
					/>
				</Field>
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
