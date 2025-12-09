import { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import {
  Button,
  Card,
  Descriptions,
  Image,
  Result,
  Skeleton,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  formatDate,
  getChapterStatusColor,
  getChapterStatusText,
} from "@/utils";
import { router } from "@/app/router.instance";
import { useChapterDetail } from "./hooks/useChapterDetail";

const { Title, Text } = Typography;

export default function ChapterDetailPage() {
  const { slug, chapterSlug } = useParams({
    from: "/book/$slug/chapters/$chapterSlug" as never,
  });
  const { chapter, loading, error } = useChapterDetail(slug, chapterSlug);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  if (!chapter) {
    return (
      <Result
        status="error"
        title="Không tìm thấy thông tin chương"
        subTitle="Chương có thể đã bị xóa hoặc slug không hợp lệ."
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.navigate({
                to: "/book/$slug",
                params: { slug },
              } as never);
            }}
          >
            Quay lại truyện
          </Button>
        }
      />
    );
  }

  const contentUrls =
    chapter.content?.filter((item) => item && item.trim().length > 0) ?? [];

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
  ];

  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Space align="center">
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
          Chương {chapter.chapterNumber}: {chapter.title}
        </Title>
        <Tag color={getChapterStatusColor(chapter.status)}>
          {getChapterStatusText(chapter.status)}
        </Tag>
      </Space>

      <Descriptions
        title="Thông tin chương"
        bordered
        items={metaItems}
        column={{ xs: 1, md: 2, lg: 3 }}
      />

      {contentUrls.length > 0 ? (
        <Card title="Album nội dung chương">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "center",
            }}
          >
            <Image.PreviewGroup>
              {contentUrls.map((url, index) => (
                <div
                  key={url}
                  style={{
                    width: "min(320px, 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Image
                    src={url}
                    alt={`Trang ${index + 1}`}
                    style={{
                      width: "100%",
                      maxHeight: "420px",
                      objectFit: "cover",
                      borderRadius: 8,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    loading="lazy"
                  />
                  <Text type="secondary">Trang {index + 1}</Text>
                </div>
              ))}
            </Image.PreviewGroup>
          </div>
        </Card>
      ) : (
        <Card>
          <Text type="secondary">
            Chương này chưa có nội dung hiển thị hoặc Publisher chưa tải ảnh
            thành công.
          </Text>
        </Card>
      )}
    </Space>
  );
}
