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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrainScheduleSchema } from "@/lib/validators/schedule";
import { useRouter } from "next/navigation";
import { TrainLine } from "@/types";
import { daysOfWeek } from "@/constants";
import { Clock } from "lucide-react";

export function CreateScheduleForm({
  trainLines,
}: {
  trainLines: TrainLine[];
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof TrainScheduleSchema>>({
    resolver: zodResolver(TrainScheduleSchema),
    defaultValues: {
      dayOfWeek: null,
      hour: 0,
      minute: 0,
    },
  });

  const { mutate: createTrain, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof TrainScheduleSchema>) => {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create new train schedule");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("A new train schedule was created successfully");
      router.push("/admin/train-schedule");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new train schedule");
    },
  });

  function onSubmit(values: z.infer<typeof TrainScheduleSchema>) {
    createTrain(values);
  }

  return (
    <div className="w-full h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <div className="my-8">
        <p className="text-primary text-2xl font-semibold">
          Create New Train Schedule
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
              name="trainLineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Train Line</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a train line" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trainLines.map((trainLine) => (
                        <SelectItem key={trainLine.id} value={trainLine.id}>
                          {trainLine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the train line for this schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dayOfWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day of Week</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      // Convert "null" string to actual null value, otherwise parse as integer
                      field.onChange(value === "null" ? null : parseInt(value));
                    }}
                    value={
                      field.value === null ? "null" : field.value?.toString()
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the day of the week or choose Daily for every day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full h-fit">
            <div className="space-y-2">
              <FormLabel>Departure Time</FormLabel>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  <FormField
                    control={form.control}
                    name="hour"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            const hourValue = parseInt(value);
                            field.onChange(hourValue);
                          }}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Hour" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(value) => {
                            const minuteValue = parseInt(value);
                            field.onChange(minuteValue);
                          }}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Min" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i.toString().padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormDescription>
                Select the departure time (hour and minute)
              </FormDescription>
            </div>
          </div>

          <div className="w-full h-fit flex items-center my-8 justify-end">
            <Button type="submit" className="" size={"lg"} disabled={isPending}>
              {isPending ? "Creating..." : "Create Schedule"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
