import "./globals.css";

export const metadata = {
  title: "Mimart",
  description: "Toko online terpercaya untuk produk berkualitas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
