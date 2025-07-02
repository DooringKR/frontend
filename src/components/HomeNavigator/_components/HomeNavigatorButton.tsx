import React from "react";
import ShoppingCartItemsNumbering from "./ShoppingCartItemsNumbering";

interface HomeNavigatorButtonProps {
    icon: React.ReactNode;
    notificationCount?: number;
    onClick?: () => void;
}

const HomeNavigatorButton: React.FC<HomeNavigatorButtonProps> = ({
    icon,
    notificationCount,
    onClick,
}) => (
    <button
        className="relative p-3 rounded-[16px] hover:bg-gray-100 flex items-center justify-center"
        onClick={onClick}
    >
        {icon}
        {notificationCount ? (
            <ShoppingCartItemsNumbering count={notificationCount} />
        ) : null}
    </button>
);

export default HomeNavigatorButton; 