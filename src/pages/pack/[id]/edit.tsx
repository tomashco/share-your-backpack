import type { GetStaticProps, NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { UpdatePackInfo, UpdatePackItemForm } from "@/components/PackForm";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import { type PackItem } from "@prisma/client";
import PageLayout from "@/components/layouts/PageLayout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { StandardDropzone } from "@/components/StandardDropzone";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

enum sortCriteria {
  category = "category",
  location = "location",
}

const SinglePackPage: NextPage<{ id: string }> = ({ id }) => {
  const [editItem, setEditItem] = useState("");
  const [selectedSort, setSelectedSort] = useState(sortCriteria.category);
  const { data } = api.packs.getById.useQuery({
    id,
  });
  const user = useUser();
  const ctx = api.useContext();
  const isEditable = data?.authorId === user?.user?.id;
  const categories = Array.from(
    new Set(data?.packItems.map((item) => item.category)),
  );
  const locations = Array.from(
    new Set(data?.packItems.map((item) => item.location)),
  );
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const Map = useMemo(
    () =>
      dynamic(() => import("../../../components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

  const allSorts = {
    category: categories,
    location: locations,
  };
  const { data: s3Objects } = api.s3.getObjects.useQuery({
    packId: id,
  });
  const { mutate: deletePackItem } = api.packs.deletePackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
    },
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
  const { mutate: deletePack } = api.packs.deletePack.useMutation({
    onSuccess: () => {
      void router.push("/");
    },
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

  // use Escape to close the Edit Item or edit Title
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setEditItem("");
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  if (!data) return <div>404</div>;

  const titleArray = data?.name.split(" ");

  const ItemData = ({ item }: { item: PackItem }) => (
    <div>
      {editItem === item.id ? (
        <UpdatePackItemForm
          id={item.id}
          packId={id}
          oldName={item.name}
          oldCategory={item.category}
          oldLocation={item.location}
          action={() => setEditItem("")}
        />
      ) : (
        <p className="flex ">
          <>
            <span
              onClick={() => deletePackItem({ packId: id, id: item.id })}
              className="m-2 block w-6 cursor-pointer hover:text-red-400"
            >
              <TrashIcon />
            </span>
            <span
              onClick={() => setEditItem(editItem === item.id ? "" : item.id)}
              className="m-2 block w-5 cursor-pointer hover:text-red-400"
            >
              <Pencil2Icon />
            </span>
          </>
          {item.name}
        </p>
      )}
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
        <div className="my-3 flex justify-end">
          <Button onClick={() => router.push(`/pack/${id}`)}>Close Edit</Button>
        </div>
        {isEditable && s3Objects?.length === 0 && (
          <StandardDropzone packId={id} />
        )}
        {typeof window !== "undefined" && s3Objects?.[0]?.Key && (
          <Map packId={s3Objects[0]?.Key} />
        )}
        <div className="my-3">
          <UpdatePackInfo
            id={id}
            oldName={data.name}
            oldDescription={data.description ?? ""}
            action={() => setOpen(false)}
          />
        </div>
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
          </div>
          <TabsContent value={sortCriteria.category}>
            {itemsByView(sortCriteria.category)}
          </TabsContent>
          <TabsContent value={sortCriteria.location}>
            {itemsByView(sortCriteria.location)}
          </TabsContent>
        </Tabs>
        <h2>Danger zone</h2>
        <div className="rounded-lg border border-red-300 px-6">
          <h3>Delete the pack</h3>
          <div className="flex items-center justify-between">
            <p>Clicking here you will permanently delete the pack</p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button
                  variant="secondary"
                  className="bg-red-300 text-white hover:bg-red-500"
                >
                  Delete Pack
                </Button>
              </DialogTrigger>
              <DialogContent style={{ zIndex: 1000 }}>
                <DialogHeader>
                  <DialogTitle>Delete Pack</DialogTitle>
                  <DialogDescription>
                    This action is irreversible
                    <div className="w-full py-3">
                      <Button
                        variant="destructive"
                        onClick={() => deletePack({ id })}
                      >
                        Delete Pack
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
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
