import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { categoryService } from "../services/category.service";
import type { ICategory } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data as ICategory[]);
      } else {
        const errorMessage =
          response.message || "Không thể tải danh mục, vui lòng thử lại.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải danh mục.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (
      slug: string,
      payload: {
        title?: string;
        description?: string;
        thumbnail?: File | string;
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

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    updateCategory,
  };
}
