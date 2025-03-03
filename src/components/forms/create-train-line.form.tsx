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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainLineSchema } from "@/lib/validators/train";
import { useRouter } from "next/navigation";
import { Train } from "@/types";
import { Switch } from "../ui/switch";

export function CreateTrainLineForm({ trains }: { trains: Train[] }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof TrainLineSchema>>({
    resolver: zodResolver(TrainLineSchema),
    defaultValues: {
      isActive: true,
      name: "",
      trainId: "",
    },
  });

  const { mutate: createTrain, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof TrainLineSchema>) => {
      console.log("valide in ui", values);
      const response = await fetch("/api/train/train-line", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create new train line");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("A new train class was created successfully");
      router.push("/admin/train-routes");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new train line");
    },
  });

  function onSubmit(values: z.infer<typeof TrainLineSchema>) {
    createTrain(values);
  }

  return (
    <div className="w-full h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
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
                    <Input placeholder="Train class name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trainId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a train" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trains.map((train) => (
                        <SelectItem key={train.id} value={train.id}>
                          {train.name} - {train.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the train for this class
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full h-fit gap-4">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this train class
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
            <Button type="submit" className="" size={"lg"} disabled={isPending}>
              {isPending ? "Creating..." : "Create new class"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
