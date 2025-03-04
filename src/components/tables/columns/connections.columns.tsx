"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Pencil,
  MapPin,
  Route,
  Ruler,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Connection } from "@/types";

export const connectionsColumns: ColumnDef<Connection>[] = [
  {
    accessorKey: "fromStation",
    header: "From",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-gray-800">
          {row.getValue("fromStation")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "toStation",
    header: "To",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Route className="h-4 w-4 text-blue-600" />
        <span className="font-medium text-gray-800">
          {row.getValue("toStation")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "distance",
    header: "Distance",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Ruler className="h-4 w-4 text-blue-600" />
        <span className="text-gray-700">{row.getValue("distance")} km</span>
      </div>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge
          className={`px-3 py-1 rounded-lg text-sm ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? (
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Active</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>Inactive</span>
            </div>
          )}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <MoreHorizontal className="h-5 w-5 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-lg shadow-md border"
          >
            <DropdownMenuItem
              asChild
              className="flex items-center space-x-2 hover:bg-gray-100 cursor-pointer"
            >
              <Link
                href={`/connections/edit/${row.original.id}`}
                className="flex items-center space-x-2"
              >
                <Pencil className="h-4 w-4 text-blue-600" />
                <span>Edit</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
