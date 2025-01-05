"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, LockKeyhole, Pencil, Trash2, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchDeleteBlog, resetDeleteBlog } from "@/lib/features/blogSlice";
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
    cell: ({ row }) => (
      <img
        src={row.original.thumbnail}
        alt={row.original.title}
        className="h-20 w-20 rounded-md object-cover"
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" hideButton />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
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
          className="flex justify-center"
          onClick={() => {
            router.push(`/blog/update/${row.original._id}`);
          }}
        >
          <Pencil />
        </Button>
      );
    },
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const handleDeleteBlog = (id) => {
        const deleteBlogPromise = dispatch(fetchDeleteBlog(id)).unwrap();
        toast.promise(deleteBlogPromise, {
          loading: "Deleting blog... ",
          success: (data) => {
            dispatch(resetDeleteBlog());
            return data.message || "Blog deleted successfully";
          },
          error: (error) => {
            dispatch(resetDeleteBlog());
            return (
              error ||
              error.message ||
              "Failed to delete blog. Please try again later"
            );
          },
        });
      };
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="icon" variant="destructive">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                {row.original.title} and remove remove data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDeleteBlog(row.original._id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
