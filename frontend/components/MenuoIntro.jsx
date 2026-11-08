const features = [
  {
    title: 'Günlük ve haftalık menüler',
    text: 'Çalışanlar bugünün ve haftanın menüsünü görür, geçmiş menülere ay bazında göz atar.',
  },
  {
    title: 'Menü rezervasyonu',
    text: 'Tek tıkla rezervasyon yapılır, gerektiğinde iptal edilir. Yöneticiler rezervasyonları takip eder.',
  },
  {
    title: 'Puan, yorum ve moderasyon',
    text: 'Kullanıcılar menülere puan ve yorum verir. Yöneticiler geri bildirimleri denetler ve yorumları moderasyondan geçirir.',
  },
  {
    title: 'Anketler',
    text: 'Yöneticiler anket oluşturur ve sonuçları görüntüler. Kullanıcılar aktif anketlere katılır.',
  },
  {
    title: 'Bildirimler',
    text: 'Okunmamış bildirimler uygulama içinde listelenir ve okundu olarak işaretlenebilir.',
  },
  {
    title: 'Yönetim paneli ve raporlama',
    text: 'Admin paneli menü yönetimi, oylama yönetimi, yorum moderasyonu, kullanıcı yönetimi, dashboard ve raporlama sunar.',
  },
];

const stack = [
  'Next.js 16 ve React 19',
  'Tailwind CSS 4, Radix UI ve Framer Motion',
  'React Hook Form ve Zod ile form doğrulama',
  '.NET 8 Web API ve Entity Framework Core',
  'MySQL veritabanı',
  'ASP.NET Core Identity ve JWT ile kimlik doğrulama',
  'Swagger / OpenAPI API dokümantasyonu',
];

export default function MenuoIntro() {
  return (
    <section
      aria-labelledby="menuo-intro-title"
      className="bg-white border-t border-gray-200 px-6 py-16"
    >
      <div className="max-w-4xl mx-auto">
        <h2 id="menuo-intro-title" className="text-3xl font-bold text-gray-900 mb-4">
          MENUO nedir? Kurumsal Menü Yönetim Sistemi
        </h2>
        <p className="text-gray-700 text-lg mb-4">
          MENUO, kurumların yemekhane menülerini dijital ortamda yönetmesi için geliştirilmiş web ve mobil uyumlu bir
          kurumsal menü yönetim sistemidir. Çalışanlar günlük menüleri görüntüler, rezervasyon yapar, yemekleri
          değerlendirir ve anketlere katılır. Yöneticiler ise menüleri, rezervasyonları, geri bildirimleri ve kullanıcıları
          tek bir panelden yönetir.
        </p>
        <p className="text-gray-700 mb-10">
          Uygulama, Taskinnovation tarafından geliştirilen bir web projesidir. Sistem iki rolle çalışır: yemekhane
          hizmetinden yararlanan kurum çalışanları (kullanıcı) ve menü ile süreçleri yöneten yetkililer (admin).
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Başlıca özellikler</h2>
        <ul className="grid gap-4 sm:grid-cols-2 mb-10">
          {features.map((f) => (
            <li key={f.title} className="rounded-xl border border-green-100 bg-green-50 p-5">
              <h3 className="font-semibold text-green-700 mb-1">{f.title}</h3>
              <p className="text-gray-700 text-sm">{f.text}</p>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Kimler için?</h2>
        <p className="text-gray-700 mb-10">
          MENUO, çalışanlarına kurumsal yemek menüsü sunan şirket ve kurumlar için tasarlandı. Çalışanlar yemek planını önceden
          görüp rezervasyon yapabilir, görüşlerini iletebilir. Yöneticiler ise rezervasyonları
          takip eder, geri bildirimlere göre menüyü iyileştirir ve raporlardan faydalanır.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">Kullanılan teknolojiler</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-10">
          {stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="text-gray-700 mb-10">
          Arayüz Vercel üzerinde, API ise Google Cloud Run üzerinde konteyner olarak yayınlanır; veriler Cloud SQL
          (MySQL) içinde tutulur.
        </p>

        <p className="text-gray-700">
          Bu proje Taskinnovation tarafından geliştirilmiştir. Diğer çalışmalar ve iletişim için{' '}
          <a
            href="https://taskinnovation.net"
            className="text-green-600 font-medium underline hover:text-green-700"
          >
            taskinnovation.net
          </a>{' '}
          adresini ziyaret edebilirsiniz. Giriş yapmak için yukarıdaki formu kullanabilirsiniz; demo için test
          kullanıcı bilgileri formun altında yer alır.
        </p>
      </div>
    </section>
  );
}
