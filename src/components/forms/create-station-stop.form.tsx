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
import { Clock, Info, AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function TimeSelect({
  label,
  hourName,
  minuteName,
  form,
  otherHourName,
  otherMinuteName,
}: {
  label: string;
  hourName: "arrivalTimeHour" | "departureTimeHour";
  minuteName: "arrivalTimeMinute" | "departureTimeMinute";
  form: any;
  otherHourName: "arrivalTimeHour" | "departureTimeHour";
  otherMinuteName: "arrivalTimeMinute" | "departureTimeMinute";
}) {
  const hourValue = form.watch(hourName);
  const otherHourValue = form.watch(otherHourName);

  const handleTimeToggle = (checked: boolean) => {
    if (checked) {
      // If setting this time to null
      form.setValue(hourName, null);
      form.setValue(minuteName, null);

      // Ensure the other time is not null
      if (otherHourValue === null) {
        form.setValue(otherHourName, 0);
        form.setValue(otherMinuteName, 0);
      }
    } else {
      // If unchecking null, set to 0
      form.setValue(hourName, 0);
      form.setValue(minuteName, 0);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4" />
        <FormLabel>{label}</FormLabel>
        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name={`${hourName}IsNull`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={hourValue === null}
                    onCheckedChange={handleTimeToggle}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  First/Last Station
                </FormLabel>
              </FormItem>
            )}
          />
          <Info className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {hourValue !== null && (
        <div className="grid grid-cols-2 gap-2 w-full">
          <FormField
            control={form.control}
            name={hourName}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    const hourValue = parseInt(value);
                    field.onChange(hourValue);
                  }}
                  value={field.value?.toString() ?? undefined}
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
            name={minuteName}
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={(value) => {
                    const minuteValue = parseInt(value);
                    field.onChange(minuteValue);
                  }}
                  value={field.value?.toString() ?? undefined}
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
      )}
    </div>
  );
}

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
    defaultValues: {
      stopOrder: 1,
      arrivalTimeHour: 0,
      arrivalTimeMinute: 0,
      departureTimeHour: 0,
      departureTimeMinute: 0,
    },
  });

  const { mutate: createStationStop, isPending } = useMutation({
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
        throw new Error(error.error || "Failed to create new station stop");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("A new station stop was created successfully");
      router.push("/admin/station-stop");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new station stop");
    },
  });

  function onSubmit(values: z.infer<typeof StationStopSchema>) {
    // Validate that not both times are null
    if (values.arrivalTimeHour === null && values.departureTimeHour === null) {
      toast.error("At least one time (arrival or departure) must be set");
      return;
    }
    createStationStop(values);
  }

  return (
    <div className="w-full h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <div className="my-4">
        <p className="text-primary text-2xl font-semibold">
          Create New Station Stop
        </p>
      </div>

      {form.watch("arrivalTimeHour") === null &&
        form.watch("departureTimeHour") === null && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must set at least one time (arrival or departure)
            </AlertDescription>
          </Alert>
        )}

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
                <FormLabel>Station</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a station" />
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
                  Select the station for this stop
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stopOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stop Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Order of this station in the route"
                    {...field}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 1 : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Enter the order of this station in the route (e.g., 1, 2, 3)
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
                      <SelectValue placeholder="Select a train schedule" />
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

          <TimeSelect
            label="Arrival Time"
            hourName="arrivalTimeHour"
            minuteName="arrivalTimeMinute"
            otherHourName="departureTimeHour"
            otherMinuteName="departureTimeMinute"
            form={form}
          />

          <TimeSelect
            label="Departure Time"
            hourName="departureTimeHour"
            minuteName="departureTimeMinute"
            otherHourName="arrivalTimeHour"
            otherMinuteName="arrivalTimeMinute"
            form={form}
          />

          <div className="w-full h-fit flex items-center my-8 justify-end">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Creating..." : "Create Station Stop"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
