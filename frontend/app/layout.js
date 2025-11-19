import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

export const metadata = {
  title: "Kurumsal Menu Yönetim Sistemi",
  description: "Web ve Mobil Kurumsal Menu Yönetim Sistemi",
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
