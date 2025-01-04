"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export const columns = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => (
      <img
        src={row.original.thumbnail}
        alt={row.original.name}
        className="h-20 w-20 rounded-md object-cover"
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="line-clamp-3">{row.original.name}</p>,
    enableHiding: false,
  },

  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="line-clamp-3">{row.original.category}</p>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="text-center">{row.original.amount}</p>,
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Discount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <p className="text-center">{row.original.discount}</p>,
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Selling Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-center">{row.original.sellingPrice}</p>
    ),
  },
  {
    accessorKey: "isPublic",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <p className="text-center">
        {row.original.isPublic ? "Public" : "Private"}
      </p>
    ),
  },
  {
    accessorKey: "update",
    header: () => <p className="hidden sm:table-cell">Update</p>,
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          size="icon"
          variant="outline"
          className="sm:flex justify-center hidden"
          onClick={() => router.push(`/product/update/${row.original._id}`)}
        >
          <Pencil />
        </Button>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
