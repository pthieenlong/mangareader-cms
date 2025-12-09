import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Switch,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import type { FormInstance, UploadFile, UploadProps } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { useBlocker } from "@tanstack/react-router";
import { generateSlug, formatCurrency } from "@/utils";
import type { BookStatus, IBookCategory, IBookFormValues } from "../types";

const { Text, Paragraph } = Typography;
const { CheckableTag } = Tag;
const { Dragger } = Upload;

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

function syncDefaultValues(
  form: FormInstance<IBookFormValues>,
  values?: Partial<IBookFormValues>
) {
  const mergedValues: IBookFormValues = {
    ...DEFAULT_VALUES,
    ...values,
    categoryIds: values?.categoryIds ?? [],
  };
  form.setFieldsValue(mergedValues);
}

export function BookForm({
  mode,
  categories,
  defaultValues,
  submitting,
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [form] = Form.useForm<IBookFormValues>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [policyFileList, setPolicyFileList] = useState<UploadFile[]>([]);
  const isFree = Form.useWatch("isFree", form) ?? false;
  const isOnSale = Form.useWatch("isOnSale", form) ?? false;
  const thumbnailValue = Form.useWatch("thumbnail", form);
  const titleValue = Form.useWatch("title", form) ?? "";
  const descriptionValue = Form.useWatch("description", form) ?? "";
  const categoryValues = Form.useWatch("categoryIds", form) ?? [];
  const priceValue = Form.useWatch("price", form) ?? 0;
  const salePercentValue = Form.useWatch("salePercent", form) ?? 0;
  const [isDirty, setIsDirty] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [policyUploadProgress, setPolicyUploadProgress] = useState(0);
  const finalPrice = useMemo(() => {
    if (isFree) return 0;
    if (!isOnSale) return priceValue;
    const computed = priceValue * (1 - salePercentValue / 100);
    return computed > 0 ? computed : 0;
  }, [isFree, isOnSale, priceValue, salePercentValue]);
  const blocker = useBlocker({
    shouldBlockFn: () => isDirty,
    withResolver: true,
    enableBeforeUnload: () => isDirty,
    disabled: !isDirty,
  });

  useEffect(() => {
    syncDefaultValues(form, defaultValues);
    if (defaultValues?.thumbnail) {
      setThumbnailUrl(defaultValues.thumbnail);
      setFileList([]);
    }
    setIsDirty(false);
  }, [defaultValues, form, mode]);

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

  useEffect(() => {
    if (!titleValue) {
      form.setFieldValue("slug", "");
      return;
    }
    form.setFieldValue("slug", generateSlug(titleValue));
  }, [form, titleValue]);

  useEffect(() => {
    if (blocker.status !== "blocked") {
      return;
    }
    const modal = Modal.confirm({
      title: "Bạn có thay đổi chưa lưu",
      icon: <ExclamationCircleOutlined />,
      content: "Rời khỏi trang sẽ làm mất các thay đổi hiện tại.",
      okText: "Rời trang",
      okType: "danger",
      cancelText: "Ở lại",
      onOk: () => blocker.proceed?.(),
      onCancel: () => blocker.reset?.(),
    });
    return () => modal.destroy();
  }, [blocker]);

  const handleFinish = (values: IBookFormValues) => {
    onSubmit({
      ...DEFAULT_VALUES,
      ...values,
      thumbnail: thumbnailUrl || values.thumbnail || "",
      categoryIds: values.categoryIds ?? [],
    });
  };

  const handleUploadChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    if (info.file.status === "uploading") {
      setUploadProgress((current) => (current < 40 ? 40 : current));
    }

    if (info.file.status === "done" || info.file.originFileObj) {
      const file = info.file.originFileObj as File | undefined;
      if (file) {
        const reader = new FileReader();
        setUploadProgress(60);
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setThumbnailUrl(result);
          form.setFieldValue("thumbnail", result);
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 800);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = () => {
    setThumbnailUrl("");
    setFileList([]);
    form.setFieldValue("thumbnail", "");
    setUploadProgress(0);
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

  const handleValuesChange = () => {
    setIsDirty(form.isFieldsTouched(true));
  };

  const handleSmartCancel = () => {
    if (!isDirty) {
      onCancel?.();
      return;
    }
    Modal.confirm({
      title: "Bạn có thay đổi chưa lưu",
      content: "Nếu rời khỏi trang, các thay đổi sẽ bị mất. Bạn có chắc chắn?",
      okText: "Rời trang",
      cancelText: "Tiếp tục chỉnh sửa",
      okType: "danger",
      icon: <ExclamationCircleOutlined />,
      onOk: () => onCancel?.(),
    });
  };

  const handlePolicyUploadChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    const latestList = info.fileList.slice(-1);
    setPolicyFileList(latestList);

    if (info.file.status === "uploading") {
      setPolicyUploadProgress((current) => (current < 40 ? 40 : current));
    }

    const file = info.file.originFileObj as File | undefined;
    if (file) {
      const reader = new FileReader();
      setPolicyUploadProgress(70);
      reader.onload = (e) => {
        const result = e.target?.result as string;
        form.setFieldValue("policy", result);
        setPolicyUploadProgress(100);
        setTimeout(() => setPolicyUploadProgress(0), 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePolicyRemove = () => {
    setPolicyFileList([]);
    setPolicyUploadProgress(0);
    form.setFieldValue("policy", "");
  };

  const beforePolicyUpload = (file: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      message.error("Vui lòng tải file PDF hoặc Word.");
      return Upload.LIST_IGNORE;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("File phải nhỏ hơn 10MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const groupedCategoryOptions = useMemo(() => {
    const map = new Map<string, { label: string; value: string }[]>();
    categories.forEach((category) => {
      const key = category.title.charAt(0).toUpperCase();
      const group = map.get(key) ?? [];
      group.push({ label: category.title, value: category.id });
      map.set(key, group);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, options]) => ({
        label,
        options,
      }));
  }, [categories]);

  const quickCategorySuggestions = categories.slice(0, 6);

  const categoryTagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    return (
      <Tag
        color="blue"
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {label || value}
      </Tag>
    );
  };

  return (
    <>
      {submitting && <Spin spinning tip="Đang lưu truyện..." fullscreen />}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={DEFAULT_VALUES}
        onValuesChange={handleValuesChange}
        scrollToFirstError
      >
        <Space direction="vertical" size={24} style={{ width: "100%" }}>
          <Card
            title={mode === "create" ? "Tạo truyện mới" : "Chỉnh sửa truyện"}
          >
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
                  <Input placeholder="Nhập tên truyện (VD: One Piece)" />
                </Form.Item>
                <Form.Item name="slug" hidden>
                  <Input type="hidden" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      Tác giả
                      <Tooltip title="Tên tác giả sẽ hiển thị cùng truyện.">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  name="author"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên tác giả" },
                  ]}
                >
                  <Input placeholder="Nhập tên tác giả" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Ảnh thumbnail">
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item label="Tải ảnh" required>
                  <Form.Item
                    name="thumbnail"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng upload ảnh thumbnail",
                      },
                    ]}
                    noStyle
                  >
                    <Input type="hidden" />
                  </Form.Item>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    <Text type="secondary">
                      Chỉ hỗ trợ ảnh PNG/JPG, kích thước đề xuất 600x800px.
                    </Text>
                    <Dragger
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                      accept="image/*"
                      listType="picture"
                      showUploadList={false}
                    >
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Kéo thả hoặc nhấn để chọn ảnh
                      </p>
                      <p className="ant-upload-hint">
                        Chỉ nhận file ảnh, không hỗ trợ nhập URL.
                      </p>
                    </Dragger>
                    {uploadProgress > 0 && (
                      <Progress
                        percent={uploadProgress}
                        size="small"
                        status={uploadProgress === 100 ? "success" : "active"}
                      />
                    )}
                    <Form.Item shouldUpdate noStyle>
                      {({ getFieldError }) => {
                        const errors = getFieldError("thumbnail");
                        return errors.length ? (
                          <Text type="danger">{errors[0]}</Text>
                        ) : null;
                      }}
                    </Form.Item>
                  </Space>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                {thumbnailUrl ? (
                  <Card
                    size="small"
                    title="Preview thumbnail"
                    extra={<Tag color="blue">Realtime</Tag>}
                  >
                    <Image
                      src={thumbnailUrl}
                      alt="Thumbnail preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 320,
                        objectFit: "contain",
                      }}
                      preview
                    />
                    <Divider />
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveImage}
                      block
                    >
                      Xóa ảnh
                    </Button>
                  </Card>
                ) : (
                  <Alert type="info" message="Chưa có ảnh preview" showIcon />
                )}
              </Col>
            </Row>
          </Card>

          <Card title="Nội dung mô tả">
            <Form.Item label="Mô tả" name="description">
              <MarkdownTextArea
                rows={6}
                placeholder="Giới thiệu truyện, nội dung chính, điểm thu hút..."
                value={descriptionValue}
                onChange={(value) => form.setFieldValue("description", value)}
              />
            </Form.Item>
          </Card>

          <Card title="Chính sách phát hành">
            <Alert
              showIcon
              type="info"
              message="Tải lên file PDF/Word mô tả chính sách phát hành, quyền lợi độc giả, điều khoản giá."
              style={{ marginBottom: 16 }}
            />
            <Form.Item label="File chính sách" required>
              <Form.Item
                name="policy"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng tải lên file chính sách",
                  },
                ]}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Dragger
                  accept=".pdf,.doc,.docx"
                  fileList={policyFileList}
                  beforeUpload={beforePolicyUpload}
                  onChange={handlePolicyUploadChange}
                  maxCount={1}
                  showUploadList
                >
                  <p className="ant-upload-drag-icon">
                    <FileOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Kéo thả hoặc chọn file PDF/Word
                  </p>
                  <p className="ant-upload-hint">
                    Dung lượng tối đa 10MB. Nếu không tải, file cũ sẽ được giữ
                    nguyên.
                  </p>
                </Dragger>
                {policyUploadProgress > 0 && (
                  <Progress
                    percent={policyUploadProgress}
                    size="small"
                    status={policyUploadProgress === 100 ? "success" : "active"}
                  />
                )}
                {form.getFieldValue("policy") && policyFileList.length > 0 && (
                  <Button onClick={handlePolicyRemove}>Xóa file đã chọn</Button>
                )}
                <Form.Item shouldUpdate noStyle>
                  {({ getFieldError }) => {
                    const errors = getFieldError("policy");
                    return errors.length ? (
                      <Text type="danger">{errors[0]}</Text>
                    ) : null;
                  }}
                </Form.Item>
              </Space>
            </Form.Item>
          </Card>

          <Card title="Danh mục & gợi ý">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Alert
                type="info"
                showIcon
                message="Ưu tiên 2-3 danh mục chính để độc giả tìm truyện dễ hơn. Bạn có thể chọn nhanh bằng tag bên dưới."
              />
              <Space wrap>
                {quickCategorySuggestions.map((category) => {
                  const checked = categoryValues.includes(category.id);
                  return (
                    <CheckableTag
                      key={category.id}
                      checked={checked}
                      onChange={(nextChecked) =>
                        toggleCategory(category.id, nextChecked, form)
                      }
                    >
                      {category.title}
                    </CheckableTag>
                  );
                })}
              </Space>
              <Form.Item
                label="Danh mục"
                name="categoryIds"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ít nhất 1 danh mục",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Nhập để tìm danh mục hoặc chọn từ danh sách"
                  options={groupedCategoryOptions}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  tagRender={categoryTagRender}
                  maxTagCount="responsive"
                />
              </Form.Item>
              <Text type="secondary">
                Đang chọn {categoryValues.length} danh mục:{" "}
                {categoryValues.length > 0
                  ? categoryValues
                      .map(
                        (id) =>
                          categories.find((category) => category.id === id)
                            ?.title
                      )
                      .filter(Boolean)
                      .join(", ")
                  : "Chưa chọn"}
              </Text>
            </Space>
          </Card>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card title="Trạng thái & hiển thị">
                <Form.Item label="Trạng thái" name="status">
                  <Select options={statusOptions} />
                </Form.Item>
                <Form.Item
                  label="Miễn phí"
                  name="isFree"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="Giá & khuyến mãi">
                <Form.Item
                  label="Giá bán (VNĐ)"
                  name="price"
                  rules={[
                    { required: !isFree, message: "Vui lòng nhập giá bán" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    disabled={isFree}
                    style={{ width: "100%" }}
                    placeholder="Nhập giá trị, ví dụ: 15000"
                  />
                </Form.Item>
                <Form.Item
                  label="Đang giảm giá"
                  name="isOnSale"
                  valuePropName="checked"
                >
                  <Switch
                    disabled={isFree}
                    checkedChildren="Có"
                    unCheckedChildren="Không"
                  />
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
                          return Promise.reject(
                            new Error("Vui lòng nhập phần trăm giảm giá")
                          );
                        }
                        if (value < 0 || value > 100) {
                          return Promise.reject(
                            new Error("Giá trị phải nằm trong khoảng 0 - 100")
                          );
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
                <Divider />
                <Statistic
                  title="Giá đến tay độc giả"
                  value={formatCurrency(finalPrice)}
                  valueStyle={{
                    color: isOnSale && !isFree ? "#cf1322" : undefined,
                  }}
                />
                <Text type="secondary">
                  {isFree
                    ? "Truyện miễn phí sẽ không áp dụng giá và giảm giá."
                    : "Giá trị sau giảm = Giá bán x (1 - % giảm / 100)."}
                </Text>
              </Card>
            </Col>
          </Row>

          <div
            style={{
              position: "sticky",
              bottom: 0,
              zIndex: 5,
              background: "#fff",
              borderTop: "1px solid #f0f0f0",
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 -4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <Text type="secondary">
              {isDirty
                ? "Có thay đổi chưa lưu"
                : "Đã đồng bộ với bản nháp gần nhất"}
            </Text>
            <Space>
              <Button onClick={handleSmartCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {mode === "create" ? "Tạo truyện" : "Lưu thay đổi"}
              </Button>
            </Space>
          </div>
        </Space>
      </Form>
    </>
  );
}

function toggleCategory(
  categoryId: string,
  nextChecked: boolean,
  form: FormInstance<IBookFormValues>
) {
  const current: string[] = form.getFieldValue("categoryIds") ?? [];
  const next = nextChecked
    ? Array.from(new Set([...current, categoryId]))
    : current.filter((id) => id !== categoryId);
  form.setFieldValue("categoryIds", next);
}

function MarkdownTextArea({
  value = "",
  onChange,
  placeholder,
  rows = 6,
}: {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const [preview, setPreview] = useState(false);
  const wordCount = value
    ? value.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="small">
      <Space
        align="center"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <Text type="secondary">{wordCount} từ</Text>
        <Space size={6}>
          <Text type="secondary">Xem trước Markdown</Text>
          <Switch size="small" checked={preview} onChange={setPreview} />
        </Space>
      </Space>
      {preview ? (
        <Card
          size="small"
          bodyStyle={{ maxHeight: rows * 40, overflow: "auto" }}
        >
          {value ? (
            <div
              style={{ fontSize: 14, lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(value) }}
            />
          ) : (
            <Paragraph type="secondary" italic>
              Chưa có nội dung để hiển thị
            </Paragraph>
          )}
        </Card>
      ) : (
        <Input.TextArea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          rows={rows}
          placeholder={placeholder}
        />
      )}
    </Space>
  );
}

function basicMarkdownToHtml(markdown: string): string {
  let html = escapeHtml(markdown);
  html = html
    .replace(/^###### (.*)$/gim, "<h6>$1</h6>")
    .replace(/^##### (.*)$/gim, "<h5>$1</h5>")
    .replace(/^#### (.*)$/gim, "<h4>$1</h4>")
    .replace(/^### (.*)$/gim, "<h3>$1</h3>")
    .replace(/^## (.*)$/gim, "<h2>$1</h2>")
    .replace(/^# (.*)$/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/`([^`]+)`/gim, "<code>$1</code>")
    .replace(/^\s*-\s+(.*)$/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gims, (match) => `<ul>${match}</ul>`)
    .replace(/\n/g, "<br />");
  return html;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return char;
    }
  });
}
