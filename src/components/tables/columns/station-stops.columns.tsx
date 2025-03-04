"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  Clock,
  MapPin,
  Hash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StationStop } from "@/types";
import Link from "next/link";

export const trainScheduleColumns: ColumnDef<StationStop>[] = [
  {
    accessorKey: "stationName",
    header: "Station",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-medium">
        <MapPin className="h-4 w-4 text-blue-500" />
        {row.original.stationName}
      </div>
    ),
  },
  {
    accessorKey: "stopOrder",
    header: "Stop Order",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-sm flex items-center gap-1">
        <Hash className="h-4 w-4 text-gray-500" />
        {row.original.stopOrder}
      </Badge>
    ),
  },
  {
    accessorKey: "arrivalTime",
    header: "Arrival Time",
    cell: ({ row }) => {
      const formattedTime = row.original.arrivalTime
        ? new Date(row.original.arrivalTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-500" />
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "departureTime",
    header: "Departure Time",
    cell: ({ row }) => {
      const formattedTime = row.original.departureTime
        ? new Date(row.original.departureTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-red-500" />
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "desc",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-md truncate text-gray-700">
        {row.getValue("desc") || "No description"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const stop = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/stops/${stop.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={() => console.log("Delete stop", stop.id)} // Replace with actual delete function
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
