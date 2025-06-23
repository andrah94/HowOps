import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black text-gray-100 min-h-screen">
      <header className="p-4 border-b border-gray-700">Brand</header>
      <section className="p-6">{children}</section>
    </div>
  );
}
