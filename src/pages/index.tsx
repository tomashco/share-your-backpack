import Link from "next/link";

import { api } from "@/utils/api";
import {
  UserButton,
  useUser,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import RootLayout from "@/components/layout";
import { LoadingSpinner } from "@/components/loading";
import { useState } from "react";

export default function Home() {
  const { data: posts } = api.posts.getAll.useQuery();

  console.log(posts);

  const Header = () => {
    const user = useUser();
    return (
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
    );
  };

  const CreatePostWizard = () => {
    const user = useUser();
    const [input, setInput] = useState("");
    const ctx = api.useContext();

    const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
      onSuccess: () => {
        setInput("");
        void ctx.posts.getAll.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage?.[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to post! Please try again later.");
        }
      },
    });

    console.log("user should be undefined: ", user);
    if (!user.isSignedIn) return null;

    return (
      <div className="mb-6">
        <label
          htmlFor="large-input"
          className="text-primary mb-2 block text-sm font-medium"
        >
          Add a new post
        </label>
        <input
          type="text"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          id="large-input"
          className="sm:text-md block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        />
        {input !== "" && !isPosting && (
          <button
            onClick={() => mutate({ content: input })}
            disabled={isPosting}
          >
            Post
          </button>
        )}
        {isPosting && (
          <div className="flex items-center justify-center">
            <LoadingSpinner size={20} />
          </div>
        )}
      </div>
    );
  };

  return (
    <RootLayout>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <Header />
        <h1 className="text-primary text-5xl font-extrabold tracking-tight drop-shadow-xl sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Share</span> Your Backpack
        </h1>
        <div className="text-primary text-2xl">
          <CreatePostWizard />
          {posts ? (
            <ul>
              {posts.map((post) => (
                <li key={post.id}>{post.content}</li>
              ))}
            </ul>
          ) : (
            "No posts!."
          )}
        </div>
      </div>
    </RootLayout>
  );
}
