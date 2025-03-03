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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TrainClassSchema } from "@/lib/validators/train";
import { useRouter } from "next/navigation";

export function CreateTrainClassForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof TrainClassSchema>>({
    resolver: zodResolver(TrainClassSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate: createTrain, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof TrainClassSchema>) => {
      const response = await fetch("/api/train/train-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create new train class");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("a new train class was created successfully");
      router.push("/admin/train");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new train class");
    },
  });

  function onSubmit(values: z.infer<typeof TrainClassSchema>) {
    createTrain(values);
  }

  return (
    <div className="w-full  h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <div className="my-8">
        <p className="text-primary text-2xl font-semibold">
          Create new train class
        </p>
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
                  <FormLabel>Class name</FormLabel>
                  <FormControl>
                    <Input placeholder="train name " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerKm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>price for every km (USD)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="something like 1 or 0.5"
                      type="number"
                      {...field}
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
              {isPending ? "creating..." : "Create new class"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
