import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
  Image,
  message,
} from "antd";
import type { FormInstance, UploadFile } from "antd";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { BookStatus, IBookCategory, IBookFormValues } from "../types";

const { Text } = Typography;

interface BookFormProps {
  mode: "create" | "edit";
  categories: IBookCategory[];
  defaultValues?: Partial<IBookFormValues>;
  submitting?: boolean;
  onSubmit: (values: IBookFormValues) => void;
  onCancel?: () => void;
}

const statusOptions: Array<{ label: string; value: BookStatus }> = [
  { label: "Bản nháp", value: "DRAFT" },
  { label: "Đã xuất bản", value: "PUBLISHED" },
  { label: "Đang chờ duyệt", value: "PENDING" },
  { label: "Đã lưu trữ", value: "ARCHIVED" },
];

const DEFAULT_VALUES: IBookFormValues = {
  title: "",
  slug: "",
  thumbnail: "",
  description: "",
  author: "",
  policy: "",
  isFree: false,
  price: 0,
  isOnSale: false,
  salePercent: 0,
  status: "DRAFT",
  categoryIds: [],
};

function syncDefaultValues(form: FormInstance<IBookFormValues>, values?: Partial<IBookFormValues>) {
  const mergedValues: IBookFormValues = {
    ...DEFAULT_VALUES,
    ...values,
    categoryIds: values?.categoryIds ?? [],
  };
  form.setFieldsValue(mergedValues);
}

export function BookForm({ mode, categories, defaultValues, submitting, onSubmit, onCancel }: BookFormProps) {
  const [form] = Form.useForm<IBookFormValues>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isFree = Form.useWatch("isFree", form) ?? false;
  const isOnSale = Form.useWatch("isOnSale", form) ?? false;
  const thumbnailValue = Form.useWatch("thumbnail", form);

  useEffect(() => {
    syncDefaultValues(form, defaultValues);
    if (defaultValues?.thumbnail) {
      setThumbnailUrl(defaultValues.thumbnail);
      setFileList([]);
    }
  }, [defaultValues, form]);

  useEffect(() => {
    if (thumbnailValue) {
      setThumbnailUrl(thumbnailValue);
    }
  }, [thumbnailValue]);

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

  const handleFinish = (values: IBookFormValues) => {
    onSubmit({
      ...DEFAULT_VALUES,
      ...values,
      thumbnail: thumbnailUrl || values.thumbnail || "",
      categoryIds: values.categoryIds ?? [],
    });
  };

  const handleUploadChange: UploadProps["onChange"] = (info) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj || info.file;
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setThumbnailUrl(result);
          form.setFieldValue("thumbnail", result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setThumbnailUrl("");
    setFileList([]);
    form.setFieldValue("thumbnail", "");
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ có thể upload file ảnh!");
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} initialValues={DEFAULT_VALUES}>
      <Space direction="vertical" size={24} style={{ width: "100%" }}>
        <Card title={mode === "create" ? "Tạo truyện mới" : "Chỉnh sửa truyện"}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên truyện"
                name="title"
                rules={[
                  { required: true, message: "Vui lòng nhập tên truyện" },
                  { min: 3, message: "Tên truyện cần tối thiểu 3 ký tự" },
                ]}
              >
                <Input placeholder="Nhập tên truyện (Ví dụ: One Piece)" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Slug" name="slug">
                <Input placeholder="Slug tùy chọn, bỏ trống để tự sinh từ tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
              >
                <Input placeholder="Nhập tên tác giả" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Ảnh thumbnail"
                name="thumbnail"
                rules={[{ required: true, message: "Vui lòng upload ảnh hoặc nhập URL" }]}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder="https://example.com/thumbnail.png hoặc upload file"
                    onChange={(e) => {
                      const url = e.target.value;
                      setThumbnailUrl(url);
                      if (url && !url.startsWith("data:")) {
                        setFileList([]);
                      }
                    }}
                  />
                  <Upload
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={beforeUpload}
                    maxCount={1}
                    accept="image/*"
                    listType="text"
                  >
                    <Button icon={<UploadOutlined />}>Upload ảnh</Button>
                  </Upload>
                </Space>
              </Form.Item>
            </Col>
            {thumbnailUrl && (
              <Col xs={24} md={12}>
                <Card title="Preview ảnh thumbnail" size="small">
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <Image
                      src={thumbnailUrl}
                      alt="Thumbnail preview"
                      style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                      preview
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveImage}
                      style={{ position: "absolute", top: 0, right: 0 }}
                    >
                      Xóa
                    </Button>
                  </div>
                </Card>
              </Col>
            )}
            <Col span={24}>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea placeholder="Giới thiệu truyện..." rows={6} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Chính sách"
                name="policy"
                rules={[{ required: true, message: "Vui lòng nhập chính sách truyện" }]}
              >
                <Input.TextArea placeholder="Chính sách bán truyện..." rows={4} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Danh mục" name="categoryIds">
                <Select
                  mode="multiple"
                  placeholder="Chọn danh mục cho truyện"
                  options={categories.map((category) => ({
                    label: category.title,
                    value: category.id,
                  }))}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Thông tin phát hành">
              <Form.Item label="Trạng thái" name="status">
                <Select options={statusOptions} />
              </Form.Item>
              <Form.Item label="Miễn phí" name="isFree" valuePropName="checked">
                <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
              </Form.Item>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Giá và khuyến mãi">
              <Form.Item
                label="Giá bán (VNĐ)"
                name="price"
                rules={[{ required: !isFree, message: "Vui lòng nhập giá bán" }]}
              >
                <InputNumber
                  min={0}
                  disabled={isFree}
                  style={{ width: "100%" }}
                  placeholder="Nhập giá trị, ví dụ: 15000"
                />
              </Form.Item>
              <Form.Item label="Đang giảm giá" name="isOnSale" valuePropName="checked">
                <Switch disabled={isFree} checkedChildren="Có" unCheckedChildren="Không" />
              </Form.Item>
              <Form.Item
                label="Phần trăm giảm"
                name="salePercent"
                rules={[
                  {
                    validator: (_, value) => {
                      if (!isOnSale) {
                        return Promise.resolve();
                      }
                      if (typeof value !== "number") {
                        return Promise.reject(new Error("Vui lòng nhập phần trăm giảm giá"));
                      }
                      if (value < 0 || value > 100) {
                        return Promise.reject(new Error("Giá trị phải nằm trong khoảng 0 - 100"));
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
                  placeholder="Nhập % giảm giá, ví dụ: 20"
                />
              </Form.Item>
              <Text type="secondary">
                {isFree
                  ? "Truyện miễn phí sẽ không áp dụng giá và giảm giá."
                  : "Giá trị sau giảm = Giá bán x (1 - % giảm / 100)."}
              </Text>
            </Card>
          </Col>
        </Row>

        <Space style={{ justifyContent: "flex-end", width: "100%" }}>
          <Button onClick={() => onCancel?.()}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={submitting}>
            {mode === "create" ? "Tạo truyện" : "Lưu thay đổi"}
          </Button>
        </Space>
      </Space>
    </Form>
  );
}

