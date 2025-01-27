"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, LockKeyhole, Pencil, Trash2, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  fetchDeleteProduct,
  resetDeleteProduct,
} from "@/lib/features/productSlice";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

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
        <DataTableColumnHeader
          column={column}
          title="Product Name"
          hideButton
        />
      );
    },
    cell: ({ row }) => <p className="line-clamp-3">{row.original.name}</p>,
    enableHiding: false,
  },

  {
    accessorKey: "category",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell: ({ row }) => <p className="line-clamp-3">{row.original.category}</p>,
  },
  {
    accessorKey: "originalPrice",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Original Price" />;
    },
    cell: ({ row }) => (
      <p className="text-center">{row.original.originalPrice}</p>
    ),
  },
  {
    accessorKey: "discount",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Discount" />;
    },
    cell: ({ row }) => <p className="text-center">{row.original.discount}%</p>,
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Selling Price" />;
    },
    cell: ({ row }) => (
      <p className="text-center">{row.original.sellingPrice}</p>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => (
      <p className="text-center">
        {row.original.isPublic ? (
          <span className="flex items-center">
            <Users2 className="w-4 h-4 mr-1" /> Public
          </span>
        ) : (
          <span className="flex items-center">
            <LockKeyhole className="w-4 h-4 mr-1" /> Private
          </span>
        )}
      </p>
    ),
  },
  {
    accessorKey: "update",
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
  {
    accessorKey: "delete",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const handleDelete = (id) => {
        const deleteProductPromise = dispatch(fetchDeleteProduct(id)).unwrap();
        toast.promise(deleteProductPromise, {
          loading: "Deleting product...",
          success: (data) => {
            dispatch(resetDeleteProduct());
            return data.message || "Product deleted successfully";
          },
          error: (error) => {
            dispatch(resetDeleteProduct());
            return (
              error ||
              error.message ||
              "Failed to delete product. Please try again later"
            );
          },
        });
      };
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="destructive"
              className="sm:flex justify-center hidden"
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {row.original.name} and remove data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete(row.original._id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
];
