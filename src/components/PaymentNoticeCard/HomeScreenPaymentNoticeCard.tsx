import React from 'react';

interface HomeScreenPaymentNoticeCardProps {
    className?: string;
}

const HomeScreenPaymentNoticeCard: React.FC<HomeScreenPaymentNoticeCardProps> = ({
    className = '',
}) => {

    return (
        <div className={`bg-blue-50 rounded-[16px] px-4 py-3 ${className}`}>
            <div className="flex items-center gap-2">
                <div className='p-[6px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clip-path="url(#clip0_3231_13224)">
                            <path d="M147.6 -3.59998H-62.4V27.6H147.6V-3.59998Z" stroke="#F24253" stroke-width="2" stroke-miterlimit="10" />
                            <path d="M11.9694 1.00018L3.28142 4.56778C2.90642 4.72198 2.66162 5.08738 2.66162 5.49298V10.9998H11.9694V1.00018Z" fill="#9DC8F9" />
                            <path d="M2.66162 10.9998V13.4364C2.66162 17.1894 7.56782 20.8362 11.9694 22.9998V10.9998H2.66162Z" fill="#4582ED" />
                            <path d="M11.9694 22.9998C16.371 20.8362 21.2772 17.1894 21.2772 13.4364V10.9998H11.9694V22.9998Z" fill="#72A6F7" />
                            <path d="M11.9694 1.00018V11.0004H21.2772V5.49358C21.2772 5.08798 21.0324 4.72258 20.6574 4.56838L11.9694 1.00018Z" fill="#4582ED" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3231_13224">
                                <rect width="24" height="24" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </div>
                {/* text area */}
                <div className='flex flex-col'>
                    <div className='text-[16px]/[22px] font-500 text-gray-700'>주문해도 바로 결제되지 않아요</div>
                    <div className='text-[14px]/[20px] font-400 text-blue-500'>견적서 받고 직접 송금으로 안전하게 결제해주세요.</div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreenPaymentNoticeCard;
