import {useEffect, useMemo, useState} from "react";

export const usePagination = <T>(
  items: T[],
  pageSize = 50
): [
  {
    pageItems: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
  },
  (currentPage: number) => void
] => {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = useMemo<number>(() => Math.max(Math.ceil(items.length / pageSize), 1), [items, pageSize]);

  const pageItems = useMemo<T[]>(() => {
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return [{pageItems, currentPage, totalPages, pageSize}, setCurrentPage];
};
