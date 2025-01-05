"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { fetchCreateCategory } from "@/lib/features/categorySlice";
import { withAuth } from "@/components/withAuth";

const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" }),
  isPublic: z.boolean(),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Thumbnail size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
});

function AddCategory() {
  const dispatch = useDispatch();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      isPublic: true,
      thumbnail: undefined,
    },
  });

  const onSubmit = async (values) => {
    const createCategoryPromise = dispatch(
      fetchCreateCategory(values)
    ).unwrap();
    toast.promise(createCategoryPromise, {
      loading: "Creating category...",
      success: (data) => {
        router.push(`/category?search=${data.data}`);
        return data.message || "Category created successfully";
      },
      error: (error) => {
        return (
          error ||
          error.massage ||
          error.data.message ||
          "Failed to create category. Please try again later."
        );
      },
    });
  };
  return (
    <Card className="w-full md:w-[95%] lg:w-[90%]">
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl className="cursor-pointer">
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      placeholder="thumbnail"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Public</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default withAuth(AddCategory);
