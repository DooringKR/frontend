export const formatDate = (dateString: string, includeTime: boolean = false) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    const baseFormat = `${year}년 ${month}월 ${day}일 (${weekday})`;

    if (!includeTime) {
        return baseFormat;
    }

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    const displayMinutes = minutes.toString().padStart(2, '0');

    return `${baseFormat} ${ampm} ${displayHours}시 ${displayMinutes}분`;
};

export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
};

export const getOrderTypeText = (type: "DELIVERY" | "PICK_UP") => {
    return type === "DELIVERY" ? "배송" : "픽업";
}; 