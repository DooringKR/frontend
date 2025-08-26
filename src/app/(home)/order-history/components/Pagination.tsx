interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 이전 페이지 버튼
    if (currentPage > 1) {
        pages.push(
            <button
                key="prev"
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-2 text-sm border rounded-l-lg hover:bg-gray-50"
            >
                이전
            </button>
        );
    }

    // 페이지 번호들
    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-3 py-2 text-sm border-t border-b ${i === currentPage
                    ? "bg-blue-500 text-white border-blue-500"
                    : "hover:bg-gray-50"
                    } ${i === startPage ? "border-l rounded-l-lg" : ""} ${i === endPage ? "border-r rounded-r-lg" : ""
                    }`}
            >
                {i}
            </button>
        );
    }

    // 다음 페이지 버튼
    if (currentPage < totalPages) {
        pages.push(
            <button
                key="next"
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-2 text-sm border rounded-r-lg hover:bg-gray-50"
            >
                다음
            </button>
        );
    }

    return (
        <div className="flex justify-center items-center space-x-1 mt-6">
            {pages}
        </div>
    );
}; 