import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import toast from "react-hot-toast";
import { cn } from "@/utils";

const itemSchema = z.object({
  name: z.string().min(2, {
    message: "pack name must be at least 2 characters.",
  }),
});

const packItemSchema = z.object({ packItems: z.array(itemSchema) });

const packSchema = z.object({
  packName: z.string().min(2, {
    message: "pack name must be at least 2 characters.",
  }),
  packItems: z.array(itemSchema).optional(),
});

export function CreatePackForm() {
  const ctx = api.useContext();

  const { mutate: createPack } = api.packs.createPack.useMutation({
    onSuccess: () => {
      void ctx.packs.getAll.invalidate();
      form.reset();
    },
    onError: (e) => {
      const errorMessage = e.data?.code;
      console.log("ERROR MESSAGE: ", e.data);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to create! Please try again later.");
      }
    },
  });

  const form = useForm<z.infer<typeof packSchema>>({
    resolver: zodResolver(packSchema),
    defaultValues: {
      packName: "",
      packItems: [
        {
          name: "a generic item",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append } = useFieldArray({
    name: "packItems",
    control: form.control,
  });

  function onSubmit(values: z.infer<typeof packSchema>) {
    createPack({ name: values.packName, packItems: values.packItems });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="packName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pack Name</FormLabel>
              <FormControl>
                <Input placeholder="New Pack 2043" {...field} />
              </FormControl>
              <FormDescription>This is your pack name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`packItems.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Pack Items
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add all the items of your pack.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => append({ name: "" })}
          >
            Add pack item
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function UpdatePackForm({
  id,
  oldName,
  action,
}: {
  id: string;
  oldName: string;
  action: () => void;
}) {
  const ctx = api.useContext();

  const { mutate: updatePack } = api.packs.editPack.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
      form.reset();
      action();
    },
    onError: (e) => {
      const errorMessage = e.data?.code;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to update! Please try again later.");
      }
    },
  });

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  function onSubmit({ name }: z.infer<typeof itemSchema>) {
    updatePack({ id, name });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={oldName} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function UpdatePackItemForm({
  id,
  packId,
  oldName,
  action,
}: {
  id: string;
  packId: string;
  oldName: string;
  action: () => void;
}) {
  const ctx = api.useContext();

  const { mutate: updatePackItem } = api.packs.editPackItem.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
      form.reset();
      action();
    },
    onError: (e) => {
      const errorMessage = e.data?.code;
      console.log("ERROR MESSAGE: ", e.data);
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to update! Please try again later.");
      }
    },
  });

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
    },
    mode: "onChange",
  });

  function onSubmit({ name }: z.infer<typeof itemSchema>) {
    updatePackItem({ packId, id, name });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Pack Name</FormLabel> */}
              <FormControl>
                <Input placeholder={oldName} {...field} />
              </FormControl>
              {/* <FormDescription>This is your pack name.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export function AddPackItemsForm({
  id,
}: {
  id: string;
  oldItems: { name: string }[];
}) {
  const ctx = api.useContext();

  const { mutate: addPackItems } = api.packs.addPackItems.useMutation({
    onSuccess: () => {
      void ctx.packs.getById.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.code;
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("Failed to create! Please try again later.");
      }
    },
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

  function onSubmit({ packItems }: z.infer<typeof packItemSchema>) {
    addPackItems({ id, packItems });
    form.reset({ packItems: [{ name: "" }] });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`packItems.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    Add new pack items:
                  </FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input {...field} />
                      <Button type="button" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={() => append({ name: "" })}
          >
            Add pack item
          </Button>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
