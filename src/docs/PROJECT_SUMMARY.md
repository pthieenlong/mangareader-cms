# MangaReader - Tóm Tắt Dự Án

## 🧩 Tổng Quan Dự Án: **MangaReader**

**MangaReader** là một nền tảng đọc truyện tranh trực tuyến, cho phép người dùng khám phá, đọc, đánh giá và theo dõi các bộ truyện yêu thích. Hệ thống tập trung vào trải nghiệm đọc mượt mà, bố cục rõ ràng, cùng khả năng mở rộng nội dung linh hoạt.

## 🎯 Mục Tiêu

- Cung cấp thư viện truyện lớn, đa dạng thể loại.
- Trải nghiệm đọc mượt, điều hướng đơn giản.
- Hỗ trợ người dùng tạo tài khoản để theo dõi và lưu trữ lịch sử đọc.
- Cho phép tương tác giữa người dùng và nội dung (đánh giá, yêu thích).
- Hệ thống thanh toán mua truyện với preview miễn phí.

## 🧱 Kiến Trúc Hệ Thống

| Thành phần                | Mô tả                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| **Frontend (User)**       | Hiển thị giao diện web cho người dùng cuối, tối ưu UX/UI cho việc đọc truyện.                  |
| **Admin Panel**           | Quản lý CRUD cho truyện, chương, thể loại, người dùng, đơn hàng, duyệt phép publisher.         |
| **Backend (API)**         | Cung cấp API xử lý dữ liệu truyện, người dùng, tương tác và phân quyền. **Backend đã có sẵn.** |
| **Database (PostgreSQL)** | Lưu trữ thông tin truyện, chương, người dùng, đơn hàng, publisher, thông báo.                  |
| **CDN**                   | Lưu trữ và phân phối hình ảnh chương truyện.                                                   |

## 📚 Các Thành Phần Chức Năng Chính

### 🔐 Authentication & Authorization

- **JWT Authentication**: Sử dụng JWT cho xác thực người dùng.
- Phân quyền: User / Admin / Publisher.
- Đăng ký, đăng nhập, quên mật khẩu.
- Cập nhật thông tin tài khoản.

### 👤 Quản Lý Người Dùng (Admin Panel)

- CRUD người dùng.
- Duyệt phép cho người dùng trở thành Publisher.
- Quản lý phân quyền.

### 📖 Truyện & Chương

- **Admin Panel**: CRUD truyện, chương, thể loại.
- Xem danh sách truyện theo phân loại.
- Xem thông tin chi tiết truyện.
- Đọc chương với giao diện tối ưu cho màn hình ngang/dọc.
- Hiển thị lịch sử đọc.
- **Nội dung chương**: Lưu trữ dạng URL (CDN), quản lý thứ tự ảnh trong chương.
- **Tối ưu**: Hỗ trợ lazy loading và optimization cho hình ảnh.

### ⭐ Tương Tác Nội Dung

- Đánh giá truyện (xem review cho từng book, không quản lý CRUD review).
- Yêu thích truyện.
- **Lưu ý**: Không quản lý comment trong admin panel.

### 🛍️ Mua Truyện & Thanh Toán

- **Mô hình mua**: Chỉ mua truyện (book), không mua theo chapter.
- **Preview miễn phí**: Một vài chapter đầu miễn phí để preview, sau đó phải mua book để unlock toàn bộ.
- **Book miễn phí**: Có thể đánh dấu book là miễn phí hoàn toàn.
- **Gateway thanh toán**:
  - VNPay (tích hợp sau)
  - Stripe (tích hợp sau)
- **Admin Panel**: Quản lý đơn hàng và thanh toán.

### 📢 Thông Báo Realtime

- Sử dụng Realtime notifications.
- Các loại thông báo:
  - Đơn hàng mới
  - Yêu cầu duyệt book
  - Yêu cầu duyệt phép trở thành Publisher
  - Thông báo khác (nếu có)

## 📦 Cấu Trúc Dữ Liệu Chính

### Mối Quan Hệ

- **Book ↔ Chapter**: Một Book có nhiều Chapter (One-to-Many).
- **Book ↔ Category**: Một Book có nhiều Category, một Category có nhiều Book (Many-to-Many).
- **Publisher**: Entity riêng, có thể được gán cho Book.

### Các Entity Chính

- **User**: Lưu thông tin tài khoản, vai trò (User/Admin/Publisher).
- **Publisher**: Entity riêng cho nhà xuất bản.
- **Book (Truyện)**:
  - Tiêu đề, tác giả, mô tả, trạng thái
  - Ảnh bìa
  - Giá, trạng thái miễn phí (`isFree`)
  - Trạng thái giảm giá (`isOnSale`, `salePercent`)
  - Publisher
- **Chapter (Chương)**:
  - Số chương, tiêu đề
  - Nội dung: Danh sách URL ảnh (CDN) với thứ tự
  - Trạng thái preview miễn phí
- **Category (Thể loại)**: Tên, mô tả.
- **Order**: Đơn hàng mua truyện, trạng thái thanh toán.
- **Review**: Đánh giá của người dùng (chỉ xem, không quản lý CRUD trong admin).

## 🔧 Công Nghệ & Kỹ Thuật

- **Frontend Admin**: React 19, TypeScript, Ant Design, Vite, Tailwind CSS, Zustand
- **Authentication**: JWT
- **Realtime**: WebSocket/Realtime notifications
- **CDN**: Lưu trữ và phân phối hình ảnh
- **Image Optimization**: Lazy loading, optimization

## 🌐 Mục Tiêu Phát Triển & Định Hướng Tương Lai

- Tích hợp mobile app (React Native / Flutter).
- Tối ưu SEO và crawling dữ liệu.
- Hỗ trợ AI gợi ý truyện theo sở thích.
- Tối ưu hiệu suất tải ảnh chương và CDN.
- Tích hợp gateway thanh toán VNPay và Stripe.
