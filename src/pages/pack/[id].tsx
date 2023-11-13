import type { GetStaticProps, NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { type PackItem } from "@prisma/client";
import PageLayout from "@/components/layouts/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

enum sortCriteria {
  category = "category",
  location = "location",
}

const SinglePackPage: NextPage<{ id: string }> = ({ id }) => {
  const [selectedSort, setSelectedSort] = useState(sortCriteria.category);
  const { data } = api.packs.getById.useQuery({
    id,
  });
  const user = useUser();
  const isEditable = data?.authorId === user?.user?.id;
  const categories = Array.from(
    new Set(data?.packItems.map((item) => item.category)),
  );
  const locations = Array.from(
    new Set(data?.packItems.map((item) => item.location)),
  );
  const { toast } = useToast();
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../../components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );
  if (!data) {
    if (typeof window !== "undefined") void router.push("/");
    return;
  }

  const allSorts = {
    category: categories,
    location: locations,
  };
  const { data: s3Objects } = api.s3.getObjects.useQuery({
    packId: id,
  });

  const titleArray = data?.name.split(" ");

  const ItemData = ({ item }: { item: PackItem }) => (
    <div>
      <p className="flex ">{item.name}</p>
    </div>
  );

  const itemsByView = (selSort: sortCriteria) =>
    allSorts[selSort]?.map((sortName) => (
      <div key={sortName}>
        <h1 className="drop-shadow-l text-xl font-extrabold text-primary">
          {sortName ? sortName : "TBD"}
        </h1>
        {data.packItems
          .filter((el) => el[selSort] === sortName)
          .map((item) => (
            <ItemData key={item.id} item={item} />
          ))}
      </div>
    ));

  const onTabsClick = () =>
    setSelectedSort(
      selectedSort === sortCriteria.category
        ? sortCriteria.location
        : sortCriteria.category,
    );

  return (
    <RootLayout>
      <Header
        pageTitle={
          <>
            <span className="text-sagegreen">{titleArray[0]}</span>
            &nbsp;
            {titleArray.splice(1).join(" ")}{" "}
          </>
        }
      />
      <PageLayout>
        {isEditable && (
          <div className="flex justify-end">
            <Button
              className="my-3"
              variant={"secondary"}
              onClick={() => router.push(`${id}/edit`)}
            >
              Edit Pack
            </Button>
          </div>
        )}
        {s3Objects?.[0]?.Key && <Map packId={s3Objects[0]?.Key} />}
        <p>{data.description}</p>
        <Tabs defaultValue={selectedSort} onClick={onTabsClick}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value={sortCriteria.category}>
                Category View
              </TabsTrigger>
              <TabsTrigger value={sortCriteria.location}>
                Location View
              </TabsTrigger>
            </TabsList>
            <Button
              className="my-3"
              onClick={() => {
                void navigator.clipboard.writeText(window.location.href);
                toast({
                  description: "Pack copied to clipboard!",
                });
              }}
            >
              Share the backpack!
            </Button>
          </div>
          <TabsContent value={sortCriteria.category}>
            {itemsByView(sortCriteria.category)}
          </TabsContent>
          <TabsContent value={sortCriteria.location}>
            {itemsByView(sortCriteria.location)}
          </TabsContent>
        </Tabs>
      </PageLayout>
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
