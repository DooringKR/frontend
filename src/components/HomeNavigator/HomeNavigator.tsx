import React from "react";
import HomeNavigatorButton from "./_components/HomeNavigatorButton";
import CartIcon from "./icons/CartIcon";
import UserIcon from "./icons/UserIcon";

const HomeNavigator: React.FC = () => (
    <div className="w-full h-[60px] flex flex-row gap-5 pl-5 pr-2 justify-between items-center">
        <span className="text-[20px] font-700">바로가구</span>
        <div className="flex flex-row">
            <HomeNavigatorButton icon={<CartIcon />} notificationCount={1} />
            <HomeNavigatorButton icon={<UserIcon />} />
        </div>
    </div>
);

export default HomeNavigator; 