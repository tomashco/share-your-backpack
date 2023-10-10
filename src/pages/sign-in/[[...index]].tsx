import { SignIn } from "@clerk/nextjs";
import RootLayout from "../../components/layouts/RootLayout";
import { Header } from "@/components/header";
import PageLayout from "@/components/layouts/PageLayout";

export default function Page() {
  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-sagegreen">Sign</span> in!
          </>
        }
      />
      <PageLayout>
        <div className="flex justify-center">
          <SignIn />
        </div>
      </PageLayout>
    </RootLayout>
  );
}
