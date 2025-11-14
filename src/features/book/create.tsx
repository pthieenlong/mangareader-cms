import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { message, Skeleton } from "antd";
import { BookForm } from "./components/BookForm";
import type { IBookCategory, IBookFormValues } from "./types";
import { bookService } from "./services/book.service";
import { generateSlug } from "@/lib/utils";

export default function CreateBookPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<IBookCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const response = await bookService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data as IBookCategory[]);
      } else {
        message.warning("Không thể tải danh mục, vui lòng thử lại.");
      }
    } catch (error) {
      message.error((error as Error).message || "Có lỗi xảy ra khi tải danh mục.");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (values: IBookFormValues) => {
    setSubmitting(true);
    try {
      const slugSource = values.slug && values.slug.trim().length > 0 ? values.slug : values.title;
      const payload = {
        title: values.title,
        slug: generateSlug(slugSource),
        thumbnail: values.thumbnail ?? "",
        description: values.description,
        author: values.author,
        policy: values.policy,
        isFree: values.isFree,
        price: values.isFree ? 0 : values.price,
        isOnSale: values.isFree ? false : values.isOnSale,
        salePercent: values.isFree ? 0 : values.isOnSale ? values.salePercent : 0,
        status: values.status,
        categoryIds: values.categoryIds,
      };

      const response = await bookService.createBook(payload);
      if (response.success) {
        message.success("Tạo truyện thành công!");
        navigate({ to: "/book" });
      } else {
        message.error(response.message || "Không thể tạo truyện, vui lòng thử lại.");
      }
    } catch (error) {
      message.error((error as Error).message || "Có lỗi xảy ra khi tạo truyện.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <BookForm
      mode="create"
      categories={categories}
      submitting={submitting}
      onSubmit={handleSubmit}
      onCancel={() => navigate({ to: "/book" })}
    />
  );
}

