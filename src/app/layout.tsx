import "../index.css";

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
