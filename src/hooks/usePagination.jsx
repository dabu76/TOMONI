import { useState } from "react";

export function usePagination(data = [], itemsPerPage = 4) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
  };
}
