"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrainLine } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, MapPin } from "lucide-react";

export const trainLineColumns: ColumnDef<TrainLine>[] = [
  {
    accessorKey: "stations",
    header: "Route",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {row.original.stations.map((station, index) => (
          <span key={index} className="flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4 text-blue-500" />
            {station}
            {index !== row.original.stations.length - 1 && " →"}
          </span>
        ))}
      </div>
    ),
  },

  {
    accessorKey: "name",
    header: "Line Name",
  },
  {
    accessorKey: "trainName",
    header: "Train",
    cell: ({ row }) => (
      <span className="font-medium text-primary">{row.original.trainName}</span>
    ),
  },

  {
    accessorKey: "classess",
    header: "Classes",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.classess.map((trainClass, index) => (
          <Badge key={index} variant="secondary">
            {trainClass}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "destructive"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleEdit(row.original)}
        >
          <Pencil className="h-4 w-4 text-blue-500" />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => handleDelete(row.original.id)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

// Handlers for Edit and Delete actions
const handleEdit = (trainLine: TrainLine) => {
  console.log("Edit train line:", trainLine);
  // Open modal or navigate to edit page
};

const handleDelete = (trainLineId: string) => {
  console.log("Delete train line:", trainLineId);
  // Trigger confirmation and delete action
};
