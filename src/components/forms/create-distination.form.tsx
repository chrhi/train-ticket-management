/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";

import { z } from "zod";

type StationFormValues = z.infer<typeof stationSchema>;

export function CreateStationForm() {
  const form = useForm<StationFormValues>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: "",
      desc: "",
      isActive: true,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: StationFormValues) => {
      const response = await fetch("/api/destinations", {
        method: "POST",
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
      toast.success(`Station "${data.name}" created successfully`);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Error creating station:", error);
      toast.error(error.error || "Failed to create station");

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

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full h-fit">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">Create Station</CardTitle>
              <CardDescription>
                Add a new station to your network
              </CardDescription>
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
                <div className="space-y-6"></div>
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

              <CardFooter className="px-0 pt-4 flex items-center justify-end">
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  size="lg"
                  className=""
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Station...
                    </>
                  ) : (
                    "Create Station"
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
