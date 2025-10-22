import "./globals.css";

export const metadata = {
  title: "Kurumsal Menu Yönetim Sistemi",
  description: "Web ve Mobil Kurumsal Menu Yönetim Sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
