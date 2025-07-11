import { ReadonlyURLSearchParams } from "next/navigation";

export function navigateWithAllParams({
    router,
    searchParams,
    type,
    category,
    color,
    extraParams = {},
}: {
    router: any;
    searchParams: ReadonlyURLSearchParams;
    type: string;
    category?: string | null;
    color: string;
    extraParams?: Record<string, string>;
}) {
    const params = new URLSearchParams(searchParams);
    if (color) params.set("color", color);
    if (type) params.set("type", type);
    if (category) params.set("category", category ?? "");
    Object.entries(extraParams).forEach(([k, v]) => {
        if (v) params.set(k, v);
    });
    const validTypes = ["door", "cabinet", "finish"];
    if (validTypes.includes(type ?? "")) {
        router.push(`/order/${type}?${params.toString()}`);
    }
} 