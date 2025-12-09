import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { bookService } from "../services/book.service";
import type { IBook, IBookListFilters, IBookCategory } from "../types";

interface IPagination {
  page: number;
  pageSize: number;
  totalPage: number;
  totalItems: number;
}

const DEFAULT_FILTERS: IBookListFilters = {
  page: 1,
  pageSize: 10,
  keyword: "",
  sort: "latest",
};

export function useBooks(initialFilters?: Partial<IBookListFilters>) {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IBookCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<IBookListFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooks(filters);
      if (response.success && response.data) {
        setBooks(response.data as IBook[]);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            pageSize: response.pagination.limit,
            totalPage: response.pagination.totalPage,
            totalItems: response.pagination.totalItems || 0,
          });
        }
      } else {
        message.warning(response.message || "Không thể tải danh sách truyện.");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      message.error("Có lỗi xảy ra khi tải danh sách truyện.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await bookService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data as IBookCategory[]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const updateFilters = useCallback((newFilters: Partial<IBookListFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1, // Reset to page 1 when filters change (except page itself)
    }));
  }, []);

  const handleSearch = useCallback((keyword: string) => {
    setFilters((prev) => ({
      ...prev,
      keyword,
      page: 1,
    }));
  }, []);

  const handleSortChange = useCallback((sort: IBookListFilters["sort"]) => {
    setFilters((prev) => ({
      ...prev,
      sort,
      page: 1,
    }));
  }, []);

  const handleCategoryChange = useCallback((category: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      category,
      page: 1,
    }));
  }, []);

  const handleStatusChange = useCallback(
    (status: IBookListFilters["status"] | undefined) => {
      setFilters((prev) => ({
        ...prev,
        status,
        page: 1,
      }));
    },
    []
  );

  const handleTableChange = useCallback((page: number, pageSize: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
      pageSize,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    books,
    loading,
    categories,
    categoriesLoading,
    pagination,
    filters,
    updateFilters,
    handleSearch,
    handleSortChange,
    handleCategoryChange,
    handleStatusChange,
    handleTableChange,
    resetFilters,
    refetch: fetchBooks,
  };
}
