import LoginPage from '@/components/LoginPage';
import MenuoIntro from '@/components/MenuoIntro';

export const metadata = {
  title: 'MENUO | Kurumsal Menü Yönetim Sistemi',
  description:
    'MENUO, kurumsal yemekhaneler için günlük ve haftalık menü, rezervasyon, geri bildirim ve anket süreçlerini tek yerden yöneten web uygulamasıdır.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'MENUO | Kurumsal Menü Yönetim Sistemi',
    description:
      'Günlük ve haftalık menüleri görüntüleyin, rezervasyon yapın, yemekleri puanlayın ve anketlere katılın. Yöneticiler için menü, rezervasyon ve raporlama paneli.',
    url: '/',
    siteName: 'MENUO',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function Page() {
  return (
    <>
      <LoginPage />
      <MenuoIntro />
    </>
  );
}
