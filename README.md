# MangaReader CMS (React + TypeScript + Vite)

Quản trị hệ thống đọc truyện tranh trực tuyến: quản lý truyện (books), chương (chapters), thể loại (categories), người dùng, đơn hàng và publisher. Frontend dùng React 19 + Vite, tuân thủ quy ước kiến trúc và code style trong `src/docs/`.

## Tính năng chính

- Authentication với JWT (login/register/forgot/reset, verify email, devices)
- Quản lý Users, Publishers, Books, Chapters, Categories
- Giỏ hàng, Orders, Subscriptions (theo API), Favorites
- Thông báo realtime (theo API), cài đặt notification
- Phân quyền: USER / ADMIN / PUBLISHER

Xem chi tiết API và dữ liệu:

- `src/docs/API_ENDPOINT.json` — Danh sách endpoint và schemas
- `src/docs/PROJECT_SUMMARY.md` — Tóm tắt nghiệp vụ, kiến trúc, thực thể
- `src/docs/CODE_RULES.md` — Quy tắc kỹ thuật, cấu trúc, commit

## Tech stack

- React 19, TypeScript (~5.9), Vite 7
- Router: `@tanstack/react-router`
- State: `zustand`
- UI/Styling: Tailwind CSS 4, Radix Slot, tw-animate-css, lucide-react
- Data/Validation: axios, zod, date-fns, react-hook-form resolvers
- Linting: ESLint 9, typescript-eslint, react-hooks, react-refresh

## Yêu cầu môi trường

- Node.js >= 18
- PNPM/NPM (dự án dùng npm scripts)
- Biến môi trường (nếu dùng axios instance): `VITE_API_BASE_URL`

## Bắt đầu

```bash
npm install
npm run dev        # Chạy dev server (Vite)
npm run build      # Build production (tsc -b + vite build)
npm run preview    # Preview build
npm run lint       # Chạy ESLint
```

Dev server mặc định chạy trên `http://localhost:5173` (theo Vite).

## Cấu trúc thư mục

```text
src/
  app/
    providers.tsx
    router.tsx
    store.ts
  assets/
  components/
    ui/
  features/
    book/
    dashboard/
    user/
  hooks/
  lib/
  docs/
    API_ENDPOINT.json
    CODE_RULES.md
    PROJECT_SUMMARY.md
  main.tsx
```

Nguyên tắc quan trọng (theo CODE_RULES):

- API calls thực hiện ở Main Components (pages), không thực hiện trong child components; dữ liệu chảy top-down.
- Mỗi feature tự quản lý `components/`, `hooks/`, `services/`, `types.ts` và export qua `index.ts`.
- Dùng absolute import với alias `@` trỏ tới `src/`.

## Cấu hình Axios

Theo `src/docs/CODE_RULES.md`, dự án dùng một axios instance chuẩn hoá tại `lib/axios.ts` (base URL từ ENV, retry 500s, qs, timeout 72s, JSON). Nếu file này chưa có, hãy tạo theo mô tả trong docs để thống nhất cấu hình mạng.

## Routing

Sử dụng `@tanstack/react-router` cho điều hướng. Devtools (chỉ dev) có trong `@tanstack/router-devtools`.

## State Management

Global cross-feature state đặt tại `src/app/store.ts` (Zustand). State theo tính năng đặt trong từng feature.

## Styling

Tailwind CSS 4 + `@tailwindcss/vite`. Ưu tiên component nhỏ, tái sử dụng; UI chung ở `components/ui`, UI đặc thù để trong từng feature.

## Commit & chất lượng

- Conventional Commits (ví dụ: `feat: ...`, `fix: ...`, `refactor: ...`, `style: ...`)
- Chạy `npm run lint` trước khi push.

## Backend & dữ liệu

Backend API đã có sẵn (xem `API_ENDPOINT.json`). Các thực thể chính: User, Book, Chapter, Category, Orders/OrderItem, Favorite, Notification, Subscription, BankInfo... và các enum đi kèm (Role, Status, v.v.).

- Review: chỉ đọc (read-only) và được hiển thị trong trang chi tiết Book (book detail).

## Ghi chú Context 7

Dự án áp dụng Context 7 để tham chiếu tài liệu kỹ thuật một cách có hệ thống. Khi phát triển, ưu tiên:

- Tra cứu trong `src/docs/` (Context nội bộ)
- Đồng bộ conventions từ `CODE_RULES.md`
- Căn cứ API từ `API_ENDPOINT.json`

## Roadmap ngắn

- Tích hợp cổng thanh toán (VNPay/Stripe) theo định hướng trong docs
- Hoàn thiện Notifications realtime
- Tối ưu SEO, chất lượng ảnh/chương và CDN
