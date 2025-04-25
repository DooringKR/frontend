export const warehouseLocation = {
  lat: 37.690124,
  lon: 127.201837,
};

export const getCoordinatesFromAddress = async (address: string) => {
  const response = await fetch("/api/naver/coordinates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) throw new Error("주소 변환 실패");
  return await response.json(); // { lat, lon }
};

export const getTravelTimeInMinutes = async (
  start: { lat: number; lon: number },
  goal: { lat: number; lon: number },
): Promise<number> => {
  const res = await fetch("/api/naver/directions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start, goal }),
  });

  if (!res.ok) throw new Error("길찾기 실패");
  const data = await res.json();
  return data.minutes;
};

export const DeliverTime = async (address: string): Promise<{
  expectedArrivalMinutes: number;
  travelTime: number;
}> => {
  const goal = await getCoordinatesFromAddress(address);
  const travelTime = await getTravelTimeInMinutes(warehouseLocation, goal);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const expectedArrivalMinutes = nowMinutes + travelTime + 30;

  return { expectedArrivalMinutes, travelTime };
};
