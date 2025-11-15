import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { userService } from "../services/user.service";
import type { IUser, IUserListParams } from "../types";
import type { Pagination } from "@/lib/custom";

export function useUsers(initialParams?: IUserListParams) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<IUserListParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers(filters);
      if (response.success && response.data) {
        setUsers(response.data as IUser[]);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        const errorMessage =
          response.message || "Không thể tải danh sách người dùng, vui lòng thử lại.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải danh sách người dùng.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const updateFilters = useCallback((newFilters: Partial<IUserListParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    updateFilters({ page, limit: pageSize });
  }, [updateFilters]);

  return {
    users,
    loading,
    error,
    pagination,
    filters,
    refetch: fetchUsers,
    updateFilters,
    handlePageChange,
  };
}

