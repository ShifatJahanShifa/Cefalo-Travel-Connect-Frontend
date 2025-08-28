import Header from './Header';
import Footer from './Footer';
import type { ReactNode } from 'react';
import AlertWindow from '../pages/alert';
import { useAuth } from '../hooks/useAuth'
import { useProximity } from '../hooks/useProximity';

export default function Layout({ children }: { children: ReactNode }) {

  const { isAuthenticated } = useAuth()
  const { proximityEnabled } = useProximity()
  return (
     <div className="min-h-screen flex flex-col">
      {isAuthenticated ? (
        <>
          <Header />
          {proximityEnabled && <AlertWindow />}
          <main className="flex-grow bg-blue-50 mt-18">{children}</main>
          <Footer />
        </>
      ) : (
        <main className="flex-grow bg-blue-50">{children}</main>
      )}
    </div>
  );
}
