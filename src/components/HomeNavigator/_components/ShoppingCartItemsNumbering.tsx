import React from "react";

interface ShoppingCartItemsNumberingProps {
    count: number;
}

const ShoppingCartItemsNumbering: React.FC<ShoppingCartItemsNumberingProps> = ({ count }) => (
    <span
        className={`bg-red-500 text-white rounded-full 
            text-[13px] font-500 w-[18px] h-[18px] 
            flex items-center justify-center text-center absolute 
            top-1 right-1`}
    >
        {count}
    </span>
);

export default ShoppingCartItemsNumbering; 