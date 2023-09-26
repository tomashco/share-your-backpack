import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

export const Header = ({ pageTitle }: { pageTitle: ReactNode }) => {
  const user = useUser();

  return (
    <>
      <nav className="flex w-screen justify-between px-9">
        <Link href="/" className="flex items-center">
          <Image
            width={35}
            height={128}
            src="/backpack.png"
            className="mr-3 h-8"
            alt="sharepack logo"
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            SharePack
          </span>
        </Link>
        <div className=" w-full" id="navbar-default">
          <ul className="flex items-center justify-end font-medium">
            <li>
              <Link href="/todo" className="mr-3">
                Todos
              </Link>
            </li>
            <li className="mr-3">
              <UserButton afterSignOutUrl="/" />
            </li>
            <li>
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
            </li>
          </ul>
        </div>
      </nav>
      <div className="container flex w-screen items-center justify-end gap-12 px-4"></div>
      <h1 className="text-primary text-center text-5xl font-extrabold tracking-tight drop-shadow-xl sm:text-[5rem]">
        {pageTitle}
      </h1>
    </>
  );
};
