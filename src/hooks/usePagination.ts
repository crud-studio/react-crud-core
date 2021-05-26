import {useEffect, useState} from "react";

export const usePagination = <T>(items: T[], pageSize = 50):
  [{
    pageItems: T[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
  }, (currentPage: number) => void] => {

  const [pageItems, setPageItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (items) {
      setTotalPages(Math.max(Math.ceil(items.length / pageSize), 1));
    }
  }, [items]);

  useEffect(() => {
    if (items) {
      let startIndex = (currentPage - 1) * pageSize;
      let endIndex = startIndex + pageSize;
      setPageItems(items.slice(startIndex, endIndex));
    }
  }, [items, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages]);

  return [{pageItems, currentPage, totalPages, pageSize}, setCurrentPage];
};
