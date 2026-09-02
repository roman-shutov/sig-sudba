import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sigsystem.ru'),
  title: 'СИГ — Палитра Судьбы',
  description: 'Выберите фразу и цифры из подсознания. Получите Компас настоящего момента и откройте путь через 12 ступеней.',
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], shortcut: '/favicon.svg' },
  openGraph: { title: 'СИГ — Палитра Судьбы', description: 'Открой путь внутрь себя', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'СИГ — Палитра Судьбы', description: 'Открой путь внутрь себя', images: ['/og.png'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body>{children}</body></html>; }
