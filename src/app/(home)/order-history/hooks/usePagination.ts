import { useState } from "react";

export const usePagination = (totalItems: number, itemsPerPage: number) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // 페이지 변경 시 스크롤을 맨 위로
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        currentPage,
        totalPages,
        startIndex,
        endIndex,
        handlePageChange,
    };
}; 