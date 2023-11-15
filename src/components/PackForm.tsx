import { zodResolver } from "@hookform/resolvers/zod";
import { Control, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TrashIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { api, displayError } from "@/utils/api";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { TableCell, TableRow } from "./ui/table";

const itemSchema = z.object({
  name: z.string().min(2, {
    message: "pack name must be at least 2 characters.",
  }),
  category: z.string().optional(),
  location: z.string().optional(),
});

const packSchema = z.object({
  name: z.string().min(2, {
    message: "pack name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  packItems: z.array(itemSchema).optional(),
});

export function CreatePackForm() {
  const ctx = api.useContext();
  const { toast } = useToast();
  const router = useRouter();

  const { data: packData, mutate: createPack } =
    api.packs.createPack.useMutation({
      onSuccess: () => {
        void ctx.packs.getAll.invalidate();
        form.reset();
      },
      onError: (e) => displayError(e, toast),
    });

  useEffect(() => {
    if (packData?.id) {
      void router.push(`/pack/${packData.id}`);
    }
  }, [packData, router]);

  const form = useForm<z.infer<typeof packSchema>>({
    resolver: zodResolver(packSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof packSchema>) {
    createPack({ ...values });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="my-3">
          <h1>Add a new pack</h1>
        </div>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pack Name</FormLabel>
                <FormControl>
                  <Input placeholder="New Pack 2043" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Just write something about your trail!"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="my-3" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export function UpdatePackInfo({
  id,
  oldName,
  oldDescription,
  action,
}: {
  id: string;
  oldName: string;
  oldDescription: string;
  action: () => void;
}) {
  const ctx = api.useContext();
  const { toast } = useToast();

  const { mutate: updatePack, isLoading } = api.packs.editPack.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
      form.reset();
      action();
    },
    onError: (e) => displayError(e, toast),
  });

  const form = useForm<z.infer<typeof packSchema>>({
    resolver: zodResolver(packSchema),
    defaultValues: {
      name: oldName,
      description: oldDescription ?? "",
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof packSchema>) {
    updatePack({ id, ...values });
  }

  if (isLoading) return <div>is loading</div>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[200px]">Pack Name:</FormLabel>
              <FormControl>
                <Input
                  className="border-none shadow-none"
                  placeholder={oldName}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="w-[200px]">Tour description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={oldDescription}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Button type="submit">Update</Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function AddUpdatePackItemForm({
  id,
  packId,
  formControl,
  oldName = "",
  oldCategory = "",
  oldLocation = "",
  action,
}: {
  id?: string;
  packId: string;
  formControl: Control<
    {
      name: string;
      category?: string | undefined;
      location?: string | undefined;
    },
    unknown
  >;
  oldName?: string;
  oldCategory?: string;
  oldLocation?: string;
  action?: () => void;
}) {
  // form.handleSubmit(onSubmit)

  return (
    <TableRow>
      <TableCell className="font-medium">
        <FormField
          control={formControl}
          name={"name"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={oldName} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={formControl}
          name={"category"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell>
        <FormField
          control={formControl}
          name={"location"}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="flex justify-end">
        <span
          onClick={
            () => null
            // deletePackItem({ packId: id, id: item.id })
          }
          className="m-2 block w-6 cursor-pointer hover:text-red-400"
        >
          <TrashIcon />
        </span>
        {/* <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            Submit
          </Button> */}
      </TableCell>
    </TableRow>
  );
}
