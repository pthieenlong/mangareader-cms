import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { useRef } from "react";
import { categoryService } from "../services/category.service";
import type { CategoryQueryParams, ICategory } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const queryRef = useRef<CategoryQueryParams>({});

  const fetchCategories = useCallback(async (params?: CategoryQueryParams) => {
    setLoading(true);
    setError(null);
    const nextParams: CategoryQueryParams = {
      ...queryRef.current,
      ...(params ?? {}),
    };
    if (nextParams.keyword === "") {
      delete nextParams.keyword;
    }
    queryRef.current = nextParams;
    try {
      const response = await categoryService.getCategories(nextParams);
      if (response.success && response.data) {
        setCategories(response.data as ICategory[]);
        return response.data as ICategory[];
      }
      const errorMessage =
        response.message || "Không thể tải danh mục, vui lòng thử lại.";
      message.warning(errorMessage);
      const fetchError = new Error(errorMessage);
      setError(fetchError);
      throw fetchError;
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải danh mục.";
      message.error(errorMessage);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (
      slug: string,
      payload: {
        description?: string;
        thumbnail?: File;
      }
    ) => {
      try {
        const response = await categoryService.updateCategory(slug, payload);
        if (response.success) {
          message.success("Cập nhật danh mục thành công!");
          await fetchCategories();
          return response.data;
        } else {
          const errorMessage =
            response.message ||
            "Không thể cập nhật danh mục, vui lòng thử lại.";
          message.error(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          (err as Error).message || "Có lỗi xảy ra khi cập nhật danh mục.";
        message.error(errorMessage);
        throw err;
      }
    },
    [fetchCategories]
  );

  const deleteCategory = useCallback(
    async (slug: string) => {
      try {
        const response = await categoryService.unactiveCategory(slug);
        if (response.success) {
          message.success("Vô hiệu hóa danh mục thành công!");
          await fetchCategories();
          return response.data;
        } else {
          const errorMessage =
            response.message ||
            "Không thể vô hiệu hóa danh mục, vui lòng thử lại.";
          message.error(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          (err as Error).message || "Có lỗi xảy ra khi vô hiệu hóa danh mục.";
        message.error(errorMessage);
        throw err;
      }
    },
    [fetchCategories]
  );

  const activeCategory = useCallback(
    async (slug: string) => {
      try {
        const response = await categoryService.activeCategory(slug);
        if (response.success) {
          message.success("Kích hoạt danh mục thành công!");
          await fetchCategories();
          return response.data;
        } else {
          const errorMessage =
            response.message ||
            "Không thể kích hoạt danh mục, vui lòng thử lại.";
          message.error(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const errorMessage =
          (err as Error).message || "Có lỗi xảy ra khi kích hoạt danh mục.";
        message.error(errorMessage);
        throw err;
      }
    },
    [fetchCategories]
  );

  useEffect(() => {
    fetchCategories().catch(() => undefined);
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    currentQuery: queryRef.current,
    updateCategory,
    deleteCategory,
    activeCategory,
  };
}
