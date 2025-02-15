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
import { fetchDeleteCollaboration } from "@/lib/features/collaborationSlice";

export const columns = [
  {
    accessorKey: "person",
    header: "Person",
    cell: ({ row }) => {
      return (
        <div className="grid gap-1">
          <p>{row.original.firstName + " " + row.original.lastName}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: () => (
      <div className="text-center min-w-[100px] ">Phone Number</div>
    ),
    cell: ({ row }) => {
      return <p className="text-center">{row.original.phoneNumber}</p>;
    },
  },
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => {
      return (
        <p className="text-center">
          {row.original.company ? row.original.company : "-"}
        </p>
      );
    },
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      return <p className="text-center">{row.original.message}</p>;
    },
  },
  {
    accessorKey: "delete",
    header: "Delete",
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const handleDeleteCategory = (id) => {
        const deleteCategoryPromise = dispatch(
          fetchDeleteCollaboration(id)
        ).unwrap();
        toast.promise(deleteCategoryPromise, {
          loading: "Deleting collaboration...",
          success: (data) => {
            dispatch(resetDeleteCategory());
            return data.message || "Collaboration deleted successfully";
          },
          error: (error) => {
            dispatch(resetDeleteCategory());
            return (
              error ||
              error.message ||
              "Failed to delete collaboration. Please try again later"
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
                This action cannot be undone. This will permanently delete
                Collaboration Message and remove data from servers.
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
