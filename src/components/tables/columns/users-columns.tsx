"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.role}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "lastLoginAt",
    header: "Last Login",
    cell: ({ row }) => {
      return row.original.lastLoginAt
        ? format(new Date(row.original.lastLoginAt), "MMM dd, yyyy HH:mm")
        : "Never";
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.active ? "default" : "destructive"}>
          {row.original.active ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
];
