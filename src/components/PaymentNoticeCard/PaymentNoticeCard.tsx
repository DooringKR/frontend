import React from 'react';

interface PaymentNoticeCardProps {
    className?: string;
}

const PaymentNoticeCard: React.FC<PaymentNoticeCardProps> = ({
    className = '',
}) => {

    return (
        <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
            <div className="text-blue-800 text-base font-medium">
                지금 주문해도 바로 결제되지 않아요.
            </div>
            <div className="text-blue-600 text-sm mt-1">
                담당 직원이 꼼꼼한 통화 후에 견적서를 따로 보내드려요.
            </div>
            <div className="text-blue-600 text-sm mt-1">
                결제는 견적서를 받고 진행해주세요.
            </div>
        </div>
    );
};

export default PaymentNoticeCard;
