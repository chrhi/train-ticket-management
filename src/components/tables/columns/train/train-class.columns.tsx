"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TrainClass } from "@/types";
import { Badge } from "@/components/ui/badge";

export const trainClassColumns: ColumnDef<TrainClass>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Class Name",
    cell: ({ row }) => {
      // Apply different styling based on class type
      const classType = row.original.name.toLowerCase();
      let variant: "default" | "secondary" | "outline" = "default";

      if (classType.includes("economy")) {
        variant = "outline";
      } else if (classType.includes("business")) {
        variant = "secondary";
      }

      return <Badge variant={variant}>{row.original.name}</Badge>;
    },
  },
  {
    accessorKey: "pricePerKm",
    header: "Price Per Km",
    cell: ({ row }) => {
      // Format the price with currency symbol
      return `$${row.original.pricePerKm.toFixed(2)}`;
    },
  },
];
