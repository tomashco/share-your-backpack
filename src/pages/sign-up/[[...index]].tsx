import { SignUp } from "@clerk/nextjs";
import RootLayout from "../../components/layout";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-[hsl(280,100%,70%)]">Sign</span> up!
          </>
        }
      />
      <div className="container flex justify-center">
        <SignUp />
      </div>
    </RootLayout>
  );
}
