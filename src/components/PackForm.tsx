import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { api, displayError } from "@/utils/api";
import { cn } from "@/utils";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

const itemSchema = z.object({
  name: z.string().min(2, {
    message: "pack name must be at least 2 characters.",
  }),
  category: z.string().optional(),
  location: z.string().optional(),
});

const packItemSchema = z.object({ packItems: z.array(itemSchema) });

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

export function UpdatePackItemForm({
  id,
  packId,
  oldName,
  oldCategory,
  oldLocation,
  action,
}: {
  id: string;
  packId: string;
  oldName: string;
  oldCategory: string;
  oldLocation: string;
  action: () => void;
}) {
  const ctx = api.useContext();
  const { toast } = useToast();

  const { mutate: updatePackItem } = api.packs.editPackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
      form.reset();
      action();
    },
    onError: (e) => displayError(e, toast),
  });

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: oldName,
      category: oldCategory,
      location: oldLocation,
    },
    mode: "onChange",
  });

  function onSubmit({ name, category, location }: z.infer<typeof itemSchema>) {
    updatePackItem({ packId, id, name, category, location });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
        <div className="flex items-end space-x-3">
          <FormField
            control={form.control}
            name={"name"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add new pack items:</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input placeholder={oldName} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"category"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category:</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"location"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location:</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export function AddPackItemsForm({ id }: { id: string }) {
  const ctx = api.useContext();
  const { toast } = useToast();

  const { mutate: addPackItems } = api.packs.addPackItems.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
    },
    onError: (e) => displayError(e, toast),
  });

  const form = useForm<z.infer<typeof packItemSchema>>({
    resolver: zodResolver(packItemSchema),
    defaultValues: {
      packItems: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "packItems",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof packItemSchema>) {
    addPackItems({ id, packItems: values.packItems });
    form.reset({ packItems: [{ name: "" }] });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end space-x-2">
              <FormField
                control={form.control}
                name={`packItems.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Add new pack items:
                    </FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`packItems.${index}.category`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Category:
                    </FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`packItems.${index}.location`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Location:
                    </FormLabel>
                    <FormControl>
                      <div className="flex space-x-2">
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => remove(index)}>
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => append({ name: "", category: "", location: "" })}
          >
            Add pack item
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
