import * as React from "react";
import Link from "next/link";
import { Bars4Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

export default function Navbar() {
  const [state, setState] = React.useState(false);
  const user = useUser();

  return (
    <nav className="w-full border-b bg-white md:border-0">
      <div className="mx-auto max-w-screen-xl items-center px-4 md:flex md:px-8">
        <div className="flex items-center justify-between py-3 md:block md:py-5">
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
          <div className="md:hidden">
            <button
              className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400"
              onClick={() => setState(!state)}
            >
              <span className="block w-9 cursor-pointer hover:text-red-400">
                <Bars4Icon className="h-full w-full opacity-70" />
              </span>
            </button>
          </div>
        </div>
        <div
          className={`mt-8 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="items-center justify-end space-y-8 md:flex md:space-x-6 md:space-y-0">
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
            <form className="flex items-center  space-x-2 rounded-md border p-2">
              <span className="block w-5 cursor-pointer hover:text-red-400">
                <MagnifyingGlassIcon className="h-full w-full opacity-70" />
              </span>
              <input
                className="w-full appearance-none text-gray-500 placeholder-gray-500 outline-none sm:w-auto"
                type="text"
                placeholder="Search"
              />
            </form>
          </ul>
        </div>
      </div>
    </nav>
  );
}
