import { type RouterOutputs, api, displayError } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import RootLayout from "@/components/layouts/RootLayout";
import { LoadingSpinner } from "@/components/loading";
import { useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { type Post } from "@prisma/client";
import Image from "next/image";
import { Header } from "@/components/header";
import PageLayout from "@/components/layouts/PageLayout";
import { useToast } from "@/components/ui/use-toast";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const emptyPost: Post = {
  id: "",
  createdAt: new Date(),
  content: "",
  authorId: "",
};

export default function TodoPage() {
  const { data: posts } = api.posts.getAll.useQuery();
  const [editPostId, setEditPostId] = useState("");
  const ctx = api.useContext();
  const user = useUser();
  const { toast } = useToast();

  const { mutate: deletePost } = api.posts.delete.useMutation({
    onSuccess: () => {
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => displayError(e, toast),
  });

  const CreatePostWizard = ({ post = emptyPost }: { post?: Post }) => {
    const user = useUser();
    const [input, setInput] = useState("");
    const ctx = api.useContext();

    const onSuccess = () => {
      setInput("");
      setEditPostId("");
      void ctx.posts.getAll.invalidate();
    };

    const { mutate: createPost, isLoading: isPosting } =
      api.posts.create.useMutation({
        onSuccess,
        onError: (e) => {
          const errorMessage = e.data?.zodError?.fieldErrors.content;
          if (errorMessage?.[0]) {
            toast({
              description: errorMessage[0],
              variant: "destructive",
            });
          } else {
            toast({
              description: "Failed to post! Please try again later.",
              variant: "destructive",
            });
          }
        },
      });

    const { mutate: editPost, isLoading: isEditing } =
      api.posts.edit.useMutation({
        onSuccess,
        onError: (e) => {
          const errorMessage = e.data?.code;
          if (errorMessage) {
            toast({
              description: errorMessage,
              variant: "destructive",
            });
          } else {
            toast({
              description: "Failed to delete! Please try again later.",
              variant: "destructive",
            });
          }
        },
      });

    if (!user.isSignedIn) return null;

    const disabled = isPosting || isEditing;

    return (
      <div className="mb-6">
        <div className="flex w-96">
          <input
            type="text"
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder={post.content}
            id="large-input"
            className="sm:text-md block w-72 rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          />
          <button
            className="ml-3 w-24 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() =>
              post.id
                ? editPost({ id: post.id, content: input })
                : createPost({ content: input })
            }
            disabled={disabled}
          >
            {disabled ? <LoadingSpinner size={20} /> : "Post"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <RootLayout>
      <Header pageTitle={<span className="text-sagegreen">Todos</span>} />
      <PageLayout>
        <div className="text-2xl text-primary">
          {!editPostId && <CreatePostWizard />}
          {posts ? (
            <ul>
              {posts.map((props: PostWithUser) => {
                const { post, author } = props;
                return (
                  <div key={post.id}>
                    <li className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        {author.id !== user?.user?.id &&
                          author.profileImageUrl && (
                            <div className="relative m-2 h-6 w-6">
                              <Image
                                className="rounded-full"
                                src={author.profileImageUrl}
                                alt="profile photo"
                                layout={"fill"}
                                objectFit={"contain"}
                              />
                            </div>
                          )}
                        {post.authorId === user?.user?.id && (
                          <span
                            onClick={() => deletePost({ id: post.id })}
                            className="m-2 block w-6 cursor-pointer hover:text-red-400"
                          >
                            <TrashIcon />
                          </span>
                        )}
                        <p>{post.content}</p>
                      </div>
                      {post.authorId === user?.user?.id && (
                        <span
                          onClick={() =>
                            setEditPostId(editPostId === post.id ? "" : post.id)
                          }
                          className="m-2 block w-6 cursor-pointer hover:text-red-400"
                        >
                          <PencilIcon />
                        </span>
                      )}
                    </li>
                    {post.id === editPostId && <CreatePostWizard post={post} />}
                  </div>
                );
              })}
            </ul>
          ) : (
            "No posts!"
          )}
        </div>
      </PageLayout>
    </RootLayout>
  );
}
