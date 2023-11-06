import * as React from "react";
import Link from "next/link";
import { Bars4Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";

export default function Navbar() {
  const [state, setState] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const user = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const { refetch: searchPacks } = api.packs.search.useQuery(
    {
      value: searchValue,
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
    },
  );

  return (
    <nav className="w-full border-b bg-white bg-opacity-80 md:border-0">
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
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!searchValue) {
                  toast({
                    description: "Type a search value",
                    variant: "destructive",
                  });
                } else {
                  const results = await searchPacks();
                  if (results.status === "success" && results.data.length > 0) {
                    void router.push(`/search?value=${searchValue}`);
                  } else {
                    toast({
                      description: "No search results found!",
                      variant: "destructive",
                    });
                  }
                }
              }}
              className="flex items-center  space-x-2 rounded-md border p-2"
            >
              <span className="block w-5 cursor-pointer hover:text-red-400">
                <MagnifyingGlassIcon className="h-full w-full opacity-70" />
              </span>
              <input
                className="w-full appearance-none text-gray-500 placeholder-gray-500 outline-none sm:w-auto"
                type="text"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
            <li>
              <UserButton afterSignOutUrl="/" />
            </li>
            <li>
              {!user.isSignedIn && (
                <SignInButton>
                  <Button variant="secondary">Sign in!</Button>
                </SignInButton>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
