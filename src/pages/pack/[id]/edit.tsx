import type { GetStaticProps, NextPage } from "next";
import { api, displayError } from "@/utils/api";
import RootLayout from "@/components/layouts/RootLayout";
import { Header } from "@/components/header";
import { generateSSGHelper } from "@/server/helpers/ssgHelper";
import { UpdatePackInfo, AddUpdatePackItemForm } from "@/components/PackForm";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { TrashIcon } from "@radix-ui/react-icons";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const SinglePackPage: NextPage<{ id: string }> = ({ id }) => {
  const [editItem, setEditItem] = useState("");
  const { data, isLoading } = api.packs.getById.useQuery({
    id,
  });
  const { user, isLoaded: userIsLoaded } = useUser();
  const ctx = api.useContext();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const itemSchema = z.object({
    name: z.string().min(2, {
      message: "pack name must be at least 2 characters.",
    }),
    category: z.string().optional(),
    location: z.string().optional(),
  });

  const { mutate: updatePackItem } = api.packs.editPackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
      form.reset();
      // if (action) action();
    },
    onError: (e) => displayError(e, toast),
  });
  const { mutate: addPackItem } = api.packs.addPackItems.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
      form.reset();
      // if (action) action();
    },
    onError: (e) => displayError(e, toast),
  });

  const Map = useMemo(
    () =>
      dynamic(() => import("../../../components/map"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [],
  );

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

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      category: "",
      location: "",
    },
    mode: "onBlur",
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

  if (isLoading || !userIsLoaded) {
    return <div>Loading</div>;
  }

  if (!data) return void router.push("/");

  if (user && data && data.authorId !== user.id)
    void router.push(`/pack/${id}`);
  const titleArray = data?.name.split(" ");

  const handleBlur = ({
    name,
    category,
    location,
  }: z.infer<typeof itemSchema>) => {
    console.log(name, category, location);
    if (id)
      updatePackItem({ packId: id, id: editItem, name, category, location });
    else addPackItem({ id, packItems: [{ name, category, location }] });
  };

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
        {s3Objects?.length === 0 && <StandardDropzone packId={id} />}
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

        <Form {...form}>
          <form
            // style={{ visibility: "hidden" }}
            onBlur={form.handleSubmit(handleBlur)}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Delete Item</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.packItems.map((item) =>
                  editItem === item.id ? (
                    <AddUpdatePackItemForm
                      key={item.id}
                      id={item.id}
                      packId={id}
                      formControl={form.control}
                      oldName={item.name}
                      oldCategory={item.category}
                      oldLocation={item.location}
                      action={() => setEditItem("")}
                    />
                  ) : (
                    <TableRow
                      key={item.id}
                      onClick={() => setEditItem(item.id)}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell className="flex justify-end">
                        <span
                          onClick={() =>
                            deletePackItem({ packId: id, id: item.id })
                          }
                          className="m-2 block w-6 cursor-pointer hover:text-red-400"
                        >
                          <TrashIcon />
                        </span>
                      </TableCell>
                    </TableRow>
                  ),
                )}
                {/* <AddUpdatePackItemForm packId={id} /> */}
              </TableBody>
            </Table>
          </form>
        </Form>
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
