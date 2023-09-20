import RootLayout from "@/components/layout";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <RootLayout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Header
          pageTitle={
            <>
              <span className="text-[hsl(280,100%,70%)]">Share</span> Your
              Backpack
            </>
          }
        />
      </div>
    </RootLayout>
  );
}
