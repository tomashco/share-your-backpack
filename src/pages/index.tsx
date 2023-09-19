import Link from "next/link";

import { api } from "@/utils/api";
import {
  UserButton,
  useUser,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import RootLayout from "../components/layout";

export default function Home() {
  const user = useUser();

  const { data: posts } = api.posts.getAll.useQuery();
  return (
    <RootLayout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="container flex items-center justify-center gap-12 px-4 ">
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
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Welcome in <span className="text-[hsl(280,100%,70%)]">Share</span>{" "}
          Your Backpack
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/usage/first-steps"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">First Steps →</h3>
            <div className="text-lg">
              Just the basics - Everything you need to know to set up your
              database and authentication.
            </div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://create.t3.gg/en/introduction"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Documentation →</h3>
            <div className="text-lg">
              Learn more about Create T3 App, the libraries it uses, and how to
              deploy it.
            </div>
          </Link>
        </div>
        <p className="text-2xl text-white">
          {posts ? (
            <ul>
              {posts.map((post) => (
                <li key={post.id}>{post.content}</li>
              ))}
            </ul>
          ) : (
            "No posts!."
          )}
        </p>
      </div>
    </RootLayout>
  );
}
