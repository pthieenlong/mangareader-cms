import { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { bookService } from "../services/book.service";
import type { IBook, IBookListParams } from "../types";

export function BookList() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<IBookListParams>({
    page: 1,
    pageSize: 10,
    keyword: "",
    sort: "latest",
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
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      keyword: value,
      page: 1,
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: value as IBookListParams["sort"],
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const formatPrice = (price: number, isOnSale: boolean, salePercent: number) => {
    if (isOnSale) {
      const salePrice = price * (1 - salePercent / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground line-through">{price}đ</span>
          <span className="font-semibold text-destructive">{salePrice}đ</span>
        </div>
      );
    }
    return <span>{price}đ</span>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      DRAFT: { label: "Bản nháp", variant: "outline" },
      PUBLISHED: { label: "Đã xuất bản", variant: "default" },
      ARCHIVED: { label: "Đã lưu trữ", variant: "secondary" },
    };
    const statusInfo = statusMap[status] || { label: status, variant: "outline" as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Danh sách truyện</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý và theo dõi tất cả các truyện trong hệ thống
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          Thêm truyện mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, tác giả..."
              className="pl-9"
              value={filters.keyword || ""}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="w-48">
          <Select
            value={filters.sort || "latest"}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="latest">Mới nhất</option>
            <option value="top_rated">Đánh giá cao</option>
            <option value="most_viewed">Xem nhiều nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="free">Miễn phí</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">Không có dữ liệu</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead>Tên truyện</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Lượt xem</TableHead>
                <TableHead className="text-center">Lượt thích</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="size-12 rounded object-cover"
                      />
                    ) : (
                      <div className="flex size-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{book.title}</span>
                      {book.isFree && (
                        <Badge variant="secondary" className="mt-1 w-fit">
                          Miễn phí
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{book.author || "-"}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(book.status)}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm">{book.view}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm">{book.likeCount}</span>
                  </TableCell>
                  <TableCell>
                    {book.isFree ? (
                      <Badge variant="outline">Miễn phí</Badge>
                    ) : (
                      formatPrice(book.price, book.isOnSale, book.salePercent)
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" title="Xem chi tiết">
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Chỉnh sửa">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" title="Xóa">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPage > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page > 1) {
                    handlePageChange(pagination.page - 1);
                  }
                }}
                className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={page === pagination.page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (pagination.page < pagination.totalPage) {
                    handlePageChange(pagination.page + 1);
                  }
                }}
                className={
                  pagination.page === pagination.totalPage
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Summary */}
      <div className="text-sm text-muted-foreground">
        Hiển thị {books.length} / {pagination.totalItems} truyện
      </div>
    </div>
  );
}

