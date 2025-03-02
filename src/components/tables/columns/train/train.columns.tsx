"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Train } from "@/types";
import { Badge } from "@/components/ui/badge";

export const trainColumns: ColumnDef<Train>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Train Name",
  },
  {
    accessorKey: "number",
    header: "Train Number",
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
