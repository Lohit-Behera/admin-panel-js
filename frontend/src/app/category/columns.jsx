"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, LockKeyhole, Pencil, Trash2, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchDeleteCategory,
  resetDeleteCategory,
} from "@/lib/features/categorySlice";
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
import { useDispatch } from "react-redux";
import { DataTableColumnHeader } from "@/components/data-table-column-header";

export const columns = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.thumbnail}
          alt={row.original.name}
          className="h-20 w-20 rounded-md object-cover"
        />
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" hideButton />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "subCategoryCount",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Sub Category Count" />
      );
    },
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {row.original.subCategories && row.original.subCategories.length}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Status" />;
    },
    cell: ({ row }) => {
      return (
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
      );
    },
  },
  {
    accessorKey: "update",
    header: "Update",
    cell: ({ row }) => {
      const router = useRouter();
      return (
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            router.push(`/category/update/${row.original._id}`);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const handleDeleteCategory = (id) => {
        const deleteCategoryPromise = dispatch(
          fetchDeleteCategory(id)
        ).unwrap();
        toast.promise(deleteCategoryPromise, {
          loading: "Deleting category...",
          success: (data) => {
            dispatch(resetDeleteCategory());
            return data.message || "Category deleted successfully";
          },
          error: (error) => {
            dispatch(resetDeleteCategory());
            return (
              error ||
              error.message ||
              "Failed to delete category. Please try again later"
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
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {row.original.name} and remove remove data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDeleteCategory(row.original._id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
    enableSorting: false,
  },
];
