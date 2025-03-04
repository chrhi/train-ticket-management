"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TicketIcon, Loader2, CheckCircle, XCircle } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

// Define the validation schema
const validationSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  lastName: z.string().optional(),
});

// Define the ticket details interface
interface TicketDetails {
  valid: boolean;
  status: string;
  expired?: boolean;
  ticketDetails?: {
    referenceNumber: string;
    passengerName: string;
    passengerEmail?: string;
    seatNumber?: string;
    journeyDate: string;
    validUntil: string;
    price: number;
    purchaseDate: string;
    trainInfo: {
      trainNumber: string;
      trainName: string;
      trainLineName: string;
      className: string;
    };
    journeyInfo: {
      departureStation: string;
      departureTime: string;
      arrivalStation: string;
      arrivalTime: string;
    };
  };
  message?: string;
}

export default function TicketValidator() {
  const [isLoading, setIsLoading] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      referenceNumber: "",
      lastName: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof validationSchema>) {
    setIsLoading(true);
    setTicketDetails(null);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams({
        referenceNumber: values.referenceNumber,
      });

      if (values.lastName) {
        params.append("lastName", values.lastName);
      }

      // Call the validate ticket API
      const response = await fetch(
        `/api/tickets/validate?${params.toString()}`
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to validate ticket");
        return;
      }

      setTicketDetails(data);
    } catch (error) {
      console.error("Error validating ticket:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP");
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "p");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-md">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <TicketIcon size={24} />
            Ticket Validator
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reference Number */}
                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Reference Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter reference number"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name (Optional) */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter passenger last name"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Validate Ticket"
                )}
              </Button>
            </form>
          </Form>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mt-6">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Ticket Details */}
          {ticketDetails && (
            <div className="mt-6 space-y-6">
              {/* Ticket Status */}
              <Alert
                variant={ticketDetails.valid ? "default" : "destructive"}
                className={ticketDetails.valid ? "bg-green-50" : ""}
              >
                {ticketDetails.valid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {ticketDetails.valid ? "Valid Ticket" : "Invalid Ticket"}
                </AlertTitle>
                <AlertDescription>
                  {ticketDetails.valid
                    ? "This ticket is valid for travel."
                    : ticketDetails.message ||
                      (ticketDetails.expired
                        ? "This ticket has expired."
                        : "This ticket is no longer valid.")}
                </AlertDescription>
              </Alert>

              {ticketDetails.ticketDetails && (
                <>
                  <div className="pt-2">
                    <h3 className="text-lg font-medium mb-2">
                      Passenger Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Passenger Name</p>
                        <p className="font-medium">
                          {ticketDetails.ticketDetails.passengerName}
                        </p>
                      </div>
                      {ticketDetails.ticketDetails.passengerEmail && (
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">
                            {ticketDetails.ticketDetails.passengerEmail}
                          </p>
                        </div>
                      )}
                      {ticketDetails.ticketDetails.seatNumber && (
                        <div>
                          <p className="text-sm text-gray-500">Seat</p>
                          <p className="font-medium">
                            {ticketDetails.ticketDetails.seatNumber}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Reference</p>
                        <p className="font-medium">
                          {ticketDetails.ticketDetails.referenceNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Journey Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium">
                          {formatDate(ticketDetails.ticketDetails.journeyDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Valid Until</p>
                        <p className="font-medium">
                          {formatDate(ticketDetails.ticketDetails.validUntil)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">From</p>
                        <p className="font-medium">
                          {
                            ticketDetails.ticketDetails.journeyInfo
                              .departureStation
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTime(
                            ticketDetails.ticketDetails.journeyInfo
                              .departureTime
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">To</p>
                        <p className="font-medium">
                          {
                            ticketDetails.ticketDetails.journeyInfo
                              .arrivalStation
                          }
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTime(
                            ticketDetails.ticketDetails.journeyInfo.arrivalTime
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-2">Train Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Train</p>
                        <p className="font-medium">
                          {ticketDetails.ticketDetails.trainInfo.trainName}(
                          {ticketDetails.ticketDetails.trainInfo.trainNumber})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Line</p>
                        <p className="font-medium">
                          {ticketDetails.ticketDetails.trainInfo.trainLineName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Class</p>
                        <p className="font-medium">
                          {ticketDetails.ticketDetails.trainInfo.className}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">
                          ${ticketDetails.ticketDetails.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
