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
        const nextUsers = response.data as IUser[];
        setUsers(nextUsers);
        if (response.pagination) {
          const rawPagination = response.pagination as Pagination & {
            total?: number;
            totalCount?: number;
            itemCount?: number;
            currentPage?: number;
          };
          const normalizedLimit = rawPagination.limit ?? filters.limit ?? 10;
          const derivedTotalItems =
            rawPagination.totalItems ??
            rawPagination.total ??
            rawPagination.totalCount ??
            rawPagination.itemCount ??
            (rawPagination.totalPage
              ? rawPagination.totalPage * normalizedLimit
              : undefined);
          const normalizedTotalItems =
            derivedTotalItems ?? nextUsers.length ?? 0;
          const normalizedTotalPage =
            rawPagination.totalPage ??
            Math.max(
              1,
              Math.ceil(normalizedTotalItems / (normalizedLimit || 1))
            );

          setPagination({
            page:
              rawPagination.page ??
              rawPagination.currentPage ??
              filters.page ??
              1,
            limit: normalizedLimit || 10,
            totalPage: normalizedTotalPage,
            totalItems: normalizedTotalItems,
          });
        } else {
          setPagination((prev) => {
            const limit = filters.limit ?? prev.limit ?? 10;
            const fallbackTotal = nextUsers.length;
            return {
              page: filters.page ?? prev.page ?? 1,
              limit,
              totalPage: Math.max(1, Math.ceil(fallbackTotal / limit)),
              totalItems: fallbackTotal,
            };
          });
        }
      } else {
        const errorMessage =
          response.message ||
          "Không thể tải danh sách người dùng, vui lòng thử lại.";
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

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      updateFilters({ page, limit: pageSize });
    },
    [updateFilters]
  );

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
