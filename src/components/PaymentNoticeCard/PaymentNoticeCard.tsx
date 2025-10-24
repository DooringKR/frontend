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
                상담 후 안전한 결제 방법으로 안내해드립니다
            </div>
            <div className="text-blue-600 text-sm mt-1">
                별도 연락을 통해 결제를 진행합니다
            </div>
        </div>
    );
};

export default PaymentNoticeCard;
