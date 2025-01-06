"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  resetDeleteBanner,
  fetchDeleteBanner,
} from "@/lib/features/bannerSlice";
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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.image}
          alt=""
          className="h-20 w-20 rounded-md object-cover"
        />
      );
    },
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const handleDeleteBanner = (id) => {
        const deleteBannerPromise = dispatch(fetchDeleteBanner(id)).unwrap();
        toast.promise(deleteBannerPromise, {
          loading: "Deleting banner...",
          success: (data) => {
            dispatch(resetDeleteBanner());
            return data.message || "Banner deleted successfully";
          },
          error: (error) => {
            dispatch(resetDeleteBanner());
            return (
              error ||
              error.message ||
              "Failed to delete banner. Please try again later"
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
                This action cannot be undone. This will permanently delete the
                banner and remove remove data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => handleDeleteBanner(row.original._id)}
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
