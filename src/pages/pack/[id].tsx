import type { GetStaticProps, NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import {
  AddPackItemsForm,
  UpdatePackForm,
  UpdatePackItemForm,
} from "@/components/PackForm";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";

const SinglePackPage: NextPage<{ id: string }> = ({ id }) => {
  const [editItem, setEditItem] = useState("");
  const [editTitle, setEditTitle] = useState(false);
  const { data } = api.packs.getById.useQuery({
    id,
  });
  const user = useUser();
  const ctx = api.useContext();
  const isEditable = data?.authorId === user?.user?.id;

  const { mutate: deletePackItem } = api.packs.deletePackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.code;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete! Please try again later.");
      }
    },
  });

  // use Escape to close the Edit Item or edit Title
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setEditItem("");
        if (editTitle) setEditTitle(false);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [editTitle]);

  if (!data) return <div>404</div>;

  const titleArray = data?.name.split(" ");

  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            {editTitle ? (
              <div>
                <UpdatePackForm
                  id={id}
                  oldName={data.name}
                  action={() => setEditTitle(false)}
                />
              </div>
            ) : (
              <div className="flex">
                <span className="text-[hsl(280,100%,70%)]">
                  {titleArray[0]}
                </span>
                &nbsp;
                {titleArray.splice(1).join(" ")}{" "}
                {isEditable && (
                  <span
                    onClick={() => setEditTitle(true)}
                    className="m-2 block w-16 cursor-pointer hover:text-red-400"
                  >
                    <Pencil2Icon className="h-full w-full opacity-70" />
                  </span>
                )}
              </div>
            )}
          </>
        }
      />
      {data.packItems?.map((item) => (
        <div key={item.id}>
          {editItem === item.id ? (
            <UpdatePackItemForm
              id={item.id}
              packId={id}
              oldName={item.name}
              action={() => setEditItem("")}
            />
          ) : (
            <p className="flex ">
              {isEditable && (
                <>
                  <span
                    onClick={() => deletePackItem({ packId: id, id: item.id })}
                    className="m-2 block w-6 cursor-pointer hover:text-red-400"
                  >
                    <TrashIcon />
                  </span>
                  <span
                    onClick={() =>
                      setEditItem(editItem === item.id ? "" : item.id)
                    }
                    className="m-2 block w-5 cursor-pointer hover:text-red-400"
                  >
                    <Pencil2Icon />
                  </span>
                </>
              )}
              {item.name}
            </p>
          )}
        </div>
      ))}
      {isEditable && <AddPackItemsForm id={id} oldItems={data.packItems} />}
    </RootLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.packs.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SinglePackPage;
