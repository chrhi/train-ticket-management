"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  Clock,
  Train,
  MapPin,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrainSchedule } from "@/types";
import Link from "next/link";

export const trainScheduleColumns: ColumnDef<TrainSchedule>[] = [
  {
    accessorKey: "trainLineName",
    header: "Train Line",
    cell: ({ row }) => (
      <div className="font-semibold flex items-center gap-2">
        <Train className="h-4 w-4 text-blue-500" />
        {row.original.trainLineName}
      </div>
    ),
  },
  {
    accessorKey: "trainName",
    header: "Train Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.trainName}</span>
    ),
  },
  {
    accessorKey: "departureTime",
    header: "Departure",
    cell: ({ row }) => {
      const formattedTime = new Date(
        row.original.departureTime
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          {formattedTime}
        </div>
      );
    },
  },
  {
    accessorKey: "dayOfWeek",
    header: "Day of Week",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.dayOfWeek !== null
          ? `Day ${row.original.dayOfWeek}`
          : "Daily"}
      </Badge>
    ),
  },
  {
    accessorKey: "stations",
    header: "Stations",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.stations.map((station, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <MapPin className="h-4 w-4 text-green-500" />
            <span className="font-medium">{station.name}</span>
            {station.arrival && (
              <span className="text-xs text-gray-500">
                Arr:{" "}
                {new Date(station.arrival).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
            {station.depar && (
              <span className="text-xs text-gray-500">
                Dep:{" "}
                {new Date(station.depar).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const schedule = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/schedules/${schedule.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Pencil className="mr-2 h-4 w-4 text-blue-500" />
                Edit
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={() => console.log("Delete schedule", schedule.id)} // Replace with actual delete function
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
