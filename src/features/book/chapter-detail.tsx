import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "@tanstack/react-router";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  InputNumber,
  List,
  Select,
  message,
  Skeleton,
  Space,
  Switch,
  Typography,
  Carousel,
  Image,
  Modal,
} from "antd";
import type { CarouselRef } from "antd/es/carousel";
import { DeleteOutlined, PlusOutlined, LeftOutlined, RightOutlined, EyeOutlined } from "@ant-design/icons";
import type { IChapterDetail, IChapterFormValues } from "./types";
import { chapterService } from "./services/chapter.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import { router } from "@/app/router.instance";

const { Title, Text } = Typography;

function mapChapterToFormValues(chapter: IChapterDetail): IChapterFormValues {
  return {
    title: chapter.title,
    chapterNumber: chapter.chapterNumber,
    isFree: chapter.isFree,
    price: chapter.isFree ? 0 : chapter.price,
    isOnSale: chapter.isOnSale,
    salePercent: chapter.isOnSale ? chapter.salePercent : 0,
    status: chapter.status,
    content: chapter.content ?? [],
  };
}

export default function ChapterDetailPage() {
  const { slug, chapterSlug } = useParams({ from: "/book/$slug/chapters/$chapterSlug" as never });
  const [chapter, setChapter] = useState<IChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm<IChapterFormValues>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const carouselRef = useRef<CarouselRef>(null);
  const fullscreenCarouselRef = useRef<CarouselRef>(null);
  const isFree = Form.useWatch("isFree", form) ?? false;
  const isOnSale = Form.useWatch("isOnSale", form) ?? false;
  const contentUrls = Form.useWatch("content", form) ?? [];

  const fetchChapter = useCallback(async () => {
    setLoading(true);
    try {
      const response = await chapterService.getChapterDetail(slug, chapterSlug);
      if (response.success && response.data) {
        const chapterData = response.data as IChapterDetail;
        setChapter(chapterData);
        form.setFieldsValue(mapChapterToFormValues(chapterData));
      } else {
        message.error(response.message || "Không thể tải thông tin chương.");
      }
    } catch (error) {
      message.error((error as Error).message || "Có lỗi xảy ra khi tải dữ liệu chương.");
    } finally {
      setLoading(false);
    }
  }, [chapterSlug, form, slug]);

  useEffect(() => {
    void fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    if (isFree) {
      form.setFieldsValue({
        price: 0,
        isOnSale: false,
        salePercent: 0,
      });
    }
  }, [form, isFree]);

  useEffect(() => {
    if (!isOnSale) {
      form.setFieldsValue({ salePercent: 0 });
    }
  }, [form, isOnSale]);

  const handleSubmit = async (values: IChapterFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        chapterNumber: values.chapterNumber,
        isFree: values.isFree,
        price: values.isFree ? 0 : values.price,
        isOnSale: values.isFree ? false : values.isOnSale,
        salePercent: values.isFree ? 0 : values.isOnSale ? values.salePercent : 0,
        status: values.status,
        content: values.content?.filter((item) => item && item.trim().length > 0) ?? [],
      };
      const response = await chapterService.updateChapter(slug, chapterSlug, payload);
      if (response.success) {
        message.success("Cập nhật chương thành công!");
        await fetchChapter();
      } else {
        message.error(response.message || "Không thể cập nhật chương, vui lòng thử lại.");
      }
    } catch (error) {
      message.error((error as Error).message || "Có lỗi xảy ra khi cập nhật chương.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !chapter) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const metaItems = [
    {
      key: "slug",
      label: "Slug chương",
      children: chapter.slug,
    },
    {
      key: "views",
      label: "Lượt xem",
      children: (chapter.views ?? 0).toLocaleString("vi-VN"),
    },
    {
      key: "createdAt",
      label: "Ngày tạo",
      children: formatDate(chapter.createdAt),
    },
    {
      key: "updatedAt",
      label: "Cập nhật",
      children: formatDate(chapter.updatedAt),
    },
    {
      key: "price",
      label: "Giá hiện tại",
      children: chapter.isFree ? "Miễn phí" : formatCurrency(chapter.price),
    },
  ];

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Space>
        <Button
          onClick={() => {
            router.navigate({
              to: "/book/$slug",
              params: { slug },
            } as never);
          }}
        >
          Quay lại truyện
        </Button>
        <Title level={3} style={{ margin: 0 }}>
          Quản lý chương: {chapter.title}
        </Title>
      </Space>

      <Descriptions title="Thông tin chương" bordered items={metaItems} column={{ xs: 1, md: 2, lg: 3 }} />

      {contentUrls && contentUrls.length > 0 && (
        <Card
          title="Xem trước nội dung chương"
          extra={
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => {
                setPreviewIndex(0);
                setPreviewVisible(true);
              }}
            >
              Xem toàn màn hình
            </Button>
          }
        >
          <Carousel
            ref={carouselRef}
            dots
            infinite={false}
            arrows
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
            style={{ maxHeight: "600px", overflow: "hidden" }}
          >
            {contentUrls
              .filter((url) => url && url.trim().length > 0)
              .map((url, index) => (
                <div key={index} style={{ textAlign: "center", padding: "0 20px" }}>
                  <Image
                    src={url}
                    alt={`Page ${index + 1}`}
                    style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain" }}
                    preview={false}
                    loading="lazy"
                  />
                  <div style={{ marginTop: 8, color: "#666" }}>
                    Trang {index + 1} / {contentUrls.filter((u) => u && u.trim().length > 0).length}
                  </div>
                </div>
              ))}
          </Carousel>
        </Card>
      )}

      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        styles={{ body: { padding: 0, height: "100vh", display: "flex", flexDirection: "column" } }}
        closeIcon={<Button type="text" style={{ color: "#fff", zIndex: 1001 }}>Đóng</Button>}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100vh",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => {
              if (previewIndex > 0) {
                const newIndex = previewIndex - 1;
                setPreviewIndex(newIndex);
                fullscreenCarouselRef.current?.goTo(newIndex);
              }
            }}
            disabled={previewIndex === 0}
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1000,
              color: "#fff",
              fontSize: 24,
              height: 60,
              width: 60,
            }}
          />
          <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Carousel
              ref={fullscreenCarouselRef}
              dots={false}
              infinite={false}
              afterChange={(current) => setPreviewIndex(current)}
              style={{ width: "100%", height: "100%" }}
            >
              {contentUrls
                .filter((url) => url && url.trim().length > 0)
                .map((url, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100vh",
                      padding: "20px",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`Page ${index + 1}`}
                      style={{ maxWidth: "100%", maxHeight: "100vh", objectFit: "contain" }}
                      preview={false}
                    />
                  </div>
                ))}
            </Carousel>
          </div>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => {
              const maxIndex = contentUrls.filter((u) => u && u.trim().length > 0).length - 1;
              if (previewIndex < maxIndex) {
                const newIndex = previewIndex + 1;
                setPreviewIndex(newIndex);
                fullscreenCarouselRef.current?.goTo(newIndex);
              }
            }}
            disabled={previewIndex >= contentUrls.filter((u) => u && u.trim().length > 0).length - 1}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1000,
              color: "#fff",
              fontSize: 24,
              height: 60,
              width: 60,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fff",
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "8px 16px",
              borderRadius: 4,
              zIndex: 1000,
            }}
          >
            {previewIndex + 1} / {contentUrls.filter((u) => u && u.trim().length > 0).length}
          </div>
        </div>
      </Modal>

      <Card title="Chỉnh sửa chương">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tiêu đề chương"
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề chương" },
              { min: 3, message: "Tiêu đề cần tối thiểu 3 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Chapter 01 - Khởi đầu" />
          </Form.Item>

          <Form.Item
            label="Số chương"
            name="chapterNumber"
            rules={[{ required: true, message: "Vui lòng nhập số chương" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Space size="large" wrap>
            <Form.Item label="Miễn phí" name="isFree" valuePropName="checked">
              <Switch checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
            <Form.Item label="Đang giảm giá" name="isOnSale" valuePropName="checked">
              <Switch disabled={isFree} checkedChildren="Có" unCheckedChildren="Không" />
            </Form.Item>
          </Space>

          <Form.Item
            label="Giá bán (VNĐ)"
            name="price"
            rules={[
              {
                validator: (_, value) => {
                  if (isFree) {
                    return Promise.resolve();
                  }
                  if (typeof value !== "number") {
                    return Promise.reject(new Error("Vui lòng nhập giá bán hợp lệ"));
                  }
                  if (value < 0) {
                    return Promise.reject(new Error("Giá không được âm"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber min={0} disabled={isFree} style={{ width: "100%" }} placeholder="Nhập giá bán" />
          </Form.Item>

          <Form.Item
            label="Phần trăm giảm"
            name="salePercent"
            rules={[
              {
                validator: (_, value) => {
                  if (!isOnSale || isFree) {
                    return Promise.resolve();
                  }
                  if (typeof value !== "number") {
                    return Promise.reject(new Error("Vui lòng nhập phần trăm giảm giá"));
                  }
                  if (value < 0 || value > 100) {
                    return Promise.reject(new Error("Giá trị phải trong khoảng 0 - 100"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <InputNumber
              min={0}
              max={100}
              disabled={!isOnSale || isFree}
              style={{ width: "100%" }}
              placeholder="Ví dụ: 25"
            />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select
              options={[
                { label: "Bản nháp", value: "DRAFT" },
                { label: "Đang chờ", value: "PENDING" },
                { label: "Đã phát hành", value: "PUBLISHED" },
                { label: "Đã lưu trữ", value: "ARCHIVED" },
              ]}
            />
          </Form.Item>

          <Card type="inner" title="Nội dung chương (URL ảnh)">
            <Form.List name="content">
              {(fields, { add, remove }) => (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {fields.length === 0 ? (
                    <Text type="secondary">Chưa có nội dung, hãy thêm URL ảnh để cập nhật chương.</Text>
                  ) : (
                    <List
                      dataSource={fields}
                      renderItem={(field) => (
                        <List.Item
                          key={field.key}
                          actions={[
                            <Button
                              key="remove"
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(field.name)}
                            >
                              Xóa
                            </Button>,
                          ]}
                        >
                          <Form.Item
                            {...field}
                            rules={[
                              { required: true, message: "Vui lòng nhập URL ảnh" },
                              { type: "url", warningOnly: true, message: "URL chưa hợp lệ" },
                            ]}
                            style={{ width: "100%" }}
                          >
                            <Input placeholder="https://cdn.example.com/chapter-01/image-1.jpg" />
                          </Form.Item>
                        </List.Item>
                      )}
                    />
                  )}
                  <Button type="dashed" icon={<PlusOutlined />} onClick={() => add("")} block>
                    Thêm URL ảnh
                  </Button>
                </Space>
              )}
            </Form.List>
          </Card>

          <Space style={{ justifyContent: "flex-end", width: "100%", marginTop: 24 }}>
            <Button
              onClick={() => {
                router.navigate({
                  to: "/book/$slug",
                  params: { slug },
                } as never);
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Lưu thay đổi
            </Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}

