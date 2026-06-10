import "./globals.css";

export const metadata = {
  title: "胡昊天 | 工程科研个人作品集",
  description: "胡昊天的机械设计、化学工程、强化沸腾传热、CFD 仿真与工程设计个人作品集。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
