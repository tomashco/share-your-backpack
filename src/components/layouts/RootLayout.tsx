import Head from "next/head";

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
      <main
        className="background-color: rgb(178, 172, 136); 
        background-image: radial-gradient(at 2% 8%,
          rgb(178, 172, 136) 0, transparent 74%), radial-gradient(at 37% 77%, rgb(212, 212, 212) 0, transparent 82%), radial-gradient(at 86% 40%, rgb(226, 232, 240) 0, transparent 66%), radial-gradient(at 22% 32%, rgb(250, 232, 255) 0, transparent 47%), radial-gradient(at 13% 3%, rgb(67, 56, 202) 0, transparent 22%), radial-gradient(at 6% 16%, rgb(71, 85, 105) 0, transparent 79%); flex min-h-screen flex-col items-center
      "
      >
        <div> {children}</div>
      </main>
    </section>
  );
}
