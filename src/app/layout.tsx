import "../index.css";
import { AuthProvider } from "@/components/auth/AuthContext";

export const metadata = {
  title: "Wireframes App",
  description: "Wireframes App migrated to Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
