export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 (${weekday})`;
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
};

export const getOrderTypeText = (type: "DELIVERY" | "PICK_UP") => {
    return type === "DELIVERY" ? "배송" : "픽업";
}; 