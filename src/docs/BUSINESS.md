# BUSINESS LOGIC OVERVIEW / TỔNG QUAN NGHIỆP VỤ

## Tiếng Việt

### 1. Vai trò & luồng quyền hạn

- Phân tách rõ User, Admin, Publisher; frontend CMS hiện tập trung cho Admin, tương thích enum trong API.
- Người dùng cuối đăng ký/đăng nhập qua JWT (hoặc Google OAuth), có thể trở thành Publisher sau khi được duyệt.
- Admin chỉ xem, duyệt và bảo trì nội dung; tạo/sửa truyện thuộc trách nhiệm Publisher (theo CODE_RULES).

### 2. Quản lý truyện (Books)

- `BookList` cung cấp bảng có tìm kiếm, lọc danh mục, trạng thái, sắp xếp (latest/top_rated/most_viewed/price) và phân trang đồng bộ với `/books`.
- `BookDetail` hiển thị metadata, giá (bao gồm logic miễn phí, giảm giá), chính sách, thống kê (chapters/revenue/reviews/rating) và danh sách chương có phân trang nội bộ.
- Publisher tạo truyện mới, gửi request lên Admin; chỉ khi Admin duyệt/publish thì truyện mới ra mắt. Publisher vẫn toàn quyền chỉnh sửa nội dung, xem dashboard số liệu (doanh thu, lượt mua, lượt đọc, lượt thích).
- Admin chỉ thay đổi trạng thái duyệt (publish/reject/archive) và xem thống kê/metadata; không được cập nhật nội dung hay thông tin chi tiết của truyện.
- Quy tắc giá: nếu `isFree` thì giá = 0 và tắt sale; nếu `isOnSale` thì giá cuối = `price * (1 - salePercent/100)` và salePercent luôn ≥ 0.
- Form tạo/sửa (`BookForm`) áp dụng auto-slug theo tiêu đề, cảnh báo khi rời trang, upload ảnh/đính kèm policy (PDF/Word <10MB). Category chọn đa chọn, có gợi ý nhanh.
- Giao diện hỗ trợ điều hướng tới tạo mới, chỉnh sửa, xem chương; thao tác xóa và delete chapter còn TODO (placeholder message).

### 3. Quản lý chương (Chapters)

- `BookDetail` và `ChapterDetail` (file 599 dòng) cho phép xem trạng thái chương (PENDING/DRAFT/PUBLISHED/ARCHIVED), đánh dấu miễn phí, cập nhật giá/sale.
- `chapterService` kết nối `/chapters/{bookSlug}/{chapterSlug}` để đọc/sửa nội dung; nội dung chương là mảng URL ảnh (CDN). Mọi chỉnh sửa từ hook `useChapterDetail`.
- Business rule: chương chỉ được bán kèm sách, nhưng vẫn có cờ giá riêng để phục vụ preview hoặc hiển thị doanh thu theo chương.

### 4. Danh mục (Categories)

- `CategoriesPage` hiển thị danh sách với thumbnail, slug, mô tả, timestamps; hook `useCategories` gọi `/category` và `categoryService.updateCategory`.
- Hỗ trợ điều hướng tới trang tạo/sửa danh mục; thao tác xóa đang chờ triển khai (console TODO).

### 5. Người dùng & phê duyệt Publisher

- `UserPage` cho phép lọc theo tên/email, vai trò, trạng thái tài khoản; bảng thể hiện provider (Google), ngày tạo.
- Modal chỉnh sửa cập nhật username + avatar (upload FormData) thông qua `/admin/user/{id}`; modal xóa xác nhận rồi gọi DELETE.
- Luồng tin nhắn sử dụng `message` từ Antd để phản hồi thành công/thất bại; mọi gọi API nằm trong `useUsers` + `userService` để giữ logic tập trung.

### 6. Đơn hàng & thanh toán

- `OrderPage` dùng `useOrders` kết nối `/api/orders`; hỗ trợ tìm kiếm theo mã/email, lọc trạng thái (PENDING/PAID/COMPLETED/…) và phương thức thanh toán (BANK_TRANSFER/CREDIT_CARD/E_WALLET).
- Modal chi tiết trình bày người mua, tổng tiền, trạng thái, lịch sử thanh toán và bảng con cho `orderItems` (bao gồm giá gốc/giảm, đã đọc).
- Modal hủy đơn gửi PUT `/api/orders/{id}/cancel` kèm lý do; chỉ hiển thị với đơn `PENDING`.
- `orderService` chuẩn hóa việc đọc/ghi, đảm bảo pagination từ backend được map lại UI.

### 7. Dashboard & giám sát

- `DashboardPage` tổng hợp KPI cards, biểu đồ Recharts (dữ liệu tạm thời qua `useChartData`), danh sách đơn gần đây, top sách, thông báo nhanh, checklist công việc.
- Cung cấp segmented control cho Week/Month/Year; dữ liệu sẽ thay bằng API thống kê thật trong tương lai.
- Các thẻ hành động nhanh (tạo sách, tạo chương, xem báo cáo) giúp điều hướng sang các module chính.

### 8. Các module khác & kế hoạch mở rộng

- `content`, `ecommerce`, `notifications`, `settings` hiện là placeholder với `Empty` nhưng mô tả rõ phạm vi tương lai (quản lý media, cài đặt thông báo, cấu hình hệ thống…).
- API docs liệt kê sẵn endpoints cho Cart, Favorite, Subscription, Publisher revenue, Notification settings... dù UI chưa dựng; BUSINESS.md ghi nhận để định hướng roadmap.
- Toàn bộ component tuân thủ quy tắc: API gọi trong hook/service, component hiển thị dữ liệu và kích hoạt events.

### 9. Kết nối API & kỹ thuật chung

- Axios instance (`lib/axios`) cấu hình baseURL, retry, timeout, header JSON; mọi service trả về `CustomResponse` với `success/data/pagination`.
- Hook `useBlocker` trong form ngăn thoát khi chưa lưu; `generateSlug`, `formatCurrency`, `formatDate` đảm bảo chuẩn hóa hiển thị.
- Business guarantee từ CODE_RULES: mua theo book, admin không tự tạo nội dung; file này phản ánh lại để đội phát triển nắm chung.

---

## English

### 1. Roles & authorization

- The platform separates User, Admin, Publisher, Moderator; the CMS UI currently serves Admin/Publisher while staying aligned with the backend enums.
- End users authenticate via JWT (or Google OAuth) and can request publisher access; admins focus on oversight rather than creating content themselves.
- Business rule: books/chapters are owned by publishers, admins mainly review stats and approvals.

### 2. Book management

- `BookList` offers search, category/status filters, multiple sort options (latest/top_rated/most_viewed/price/free) plus synced pagination against `/books`.
- `BookDetail` surfaces metadata, pricing logic (free vs discount), policy text, stats (chapter count, revenue, reviews, rating) and a paginated chapter list with deep links.
- Publishers create books and submit them for admin approval; the title only goes live after the admin publishes it. Publishers retain full control over metadata edits and can monitor KPIs (total revenue, purchases, reads, likes).
- Admins can only update the approval status (publish/reject/archive) and inspect stats; they cannot modify any book content fields.
- Pricing rules: `isFree` forces price 0 and disables sale; when `isOnSale` the final price is `price * (1 - salePercent/100)` with guarded percent values.
- `BookForm` auto-generates slug, warns about unsaved changes, handles thumbnail upload + policy attachment (PDF/Word <10MB) and multi-select categories with quick suggestions.
- Navigation buttons lead to create/edit/chapter detail routes; delete actions remain TODO placeholders for now.

### 3. Chapter management

- `BookDetail` + `ChapterDetail` render chapter metadata, free/paid flags, statuses (PENDING/DRAFT/PUBLISHED/ARCHIVED) and allow updates through `chapterService`.
- Chapter payloads align with `/chapters/{bookSlug}/{chapterSlug}`, storing content as ordered image URLs (CDN-backed).
- Even though chapters aren’t sold separately in the CMS, per-chapter pricing fields support preview chapters and reporting.

### 4. Categories

- `CategoriesPage` lists categories with thumbnail, slug, description and timestamps; `useCategories` wraps `/category` fetches and exposes `updateCategory`.
- UI includes navigation to create/edit views; delete is planned (currently console TODO).

### 5. Users & publisher approvals

- `UserPage` filters by keyword, role, account status; table columns surface OAuth provider, active device count, creation date.
- Edit modal updates username + avatar via multipart PUT `/admin/user/{id}`; delete modal confirms before sending DELETE.
- Hooks (`useUsers`) manage pagination, server errors, and trigger Ant Design toast feedback.

### 6. Orders & payments

- `OrderPage` consumes `/api/orders` with filters for status and payment method; table exposes totals, payment dates, and action buttons.
- Detail modal reveals purchaser info plus a nested table of `orderItems`; cancel modal sends PUT `/api/orders/{id}/cancel` (only for `PENDING` orders) with a required reason.
- `orderService` centralizes HTTP calls; pagination metadata from the backend is mirrored into the table controls.

### 7. Dashboard & monitoring

- `DashboardPage` combines KPI cards, Recharts-based revenue trend (fed by `useChartData` mock data), recent orders, top books, alert feed, and task checklist.
- Segmented control switches between week/month/year views; placeholders highlight where real analytics endpoints will plug in.
- Quick-action buttons drive users toward core workflows (create book, add chapter, view revenue report).

### 8. Other modules & roadmap

- `content`, `ecommerce`, `notifications`, `settings` currently show `Empty` states but document their intended scope (media CMS, store/payments, notification settings, platform configs).
- API docs already define Cart, Favorite, Subscription, Publisher revenue, Notification settings, etc.; this BUSINESS file records those domains for future sprints even if UI isn’t built.
- Architectural rule: components stay presentation-focused while hooks/services own side effects and API calls.

### 9. API integration & shared behaviors

- Shared Axios client handles retries, serialization, 72s timeout, JSON headers; services return `CustomResponse` objects for consistent error/pagination handling.
- Utilities (`generateSlug`, `formatCurrency`, `formatDate`) keep formatting consistent; `useBlocker` prevents data loss in long forms.
- Core guarantees from `CODE_RULES` (book-level purchases, admin as reviewer) are reiterated here so every contributor aligns on business intent.
