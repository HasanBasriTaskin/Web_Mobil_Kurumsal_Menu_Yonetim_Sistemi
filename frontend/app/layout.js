import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export const metadata = {
  metadataBase: new URL("https://corporatemenusystem.taskinnovation.net"),
  title: "MENUO | Kurumsal Menü Yönetim Sistemi",
  description: "Web ve Mobil Kurumsal Menü Yönetim Sistemi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" richColors expand={true} />
        </AuthProvider>
      </body>
    </html>
  );
}
