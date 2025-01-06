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
import { toast } from "sonner";
import { withAuth } from "@/components/withAuth";
import { fetchCreateBanner } from "@/lib/features/bannerSlice";

const createBannerSchema = z.object({
  image: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Image is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Image size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
});

function AddBanner() {
  const dispatch = useDispatch();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(createBannerSchema),
    defaultValues: {
      image: undefined,
    },
  });

  function onSubmit(values) {
    const createBannerPromise = dispatch(fetchCreateBanner(values)).unwrap();
    toast.promise(createBannerPromise, {
      loading: "Creating banner...",
      success: (data) => {
        router.push("/banner");
        return data.message || "Banner created successfully";
      },
      error: (error) => {
        return (
          error ||
          error.message ||
          "Failed to create banner. Please try again later."
        );
      },
    });
  }
  return (
    <Card className="w-full md:w-[95%] lg:w-[90%]">
      <CardHeader>
        <CardTitle>Add Banner</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" size="sm">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default withAuth(AddBanner);
