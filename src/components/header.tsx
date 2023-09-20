import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { type ReactNode } from "react";

export const Header = ({ pageTitle }: { pageTitle: ReactNode }) => {
  const user = useUser();
  return (
    <>
      <div className="container flex w-screen items-center justify-end gap-12 px-4">
        <UserButton afterSignOutUrl="/" />
        {user.isSignedIn ? (
          <SignOutButton>
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Sign out
            </button>
          </SignOutButton>
        ) : (
          <SignInButton>
            <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
              Sign in!
            </button>
          </SignInButton>
        )}
      </div>
      <h1 className="text-primary text-center text-5xl font-extrabold tracking-tight drop-shadow-xl sm:text-[5rem]">
        {pageTitle}
      </h1>
    </>
  );
};
