import { SignUp } from "@clerk/nextjs";
import RootLayout from "../../components/layouts/RootLayout";
import { Header } from "@/components/header";
import PageLayout from "@/components/layouts/PageLayout";

export default function Page() {
  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-sagegreen">Sign</span> up!
          </>
        }
      />
      <PageLayout>
        <div className="flex justify-center">
          <SignUp />
        </div>
      </PageLayout>
    </RootLayout>
  );
}
