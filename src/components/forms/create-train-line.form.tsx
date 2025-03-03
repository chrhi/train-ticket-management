"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Train, TrainClass } from "@/types";
import { Switch } from "../ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";

// Extend the schema to include classes
const ExtendedTrainLineSchema = TrainLineSchema.extend({
  classes: z.array(z.string()).optional(),
});

export function CreateTrainLineForm({ trains }: { trains: Train[] }) {
  const router = useRouter();
  const [availableClasses, setAvailableClasses] = useState<TrainClass[]>([]);

  // Fetch available train classes
  const { data: trainClasses, isLoading: isLoadingClasses } = useQuery({
    queryKey: ["trainClasses"],
    queryFn: async () => {
      const response = await fetch("/api/train/train-class");
      if (!response.ok) {
        throw new Error("Failed to fetch train classes");
      }
      return response.json() as Promise<TrainClass[]>;
    },
  });

  useEffect(() => {
    if (trainClasses) {
      setAvailableClasses(trainClasses);
    }
  }, [trainClasses]);

  const form = useForm<z.infer<typeof ExtendedTrainLineSchema>>({
    resolver: zodResolver(ExtendedTrainLineSchema),
    defaultValues: {
      isActive: true,
      name: "",
      trainId: "",
      classes: [],
    },
  });

  const { mutate: createTrainLine, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof ExtendedTrainLineSchema>) => {
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
      toast.success("A new train line was created successfully");
      router.push("/admin/train-routes");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new train line");
    },
  });

  function onSubmit(values: z.infer<typeof ExtendedTrainLineSchema>) {
    createTrainLine(values);
  }

  return (
    <div className="w-full h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <div className="my-8">
        <p className="text-primary text-2xl font-semibold">
          Create new train line
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
                  <FormLabel>Line name</FormLabel>
                  <FormControl>
                    <Input placeholder="Train line name" {...field} />
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
                    Select the train for this line
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Train classes selection */}
          <div className="w-full h-fit gap-4">
            <FormField
              control={form.control}
              name="classes"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Train Classes</FormLabel>
                    <FormDescription>
                      Select the classes available on this train line
                    </FormDescription>
                  </div>
                  {isLoadingClasses ? (
                    <p>Loading classes...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableClasses.map((trainClass) => (
                        <FormField
                          key={trainClass.id}
                          control={form.control}
                          name="classes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={trainClass.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      trainClass.id
                                    )}
                                    onCheckedChange={(
                                      checked: CheckedState
                                    ) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          trainClass.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== trainClass.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    {trainClass.name}
                                  </FormLabel>
                                  <FormDescription>
                                    Price: {trainClass.pricePerKm} per km
                                  </FormDescription>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  )}
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
                      Enable or disable this train line
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
              {isPending ? "Creating..." : "Create new train line"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
