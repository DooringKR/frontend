import { DoorItem } from "@/store/Items/doorStore";

function Door({ item }: { item: DoorItem }) {
  return (
    <>
      <h2 className="mb-3 text-lg font-semibold">문짝</h2>
      <div className="flex justify-between">
        <div>
          <p>색상 : {item.color}</p>
          <p>가로 길이 : {item.width?.toLocaleString()}mm</p>
          <p>세로 길이 : {item.height?.toLocaleString()}mm</p>
          <p>경첩 개수 : {item.hinge?.hingeCount ?? "-"}</p>
          <p>경첩 방향 : {item.hinge?.hingePosition === "left" ? "좌경" : "우경"}</p>
          <p>
            보링 치수 : 상{item.hinge?.topHinge ?? "-"}
            {item.hinge?.middleHinge ? `, 중${item.hinge.middleHinge}` : ""}
            {item.hinge?.bottomHinge ? `, 하${item.hinge.bottomHinge}` : ""}
          </p>
          {item.doorRequest && <p>요청 사항 {item.doorRequest}</p>}
        </div>
      </div>
    </>
  );
}

export default Door;
