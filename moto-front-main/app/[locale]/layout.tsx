import { Header } from "@/components/Header/Header";
import "../globals.scss";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import {
  GENERAL_SETTINGS,
  HOME_PAGE_SEO,
  SERVICE_GROQ,
  client,
} from "@/lib/sanity";
import { ExternalScripts } from "@/components/ExternalScripts/ExternalScripts";
import { CartProvider } from "@/lib/cart";
import { CartDrawer } from "@/components/CartDrawer/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { locale } = await params;
  const generalSettings = await client.fetch<any>(
    HOME_PAGE_SEO(locale),
    {},
    { next: { revalidate: 60 } },
  );
  return {
    title: generalSettings?.seo?.title || "NakenMoto",
    description: generalSettings?.seo?.content || "Moto streetwear for naked bike riders",
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [settings, services] = await Promise.all([
    client.fetch<any>(GENERAL_SETTINGS(locale), {}, { next: { revalidate: 60 } }),
    client.fetch<any>(SERVICE_GROQ(locale), {}, { next: { revalidate: 60 } }),
  ]);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <CartProvider>
          <Header />
          {children}
          <Footer footer={settings?.footer} services={services || []} />
          <CartDrawer />
          <ExternalScripts cookieSettings={settings?.cookieSettings} nonce={""} />
        </CartProvider>
      </body>
    </html>
  );
}
