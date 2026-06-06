import "../index.css";
import { AuthProvider } from "@/components/auth/AuthContext";

export const metadata = {
  title: "Campus Study Group Finder",
  description: "Find, create, and manage UCI study groups.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Skip link for keyboard users to bypass repeated nav */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
