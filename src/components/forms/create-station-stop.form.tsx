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
import { StationStopSchema } from "@/lib/validators/station-stop";
import { useRouter } from "next/navigation";
import { Destination, TrainSchedule } from "@/types";
import { Clock } from "lucide-react";

export function CreateStationStopForm({
  stations,
  trainSchedules,
}: {
  stations: Destination[];
  trainSchedules: TrainSchedule[];
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof StationStopSchema>>({
    resolver: zodResolver(StationStopSchema),
    defaultValues: {},
  });

  const { mutate: createTrain, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof StationStopSchema>) => {
      const response = await fetch("/api/schedule/station-stop", {
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
      router.push("/admin/train-schedule");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new train line");
    },
  });

  function onSubmit(values: z.infer<typeof StationStopSchema>) {
    createTrain(values);
  }

  return (
    <div className="w-full h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <div className="my-8">
        <p className="text-primary text-2xl font-semibold">
          Create New Station Stop
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full h-fit min-h-full"
        >
          <FormField
            control={form.control}
            name="stationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Station </FormLabel>
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
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  select the staion you want to work with
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trainScheduleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Train Schedule</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a train Schedule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainSchedules.map((trainSchedule) => (
                      <SelectItem
                        key={trainSchedule.id}
                        value={trainSchedule.id}
                      >
                        {trainSchedule.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select the train schedule</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormLabel>Arrival Time</FormLabel>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              <FormField
                control={form.control}
                name="departureTimeHour"
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
                name="departureTimeMinute"
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
          <FormLabel>Departure Time</FormLabel>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              <FormField
                control={form.control}
                name="departureTimeHour"
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
                name="arrivalTimeMinute"
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
