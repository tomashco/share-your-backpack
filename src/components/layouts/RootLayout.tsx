import Head from "next/head";
import { Toaster } from "../ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <Head>
        <title>Share Your Backpack</title>
        <meta
          name="description"
          content="Share what you bring during your trails!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
      <Toaster />
    </section>
  );
}
