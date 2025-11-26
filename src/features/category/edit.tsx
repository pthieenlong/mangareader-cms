import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Button,
  Card,
  Form,
  Input,
  Skeleton,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { categoryService } from "./services/category.service";
import type { ICategory } from "./types";
import "./category.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

type CategoryFormValues = {
  title: string;
  description?: string;
};

const EMPTY_VALUES: CategoryFormValues = {
  title: "",
  description: "",
};

export default function EditCategoryPage() {
  const navigate = useNavigate();
  const { slug } = useParams({ from: "/categories/$slug/edit" } as never);
  const [form] = Form.useForm<CategoryFormValues>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState<string>("");
  const [initialValues, setInitialValues] = useState<CategoryFormValues | null>(
    null
  );

  const uploadFileList: UploadFile[] =
    thumbnailPreview || initialThumbnailUrl
      ? [
          {
            uid: "-1",
            name: "category-thumbnail",
            status: "done",
            url: thumbnailPreview || initialThumbnailUrl,
          },
        ]
      : [];

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await categoryService.getCategoryBySlug(slug);
        if (response.success && response.data) {
          const data = response.data as ICategory;
          const thumbnailUrl = data.thumbnail
            ? `https://cdn.mangareader.io.vn/${data.thumbnail}`
            : "";
          const mappedValues: CategoryFormValues = {
            title: data.title ?? "",
            description: data.description ?? "",
          };
          setInitialValues(mappedValues);
          setInitialThumbnailUrl(thumbnailUrl);
          setThumbnailPreview(thumbnailUrl);
          form.setFieldsValue(mappedValues);
        } else {
          const errorMsg =
            response.message || "Không thể tải thông tin danh mục.";
          message.error(errorMsg);
          navigate({ to: "/categories" } as never);
        }
      } catch (error) {
        message.error(
          (error as Error).message || "Có lỗi xảy ra khi tải danh mục."
        );
        navigate({ to: "/categories" } as never);
      } finally {
        setLoading(false);
      }
    };

    void fetchCategory();
  }, [form, navigate, slug]);

  const handleBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      void message.error("Vui lòng chọn file ảnh hợp lệ (PNG, JPG, WebP...).");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      void message.error("Ảnh phải nhỏ hơn 5MB.");
      return Upload.LIST_IGNORE;
    }
    // Save File object
    setThumbnailFile(file);
    // Create preview for display
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setThumbnailPreview(result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview("");
    setThumbnailFile(null);
    // Reset to initial thumbnail if exists
    if (initialThumbnailUrl) {
      setThumbnailPreview(initialThumbnailUrl);
    }
  };

  const handleNavigateBack = () => {
    navigate({ to: "/categories" } as never);
  };

  const handleFinish = async (values: CategoryFormValues) => {
    setSubmitting(true);
    try {
      const payload: {
        description?: string;
        thumbnail?: File;
      } = {
        description: values.description?.trim()
          ? values.description.trim()
          : undefined,
      };

      // Only include thumbnail if a new file was uploaded
      if (thumbnailFile) {
        payload.thumbnail = thumbnailFile;
      }

      const response = await categoryService.updateCategory(slug, payload);
      if (response.success) {
        message.success("Cập nhật danh mục thành công!");
        navigate({ to: "/categories" } as never);
      } else {
        message.error(
          response.message || "Không thể cập nhật danh mục, vui lòng thử lại."
        );
      }
    } catch (error) {
      message.error(
        (error as Error).message || "Có lỗi xảy ra khi cập nhật danh mục."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !initialValues) {
    return (
      <div className="category-create">
        <Card className="category-create-card">
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div className="category-create">
      <Card className="category-create-card">
        <div className="category-create__header">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Cập nhật danh mục
            </Title>
            <Text type="secondary">
              Chỉnh sửa thông tin để cập nhật danh mục trong hệ thống.
            </Text>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={handleNavigateBack}>
            Quay lại danh sách
          </Button>
        </div>
        <Form
          layout="vertical"
          form={form}
          initialValues={initialValues ?? EMPTY_VALUES}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Tên danh mục"
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 2, message: "Tên danh mục cần ít nhất 2 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Hành động, Lãng mạn..." />
          </Form.Item>

          <Form.Item label="Ảnh đại diện (tuỳ chọn)">
            <Upload
              accept="image/*"
              listType="picture-card"
              fileList={uploadFileList}
              beforeUpload={handleBeforeUpload}
              onRemove={handleRemoveThumbnail}
            >
              {uploadFileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>
            <Text type="secondary">
              Ảnh vuông, dung lượng tối đa 5MB. Có thể bỏ trống.
            </Text>
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ max: 500, message: "Mô tả tối đa 500 ký tự" }]}
          >
            <TextArea rows={4} placeholder="Mô tả ngắn về danh mục" />
          </Form.Item>

          <div className="category-form-actions">
            <Button onClick={handleNavigateBack}>Huỷ</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Cập nhật danh mục
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
