import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

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
              <Button variant="link">
                <Link href="/todo" className="mr-3">
                  Todos
                </Link>
              </Button>
            </li>
            <li className="mr-3">
              <UserButton afterSignOutUrl="/" />
            </li>
            <li>
              {user.isSignedIn ? (
                <SignOutButton>
                  <Button variant="secondary">Sign out</Button>
                </SignOutButton>
              ) : (
                <SignInButton>
                  <Button variant="secondary">Sign in!</Button>
                </SignInButton>
              )}
            </li>
          </ul>
        </div>
      </nav>
      <div className="container flex w-screen items-center justify-end gap-12 px-4"></div>
      <h1 className="text-center text-5xl font-extrabold tracking-tight text-primary drop-shadow-xl sm:text-[5rem]">
        {pageTitle}
      </h1>
    </>
  );
};
