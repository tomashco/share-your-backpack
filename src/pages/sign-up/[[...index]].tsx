import { SignUp } from "@clerk/nextjs";
import RootLayout from "../../components/layout";

export default function Page() {
  return (
    <RootLayout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Sign up
        </h1>
        <SignUp />
      </div>
    </RootLayout>
  );
}
