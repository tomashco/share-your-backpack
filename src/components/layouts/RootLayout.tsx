import Head from "next/head";
import { Toaster } from "../ui/toaster";
import { env } from "@/env.mjs";

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
      <main className="h-screen">{children}</main>
      <Toaster />
    </section>
  );
}
