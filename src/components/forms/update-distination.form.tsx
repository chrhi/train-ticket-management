/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { stationSchema } from "@/lib/validators/stations";
import { Loader2, Info } from "lucide-react";

import { z } from "zod";
import { Destination } from "@/types";

type StationFormValues = z.infer<typeof stationSchema>;

export function UpdateStationForm({
  stationId,
  destinations,
}: {
  stationId: string;
  destinations: Destination[];
}) {
  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      prev_station: "",
      next_station: "",
      prev_dest: 0,
      next_dest: 0,
      desc: "",
      isActive: true,
    },
  });

  // Fetch the current station data
  const { data: station, isLoading } = useQuery({
    queryKey: ["station", stationId],
    queryFn: async () => {
      const response = await fetch(`/api/stations/${stationId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch station");
      }
      return response.json();
    },
  });

  // Update form when station data is loaded
  useEffect(() => {
    if (station) {
      form.reset({
        name: station.name,
        prev_station: station.prev_station || "",
        next_station: station.next_station || "",
        prev_dest: station.prev_dest || 0,
        next_dest: station.next_dest || 0,
        desc: station.desc || "",
        isActive: station.isActive,
      });
    }
  }, [station, form]);

  const mutation = useMutation({
    mutationFn: async (data: StationFormValues) => {
      const response = await fetch(`/api/destinations/${stationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Station "${data.name}" updated successfully`);
    },
    onError: (error: any) => {
      console.error("Error updating station:", error);
      toast.error(error.error || "Failed to update station");

      if (error.details) {
        Object.entries(error.details).forEach(([key, value]: [string, any]) => {
          if (key !== "_errors" && form.getFieldState(key as any)) {
            form.setError(key as any, {
              type: "server",
              message: value._errors?.[0] || "Invalid field",
            });
          }
        });
      }
    },
  });

  function onSubmit(data: StationFormValues) {
    mutation.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full h-fit">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Update Station</CardTitle>
              <CardDescription>Edit station information</CardDescription>
            </div>
            <Button
              variant="outline"
              className="mt-4 md:mt-0"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Station Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter station name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter station description"
                            className="min-h-24 md:min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prev_station"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Station</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select previous station" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            {destinations.length !== 0 &&
                              destinations?.map((destination) => (
                                <SelectItem
                                  key={destination.id}
                                  value={destination.name}
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
                    name="prev_dest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance from Previous (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          Distance in kilometers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="next_station"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Next Station</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select next station" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            {destinations.length !== 0 &&
                              destinations.map((destination) => (
                                <SelectItem
                                  key={destination.id}
                                  value={destination.name}
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
                    name="next_dest"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance to Next (km)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription className="flex items-center">
                          <Info className="h-4 w-4 mr-1" />
                          Distance in kilometers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full h-fit">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Active Status
                        </FormLabel>
                        <FormDescription>
                          Enable or disable this station
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

              <CardFooter className="px-0 pt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this station?")
                    ) {
                      fetch(`/api/destinations/${stationId}`, {
                        method: "DELETE",
                      })
                        .then((response) => {
                          if (response.ok) {
                            toast.success("Station deleted successfully");
                            window.history.back();
                          } else {
                            throw new Error("Failed to delete station");
                          }
                        })
                        .catch((error) => {
                          console.error("Error deleting station:", error);
                          toast.error("Failed to delete station");
                        });
                    }
                  }}
                >
                  Delete Station
                </Button>
                <Button type="submit" disabled={mutation.isPending} size="lg">
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Station...
                    </>
                  ) : (
                    "Update Station"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
