# Event Labs

Event Labs, etkinlik listeleme, arama, bilet seçimi, sepet ve mock checkout akışlarını içeren bir Next.js Pages Router projesidir.

## 🚀 Canlı Demo

Projenin canlı haline aşağıdaki bağlantıdan ulaşabilirsiniz:

[![Live Demo](https://img.shields.io/badge/Demo-Live_Preview-success?style=for-the-badge&logo=vercel)](https://eventlabs.furkanleba.com)

👉 [eventlabs.furkanleba.com](https://eventlabs.furkanleba.com)

## Kurulum

```bash
pnpm install
pnpm dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

Production build'i ve testler:

```bash
pnpm lint
pnpm test:run
pnpm build
```

## Kullanılan Teknolojiler

- Next.js 16 Pages Router
- TypeScript
- Tailwind CSS 4
- Redux Toolkit
- Redux Persist
- React Hook Form
- Zod
- Vitest ve Testing Library

## Tamamlanan Maddeler

- Next.js Pages Router, TypeScript, Tailwind ve Redux Toolkit kullanıldı.
- `components`, `services`, `store`, `types`, `hooks` klasörleriyle modüler yapı kuruldu.
- Ana sayfada etkinlik listesi için loading, error ve empty durumları eklendi.
- `/event/[slug]` detay sayfası oluşturuldu.
- Arama alanında minimum 3 karakter, 300 ms debounce ve `AbortController` ile istek iptali uygulandı.
- Service katmanı oluşturuldu.
- Birden fazla Next.js API Route eklendi: `/api/events`, `/api/events/search`, `/api/events/[slug]`, `/api/events/featured`, `/api/login`, `/api/logout`, `/api/checkout/complete`.
- Login akışı Redux auth state ile yönetiliyor ve Redux Persist ile localStorage'da saklanıyor.
- `/profile` sayfası sidebar layout ile oluşturuldu ve auth cookie üzerinden proxy koruması eklendi.
- 3 adımlı checkout formu ve mock complete endpoint eklendi.

## Bonus Maddeler

- Basit bilet/sepet seçimi ve adet yönetimi eklendi.
- Bilet tipi, kategori ve blok seçiminde kademeli dropdown kullanıldı.
- Şehir filtresi localStorage'da saklanıyor. eventler mock data olduğu için gerçek bir filterdan ziyade basit bir client side filter olarak kullandım.
- Kategori filtresi URL tabanlı `/category/[categoryName]` routeu ile çalışıyor.
- Sepet reducer ve etkinlik detay bileti ekleme akışı için unit testler eklendi.

## Demo Bilgileri

Login için demo kullanıcı:

- Email: `demo@eventlab.com`
- Şifre: `123456`

## Data

Etkinlik verileri `src/data/events.json` dosyasındadır. API Route'lar bu mock data üzerinden cevap döner.

## AI Kullanımı

Projede AI desteği; proje kriterlerinin kontrolü, README düzenlemesi, küçük iyileştirmelerin belirlenmesi, unit testlerin implemantasyonu, redux store kurulumu ve teslim öncesi doğrulama komutlarının yorumlanması için kullanıldı.

## Ek Notlar

- `pnpm test:run`, `pnpm lint` ve `pnpm build` komutları başarılı çalışır.
- Login endpoint'i mock olarak 3 saniyelik gecikmeyle cevap verir; bu gecikme loading durumunu göstermek içindir.
