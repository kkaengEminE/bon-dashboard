import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: "BON Dashboard - 프로젝트 검토",
  description: "내부 프로젝트 검토 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
