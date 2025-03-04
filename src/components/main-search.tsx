/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarIcon, Clock, Info, Search, Train } from "lucide-react";
import { Destination } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define the search form schema
const searchSchema = z.object({
  originId: z.string().min(1, "Origin station is required"),
  destinationId: z.string().min(1, "Destination station is required"),
  date: z.date({
    required_error: "Journey date is required",
  }),
  classId: z.string().optional(),
});

// Define types for train search results
type TrainClass = {
  id: string;
  name: string;
  price: number;
};

type TrainSearchResult = {
  scheduleId: string;
  trainNumber: string;
  trainName: string;
  trainLineName: string;
  departureStation: string;
  departureTime: string;
  arrivalStation: string;
  arrivalTime: string;
  distance: number;
  availableClasses: TrainClass[];
  originStopId: string;
  destinationStopId: string;
};

export function TrainSearchComponent({
  destinations,
  classes,
}: {
  destinations: Destination[];
  classes: { id: string; name: string }[];
}) {
  const [selectedOrigin, setSelectedOrigin] = useState<string>("");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [searchParams, setSearchParams] = useState<z.infer<
    typeof searchSchema
  > | null>(null);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      originId: "",
      destinationId: "",
      classId: "",
    },
  });

  // Fetch train results when search params change
  const { data: trainResults, isLoading } = useQuery<TrainSearchResult[]>({
    queryKey: ["trainSearch", searchParams],
    queryFn: async () => {
      if (!searchParams) return [];

      const url = new URL("/api/tickets/search", window.location.origin);
      url.searchParams.append("originId", searchParams.originId);
      url.searchParams.append("destinationId", searchParams.destinationId);
      url.searchParams.append("date", searchParams.date.toISOString());

      if (searchParams.classId) {
        url.searchParams.append("classId", searchParams.classId);
      }

      console.log(url);

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch trains");
      }

      return await response.json();
    },
    enabled: !!searchParams,
  });

  function onSubmit(values: z.infer<typeof searchSchema>) {
    setSearchParams(values);
  }

  // Format time from ISO string to readable format
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return format(date, "HH:mm");
  };

  // Calculate journey duration
  const calculateDuration = (departure: string, arrival: string) => {
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);
    const durationMs = arrivalDate.getTime() - departureDate.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Find Your Train</CardTitle>
          <CardDescription>
            Search for available trains between stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="originId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin Station</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedOrigin(value);

                          // Reset destination if same as origin
                          if (value === selectedDestination) {
                            setSelectedDestination("");
                            form.setValue("destinationId", "");
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select origin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinations.map((destination) => (
                            <SelectItem
                              key={destination.id}
                              value={destination.id}
                              disabled={destination.id === selectedDestination}
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
                  name="destinationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Station</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedDestination(value);

                          // Reset origin if same as destination
                          if (value === selectedOrigin) {
                            setSelectedOrigin("");
                            form.setValue("originId", "");
                          }
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinations.map((destination) => (
                            <SelectItem
                              key={destination.id}
                              value={destination.id}
                              disabled={destination.id === selectedOrigin}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Journey Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Class (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? "Searching..." : "Search Trains"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {searchParams && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Showing trains from{" "}
              {destinations.find((d) => d.id === searchParams.originId)?.name}{" "}
              to{" "}
              {
                destinations.find((d) => d.id === searchParams.destinationId)
                  ?.name
              }{" "}
              on {format(searchParams.date, "PPP")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <p>Loading available trains...</p>
              </div>
            ) : trainResults && trainResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Train</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Classes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainResults.map((train) => (
                    <TableRow key={train.scheduleId}>
                      <TableCell>
                        <div className="font-medium flex items-center">
                          <Train className="h-4 w-4 mr-2" />
                          {train.trainNumber}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {train.trainName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(train.departureTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {train.departureStation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          {formatTime(train.arrivalTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {train.arrivalStation}
                        </div>
                      </TableCell>
                      <TableCell>
                        {calculateDuration(
                          train.departureTime,
                          train.arrivalTime
                        )}
                        <div className="text-sm text-muted-foreground">
                          {train.distance} km
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {train.availableClasses.map((cls) => (
                            <Badge key={cls.id} variant="outline">
                              {cls.name}: ${cls.price.toFixed(2)}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          onClick={() => {
                            // This would link to a booking page with the train details
                            toast.info(
                              `Selected train ${train.trainNumber}. Booking functionality to be implemented.`
                            );
                          }}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex justify-center items-center p-8 flex-col gap-2">
                <Info className="h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No trains found for the selected criteria.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
