"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrainLine } from "@/types";
import { Badge } from "@/components/ui/badge";

export const trainLineColumns: ColumnDef<TrainLine>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Line Name",
  },
  {
    accessorKey: "trainId",
    header: "Train ID",
    cell: ({ row }) => {
      return <span className="font-mono text-xs">{row.original.trainId}</span>;
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.isActive ? "default" : "destructive"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
];
