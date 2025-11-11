import type { ReactNode } from "react";

type CardProps = {
  title: string;
  value: string;
  trend?: ReactNode;
};

function AnalyticCard({ title, value, trend }: CardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4 flex flex-col gap-2">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
      {trend ? <div className="text-xs text-muted-foreground">{trend}</div> : null}
    </div>
  );
}

function MiniBar({ value }: { value: number }) {
  return (
    <div className="h-24 w-full flex items-end gap-1">
      {Array.from({ length: 24 }).map((_, i) => {
        const height = Math.max(8, Math.min(96, (Math.sin(i / 2) + 1) * 40 + value));
        return <div key={i} className="w-2 rounded bg-primary/30" style={{ height }} />;
      })}
    </div>
  );
}

// Mock data (extracted)
const kpiCards: Array<{ title: string; value: string; trend: ReactNode }> = [
  { title: "Người dùng mới", value: "1,248", trend: <span>+8.2% so với tuần trước</span> },
  { title: "Doanh thu", value: "$12,480", trend: <span>+12.6% trong 30 ngày</span> },
  { title: "Sách xuất bản", value: "342", trend: <span>+14 sách trong tuần</span> },
  { title: "Đơn hàng", value: "1,902", trend: <span>-2.1% so với hôm qua</span> },
];

const recentOrders: Array<{ id: string; date: string; customer: string; amount: string; status: string }> = [
  { id: "ORD-92341", date: "11/03", customer: "Nguyễn An", amount: "$49.90", status: "PAID" },
  { id: "ORD-92340", date: "11/03", customer: "Trần Bình", amount: "$19.00", status: "PENDING" },
  { id: "ORD-92339", date: "11/02", customer: "Lê Chi", amount: "$120.00", status: "PAID" },
  { id: "ORD-92338", date: "11/02", customer: "Phạm Duy", amount: "$9.99", status: "REFUNDED" },
];

const topBooks: Array<{ title: string; sales: number }> = [
  { title: "Kiếm Sĩ Bất Bại", sales: 340 },
  { title: "Học Viện Phép Thuật", sales: 295 },
  { title: "Hành Tinh Đỏ", sales: 210 },
  { title: "Lữ Khách Thời Gian", sales: 190 },
  { title: "Bí Ẩn Rừng Sâu", sales: 175 },
];

const notificationsList: string[] = [
  "Sách 'Học Viện Phép Thuật' đã được phê duyệt.",
  "Có 12 đơn hàng mới trong hôm nay.",
  "Báo cáo doanh thu tháng đã sẵn sàng.",
  "2 chương mới vừa được đăng tải.",
];

const todoTasks: Array<{ label: string; done: boolean }> = [
  { label: "Cập nhật mô tả 3 sách", done: false },
  { label: "Phê duyệt yêu cầu publisher", done: false },
  { label: "Kiểm tra đơn hàng hoàn tiền", done: true },
  { label: "Xem thống kê người dùng", done: false },
];

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Heading + Description */}
      <section className="grid gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi số liệu chính, xu hướng theo thời gian và hoạt động gần đây của nền tảng.
        </p>
      </section>

      {/* Analytic Boxes */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <AnalyticCard key={k.title} title={k.title} value={k.value} trend={k.trend} />
        ))}
      </section>

      {/* Chart Section */}
      <section className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium">Hiệu suất tháng</h2>
            <p className="text-sm text-muted-foreground">Doanh thu và đơn hàng theo ngày</p>
          </div>
          <div className="text-sm text-muted-foreground">Tháng hiện tại</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <svg viewBox="0 0 600 240" className="w-full h-[240px]">
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="600" height="240" rx="8" className="fill-muted/30" />
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={i}
                  x1="24"
                  x2="576"
                  y1={40 + i * 40}
                  y2={40 + i * 40}
                  className="stroke-muted"
                  strokeDasharray="4 4"
                />
              ))}
              {/* Area line (dummy data) */}
              <path
                d="M24,180 C80,160 120,120 180,140 C240,160 280,80 340,110 C400,140 460,90 520,120 L520,200 L24,200 Z"
                fill="url(#area)"
              />
              <path
                d="M24,180 C80,160 120,120 180,140 C240,160 280,80 340,110 C400,140 460,90 520,120"
                className="stroke-primary"
                fill="none"
                strokeWidth="3"
              />
            </svg>
          </div>
          <div className="col-span-1">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground mb-2">Đơn hàng theo giờ</div>
              <MiniBar value={22} />
            </div>
          </div>
        </div>
      </section>

      {/* Extra sections */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Orders */}
        <div className="lg:col-span-2 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Đơn hàng gần đây</h3>
            <span className="text-sm text-muted-foreground">Xem tất cả</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2 pr-4">Mã</th>
                  <th className="py-2 pr-4">Ngày</th>
                  <th className="py-2 pr-4">Khách hàng</th>
                  <th className="py-2 pr-4">Số tiền</th>
                  <th className="py-2">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="py-2 pr-4 font-medium">{o.id}</td>
                    <td className="py-2 pr-4">{o.date}</td>
                    <td className="py-2 pr-4">{o.customer}</td>
                    <td className="py-2 pr-4">{o.amount}</td>
                    <td className="py-2">
                      <span
                        className="px-2 py-1 text-xs rounded"
                        data-status={o.status}
                        style={{
                          background: "hsl(var(--muted))",
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-3">Hành động nhanh</h3>
          <div className="grid gap-2">
            <button className="px-3 py-2 rounded-md border text-left hover:bg-muted transition">
              Tạo sách mới
            </button>
            <button className="px-3 py-2 rounded-md border text-left hover:bg-muted transition">
              Thêm chương mới
            </button>
            <button className="px-3 py-2 rounded-md border text-left hover:bg-muted transition">
              Xem báo cáo doanh thu
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Books */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-3">Sách nổi bật</h3>
          <ul className="grid gap-2 text-sm">
            {topBooks.map((b) => (
              <li key={b.title} className="flex items-center justify-between">
                <span className="truncate">{b.title}</span>
                <span className="text-muted-foreground">{b.sales} bán</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Notifications */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-3">Thông báo</h3>
          <ul className="grid gap-2 text-sm">
            {notificationsList.map((n, i) => (
              <li key={i} className="rounded-md border p-2 bg-muted/40">{n}</li>
            ))}
          </ul>
        </div>

        {/* Tasks */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-medium mb-3">Việc cần làm</h3>
          <ul className="grid gap-2 text-sm">
            {todoTasks.map((t) => (
              <li key={t.label} className="flex items-center gap-2">
                <input type="checkbox" checked={t.done} readOnly className="accent-primary" />
                <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}


