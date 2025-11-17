import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { categoryService } from "./services/category.service";
import type { CreateCategoryPayload } from "./types";
import { generateSlug } from "@/lib/utils";
import "./category.scss";

const { Title, Text } = Typography;
const { TextArea } = Input;

type CategoryFormValues = {
  title: string;
  description?: string;
  thumbnail?: string;
};

const INITIAL_VALUES: CategoryFormValues = {
  title: "",
  description: "",
  thumbnail: "",
};

export default function CreateCategoryPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CategoryFormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const uploadFileList: UploadFile[] = thumbnailPreview
    ? [
        {
          uid: "-1",
          name: "category-thumbnail",
          status: "done",
          url: thumbnailPreview,
        },
      ]
    : [];

  const handleNavigateBack = () => {
    navigate({ to: "/categories" });
  };

  const handleFinish = async (values: CategoryFormValues) => {
    setSubmitting(true);
    try {
      const payload: CreateCategoryPayload = {
        title: values.title.trim(),
        slug: generateSlug(values.title),
        description: values.description?.trim()
          ? values.description.trim()
          : undefined,
        thumbnail: values.thumbnail?.trim()
          ? values.thumbnail.trim()
          : undefined,
      };
      const response = await categoryService.createCategory(payload);
      if (response.success) {
        message.success("Tạo danh mục thành công!");
        navigate({ to: "/categories" });
      } else {
        message.error(
          response.message || "Không thể tạo danh mục, vui lòng thử lại."
        );
      }
    } catch (error) {
      message.error(
        (error as Error).message || "Có lỗi xảy ra khi tạo danh mục."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setThumbnailPreview(result);
      form.setFieldValue("thumbnail", result);
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview("");
    form.setFieldValue("thumbnail", "");
  };

  return (
    <div className="category-create">
      <Card className="category-create-card">
        <div className="category-create__header">
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Tạo danh mục mới
            </Title>
            <Text type="secondary">
              Nhập thông tin cơ bản để thêm danh mục hiển thị trong hệ thống.
            </Text>
          </div>
          <Button icon={<ArrowLeftOutlined />} onClick={handleNavigateBack}>
            Quay lại danh sách
          </Button>
        </div>
        <Form
          layout="vertical"
          form={form}
          initialValues={INITIAL_VALUES}
          onFinish={handleFinish}
        >
          <Form.Item
            label="Tên danh mục"
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              {
                min: 2,
                message: "Tên danh mục cần ít nhất 2 ký tự",
              },
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
            <Form.Item name="thumbnail" hidden>
              <Input />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              {
                max: 500,
                message: "Mô tả tối đa 500 ký tự",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Mô tả ngắn về danh mục" />
          </Form.Item>

          <div className="category-form-actions">
            <Button onClick={handleNavigateBack}>Huỷ</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Tạo danh mục
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

