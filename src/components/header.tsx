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
import { Input } from "./ui/input";

export const Header = ({ pageTitle }: { pageTitle: ReactNode }) => {
  const user = useUser();

  return (
    <div className=" flex flex-col items-center justify-center gap-12 px-4 pb-16 pt-4 ">
      <nav className="flex w-full justify-between">
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
        <div id="pages-links">
          <ul>
            <li>
              <Button variant="link">
                <Link href="/todo">Todos</Link>
              </Button>
            </li>
          </ul>
        </div>
        <div id="navbar-default">
          <ul className="flex items-center justify-end space-x-3 font-medium">
            <li>
              <Input placeholder="search" />
            </li>
            <li>
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
    </div>
  );
};
