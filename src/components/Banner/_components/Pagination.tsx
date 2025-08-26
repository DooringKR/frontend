import React from "react";

interface BannerPaginationProps {
    total: number;
    current: number;
}

const BannerPagination: React.FC<BannerPaginationProps> = ({ total, current }) => {
    return (
        <div style={{ display: "flex", gap: 6 }}>
            {Array.from({ length: total }).map((_, idx) =>
                idx === current ? (
                    <svg
                        key={idx}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="6"
                        viewBox="0 0 16 6"
                        fill="none"
                    >
                        <rect width="16" height="6" rx="3" fill="#030712" fillOpacity="0.4" />
                    </svg>
                ) : (
                    <svg
                        key={idx}
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                    >
                        <rect width="6" height="6" rx="3" fill="#030712" fillOpacity="0.1" />
                    </svg>
                )
            )}
        </div>
    );
};

export default BannerPagination;
