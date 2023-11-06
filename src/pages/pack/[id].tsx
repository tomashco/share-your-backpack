import type { GetStaticProps, NextPage } from "next";
import { api } from "@/utils/api";
import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import {
  AddPackItemsForm,
  UpdatePackInfo,
  UpdatePackItemForm,
} from "@/components/PackForm";
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
      dynamic(() => import("../../components/map"), {
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
          {isEditable && (
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
          )}
          {item.name}
        </p>
      )}
    </div>
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
        <div className="mb-3 flex items-center justify-end space-x-3">
          <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {sortCriteria.category}
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              value={selectedSort}
              onClick={() =>
                setSelectedSort(
                  selectedSort === sortCriteria.category
                    ? sortCriteria.location
                    : sortCriteria.category,
                )
              }
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-['']  peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              {sortCriteria.location}
            </span>
          </label>
          {isEditable && (
            <>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button variant="secondary">Edit Pack</Button>
                </DialogTrigger>
                <DialogContent style={{ zIndex: 1000 }}>
                  <DialogHeader>
                    <DialogTitle>Edit pack informations</DialogTitle>
                    <DialogDescription>
                      <UpdatePackInfo
                        id={id}
                        oldName={data.name}
                        oldDescription={data.description ?? ""}
                        action={() => setOpen(false)}
                      />
                      <div className="w-full py-3">
                        <Button onClick={() => deletePack({ id })}>
                          Delete Pack
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
        <p className="prose">{data.description}</p>
        {isEditable && s3Objects?.length === 0 && (
          <StandardDropzone packId={id} />
        )}
        {typeof window !== "undefined" && s3Objects?.[0]?.Key && (
          <Map packId={s3Objects[0]?.Key} />
        )}
        {allSorts[selectedSort]?.map((sortName) => (
          <div key={sortName}>
            <h1 className="drop-shadow-l text-xl font-extrabold text-primary">
              {sortName ? sortName : "TBD"}
            </h1>
            {data.packItems
              .filter((el) => el[selectedSort] === sortName)
              .map((item) => (
                <ItemData key={item.id} item={item} />
              ))}
          </div>
        ))}
        {isEditable && <AddPackItemsForm id={id} />}
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
