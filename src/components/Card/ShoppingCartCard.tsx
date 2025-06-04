import React from "react";
import Button2 from "../Button/Button2";
import TrashCan from "public/icons/trash_can";

interface ShoppingCartCardProps {
    title: string;
    color: string;
    width: string;
    height: string;
    hingeCount: number;
    hingeDirection: string;
    boring: string;
    quantity: number;
    trashable: boolean;
    onOptionClick?: () => void;
    onDecrease?: () => void;
    onIncrease?: () => void;
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({
    title,
    color,
    width,
    height,
    hingeCount,
    hingeDirection,
    boring,
    quantity,
    trashable,
    onOptionClick,
    onDecrease,
    onIncrease,
}) => {
    return (
        <div className="bg-white border-[1px] border-gray-200 rounded-[16px] flex flex-col gap-[20px] p-[20px] w-full">
            {/* 상품 정보 */}
            <div className="flex gap-[20px] justify-between">
                <div className="flex flex-col gap-2">
                    <div className="font-600 text-gray-800 text-[17px}">{title}</div>
                    <div className="text-[15px] text-gray-500 font-400 flex flex-col">
                        <div>색상 : {color}</div>
                        <div>가로 길이 : {width}</div>
                        <div>세로 길이 : {height}</div>
                        <div>경첩 개수 : {hingeCount}개</div>
                        <div>경첩 방향 : {hingeDirection}</div>
                        <div>보링 치수 : {boring}</div>
                    </div>
                </div>
                <div className="height-[60px] width-[60px] bg-red-800">df</div>
            </div>
            {/* button section */}
            <div className="flex items-center gap-3 w-fit ml-auto">
                <Button2 type={"OutlinedMedium"} text={"옵션 변경"} />
                <QuantitySelector quantity={quantity} onDecrease={onDecrease} onIncrease={onIncrease} trashable={trashable} />
            </div>
        </div>
    );
    function QuantitySelector({ trashable, quantity, onDecrease, onIncrease }: { trashable: boolean; quantity: number; onDecrease?: () => void; onIncrease?: () => void }) {
        return (
            <div className="flex items-center">
                <button
                    className="h-[40px] px-2 border-t border-b border-l rounded-l-[10px]"
                    style={{
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #F3F4F6 0%, #FFF 100%)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                    onClick={onDecrease}
                    aria-label="수량 감소"
                >
                    {trashable && quantity === 0 ? (
                        <TrashCan disabled={false} />
                    ) : (
                        <div>-</div>
                    )}
                </button>
                <div className="h-[40px] text-center border-t border-b text-[16px] font-500 text-gray-700">
                    {quantity}
                </div>
                <button
                    className="h-[40px] px-2 border-t border-b border-r rounded-r-[10px]"
                    style={{
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #F3F4F6 0%, #FFF 100%)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                    onClick={onIncrease}
                    aria-label="수량 증가"
                >
                    <div>+</div>
                </button>
            </div>
        );
    }
};

export default ShoppingCartCard;