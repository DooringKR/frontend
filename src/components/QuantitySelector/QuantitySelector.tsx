import MinusIcon from "public/icons/minus";
import PlusIcon from "public/icons/plus";
import TrashCan from "public/icons/trash_can";
import React from "react";

interface QuantitySelectorProps {
    trashable: boolean;
    quantity: number;
    onDecrease?: () => void;
    onIncrease?: () => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    trashable,
    quantity,
    onDecrease,
    onIncrease,
}) => {
    return (
        <div className="flex items-center bg-white">
            <button
                className="h-[40px] rounded-l-[10px] border-b border-l border-t px-2"
                style={{
                    transition: "background 0.2s",
                }}
                onMouseEnter={e =>
                    (e.currentTarget.style.background = "linear-gradient(90deg, #F3F4F6 0%, #FFF 100%)")
                }
                onMouseLeave={e => (e.currentTarget.style.background = "")}
                onClick={onDecrease}
                aria-label="수량 감소"
            >
                {trashable && quantity === 1 ? (
                    <TrashCan disabled={false} />
                ) : (
                    <MinusIcon disabled={quantity <= 0} />
                )}
            </button>
            <div className="flex h-[40px] w-[32px] items-center justify-center border-b border-t text-center text-[16px] font-500 text-gray-700">
                {quantity}
            </div>
            <button
                className="h-[40px] rounded-r-[10px] border-b border-r border-t px-2"
                style={{
                    transition: "background 0.2s",
                }}
                onMouseEnter={e =>
                    (e.currentTarget.style.background = "linear-gradient(270deg, #F3F4F6 0%, #FFF 100%)")
                }
                onMouseLeave={e => (e.currentTarget.style.background = "")}
                onClick={onIncrease}
                aria-label="수량 증가"
            >
                <PlusIcon disabled={false} />
            </button>
        </div>
    );
};

export default QuantitySelector; 