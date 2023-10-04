import type { GetStaticProps, NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";

const SinglePackPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.packs.getById.useQuery({
    id,
  });

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
      {data.packItems?.map((item) => <p key={item.id}>{item.name}</p>)}
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
