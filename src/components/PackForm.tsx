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

const formSchema = z.object({
  packName: z.string().min(2, {
    message: "pack name must be at least 2 characters.",
  }),
  packItems: z
    .array(
      z.object({
        name: z.string().min(2, {
          message: "pack name must be at least 2 characters.",
        }),
      }),
    )
    .optional(),
});

export function PackForm() {
  const ctx = api.useContext();

  const { mutate: createPack } = api.packs.create.useMutation({
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
        toast.error("Failed to delete! Please try again later.");
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  function onSubmit(values: z.infer<typeof formSchema>) {
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
