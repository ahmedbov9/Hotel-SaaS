import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { HotelProvider } from "@/providers/hotel-provider";
import { ConfirmDialogProvider } from "@/providers/confirm-dialog-provider";

export const metadata: Metadata = {
  title: "Hotel SaaS PMS",
  description: "Multi-tenant hotel property management system",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <HotelProvider>
            <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
          </HotelProvider>
        </AuthProvider>
      </body>
    </html>
  );
}