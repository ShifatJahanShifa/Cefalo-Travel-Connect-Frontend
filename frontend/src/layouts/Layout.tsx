import Header from './Header';
import Footer from './Footer';
import type { ReactNode } from 'react';
import AlertWindow from '../pages/alert';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <AlertWindow />  */}
      <main className="flex-grow bg-sky-50">{children}</main>
      <Footer />
    </div>
  );
}
