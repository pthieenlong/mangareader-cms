import { useCallback, useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { message, Skeleton } from "antd";
import { BookForm } from "./components/BookForm";
import type { IBookCategory, IBookDetail, IBookFormValues } from "./types";
import { bookService } from "./services/book.service";
import { generateSlug } from "@/lib/utils";
import { router } from "@/app/router.instance";

function mapBookToFormValues(book: IBookDetail): IBookFormValues {
  return {
    title: book.title,
    slug: book.slug,
    thumbnail: book.thumbnail ?? "",
    description: book.description,
    author: book.author,
    policy: book.policy,
    isFree: book.isFree,
    price: book.isFree ? 0 : book.price,
    isOnSale: book.isOnSale,
    salePercent: book.isOnSale ? book.salePercent : 0,
    status: book.status,
    categoryIds: book.bookCategories?.map((relation) => relation.category.id) ?? [],
  };
}

export default function EditBookPage() {
  const { slug } = useParams({ from: "/book/$slug/edit" });
  const [categories, setCategories] = useState<IBookCategory[]>([]);
  const [initialValues, setInitialValues] = useState<IBookFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookResponse, categoriesResponse] = await Promise.all([
        bookService.getBookBySlug(slug),
        bookService.getCategories(),
      ]);

      if (bookResponse.success && bookResponse.data) {
        const bookData = bookResponse.data as IBookDetail;
        setInitialValues(mapBookToFormValues(bookData));
      } else {
        message.error(bookResponse.message || "Không thể tải thông tin truyện.");
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data as IBookCategory[]);
      } else {
        message.warning("Không thể tải danh mục, vui lòng thử lại sau.");
      }
    } catch (error) {
      message.error((error as Error).message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchInitialData();
  }, [fetchInitialData]);

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
      const response = await bookService.updateBook(slug, payload);
      if (response.success) {
        message.success("Cập nhật truyện thành công!");
        const updatedSlug =
          ((response.data as IBookDetail | undefined)?.slug ?? payload.slug) || slug;
        router.navigate({
          to: "/book/$slug",
          params: { slug: updatedSlug },
        } as never);
      } else {
        message.error(response.message || "Không thể cập nhật truyện, vui lòng thử lại.");
      }
    } catch (error) {
      message.error((error as Error).message || "Có lỗi xảy ra khi cập nhật truyện.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !initialValues) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  return (
    <BookForm
      mode="edit"
      categories={categories}
      defaultValues={initialValues}
      submitting={submitting}
      onSubmit={handleSubmit}
      onCancel={() => {
        router.navigate({
          to: "/book/$slug",
          params: { slug },
        } as never);
      }}
    />
  );
}

