"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
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
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 w-full h-full">
          {row.original.isPublic ? "Public" : "Private"}
        </div>
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
          className="sm:flex justify-center hidden"
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
