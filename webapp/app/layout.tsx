import "./globals.css";
import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export const metadata: Metadata = {
  title: "Factoría SDD · Naturgy",
  description:
    "Plataforma agéntica para construir software con IA. De la idea al despliegue, con 17 agentes especializados.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-bg text-fg">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
