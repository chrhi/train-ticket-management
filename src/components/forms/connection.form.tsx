"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { connectionSchema } from "@/lib/validators/connections";
import { Info } from "lucide-react";
import { Destination } from "@/types";
import { useEffect, useState } from "react";

export function CreateConnectionForm({
  destinations,
}: {
  destinations: Destination[];
}) {
  const router = useRouter();
  const [selectedFromStation, setSelectedFromStation] = useState<string>("");
  const [selectedToStation, setSelectedToStation] = useState<string>("");

  const form = useForm<z.infer<typeof connectionSchema>>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      fromStationId: "",
      toStationId: "",
      isActive: true,
      distance: 0,
    },
  });

  // Update form when selections change
  useEffect(() => {
    form.setValue("fromStationId", selectedFromStation);
  }, [selectedFromStation, form]);

  useEffect(() => {
    form.setValue("toStationId", selectedToStation);
  }, [selectedToStation, form]);

  const { mutate: createConnection, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof connectionSchema>) => {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create connection");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Connection created successfully");
      router.back();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create new connection");
    },
  });

  function onSubmit(values: z.infer<typeof connectionSchema>) {
    createConnection(values);
  }

  return (
    <div className="w-full h-fit bg-white flex flex-col gap-y-4 p-4 border rounded-lg shadow">
      <p className="text-primary text-xl font-semibold">
        Connect two stations together
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-full h-fit min-h-full mt-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fromStationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Station</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedFromStation(value);

                      // If the selected station is the same as the toStation, reset toStation
                      if (value === selectedToStation) {
                        setSelectedToStation("");
                        form.setValue("toStationId", "");
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the first station" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {destinations.length !== 0 &&
                        destinations?.map((destination) => (
                          <SelectItem
                            key={destination.id}
                            value={destination.id}
                            disabled={destination.id === selectedToStation}
                          >
                            {destination.name}
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
              name="toStationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Second Station</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedToStation(value);

                      // If the selected station is the same as the fromStation, reset fromStation
                      if (value === selectedFromStation) {
                        setSelectedFromStation("");
                        form.setValue("fromStationId", "");
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the second station" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {destinations.length !== 0 &&
                        destinations?.map((destination) => (
                          <SelectItem
                            key={destination.id}
                            value={destination.id}
                            disabled={destination.id === selectedFromStation}
                          >
                            {destination.name}
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
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Distance between the two (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0.1"
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Distance in kilometers (must be greater than 0)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Enable or disable this connection
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

          <div className="w-full h-[100px] flex items-center justify-end px-4">
            <Button
              type="submit"
              className="my-8"
              size={"lg"}
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Connection"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
