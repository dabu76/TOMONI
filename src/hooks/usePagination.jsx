import { useState } from "react";

export function usePagination(data = [], itemsPerPage = 9, pageGroupSize = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const pageGroupStart = currentGroup * pageGroupSize + 1;
  const pageGroupEnd = Math.min(pageGroupStart + pageGroupSize - 1, totalPages);

  const visiblePageNumbers = [];
  for (let i = pageGroupStart; i <= pageGroupEnd; i++) {
    visiblePageNumbers.push(i);
  }

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const goToNextPageGroup = () => {
    const nextGroupPage = pageGroupEnd + 1;
    if (nextGroupPage <= totalPages) {
      setCurrentPage(nextGroupPage);
    }
  };

  const goToPrevPageGroup = () => {
    const prevGroupPage = pageGroupStart - 1;
    if (prevGroupPage >= 1) {
      setCurrentPage(prevGroupPage);
    }
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    visiblePageNumbers,
    goToPage,
    goToNextPageGroup,
    goToPrevPageGroup,
    hasPrevGroup: pageGroupStart > 1,
    hasNextGroup: pageGroupEnd < totalPages,
  };
}
