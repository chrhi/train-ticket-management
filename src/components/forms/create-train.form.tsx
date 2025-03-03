"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import { trainSchema } from "@/lib/validators/train";

import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

export function CreateTrainForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof trainSchema>>({
    resolver: zodResolver(trainSchema),
    defaultValues: {
      name: "",
      number: "",
      isActive: true,
    },
  });

  const { mutate: createTrain, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof trainSchema>) => {
      const response = await fetch("/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create new train");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("a train wa created successfully");
      router.push("/admin/train");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new train");
    },
  });

  function onSubmit(values: z.infer<typeof trainSchema>) {
    createTrain(values);
  }

  return (
    <div className="w-full  h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <div className="my-8">
        <p className="text-primary text-2xl font-semibold">Create new train</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full h-fit min-h-full"
        >
          <div className="w-full h-fit gap-4 grid grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train name</FormLabel>
                  <FormControl>
                    <Input placeholder="train name " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train Code (number) </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="something like T6789 it has to be unique"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full ">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this train
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full h-fit flex items-center my-8 justify-end">
            <Button
              type="submit"
              className=" "
              size={"lg"}
              disabled={isPending}
            >
              {isPending ? "creating..." : "Create new train"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
