import type { GetStaticProps, NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { UpdatePackItemForm } from "@/components/PackForm";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useUser } from "@clerk/nextjs";

const SinglePackPage: NextPage<{ id: string }> = ({ id }) => {
  const [editItem, setEditItem] = useState("");
  const { data } = api.packs.getById.useQuery({
    id,
  });
  const user = useUser();

  if (!data) return <div>404</div>;

  const titleArray = data.name.split(" ");

  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-[hsl(280,100%,70%)]">{titleArray[0]}</span>{" "}
            {titleArray.splice(1).join(" ")}
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
              {item.name}
              {data.authorId === user?.user?.id && (
                <span
                  onClick={() =>
                    setEditItem(editItem === item.id ? "" : item.id)
                  }
                  className="m-2 block w-5 cursor-pointer hover:text-red-400"
                >
                  <PencilIcon />
                </span>
              )}
            </p>
          )}
        </div>
      ))}
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
