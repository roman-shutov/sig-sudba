import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({ variable: '--font-display', subsets: ['cyrillic'], weight: ['500', '600', '700'] });
const sans = Manrope({ variable: '--font-sans', subsets: ['cyrillic'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://palitra-sudby-sig.supashutik.chatgpt.site'),
  title: 'СИГ',
  description: 'Интерактивный компас настоящего момента и 12 ступеней к себе.',
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], shortcut: '/favicon.svg' },
  openGraph: { title: 'СИГ', description: 'Твой компас уже внутри', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'СИГ', description: 'Твой компас уже внутри', images: ['/og.png'] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>; }
