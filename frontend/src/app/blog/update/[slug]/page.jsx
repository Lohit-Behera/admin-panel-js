"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import { fetchGetBlog, fetchUpdateBlog } from "@/lib/features/blogSlice";
import dynamic from "next/dynamic";
import { withAuth } from "@/components/withAuth";
import { useEffect, useState } from "react";
import { Check, Pencil, X } from "lucide-react";
const RichTextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
});

const updateBlogSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(50, { message: "Title must be at most 50 characters" })
    .optional(),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(5000, { message: "Content must be at most 5000 characters" })
    .optional(),
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
    })
    .optional(),
  detailImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail is required.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Thumbnail size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    })
    .optional(),
  isPublic: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

function UpdateBlog({ params }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const getBlog = useSelector((state) => state.blog.getBlog.data);
  const getBlogStatus = useSelector((state) => state.blog.getBlogStatus);

  const [editThumbnail, setEditThumbnail] = useState(false);
  const [editDetailImage, setEditDetailImage] = useState(false);

  useEffect(() => {
    dispatch(fetchGetBlog(params?.slug));
  }, [params?.slug, dispatch]);

  const form = useForm({
    resolver: zodResolver(updateBlogSchema),
    defaultValues: {
      title: getBlog?.title,
      content: getBlog?.content || "",
      thumbnail: undefined,
      isPublic: getBlog?.isPublic,
      seoTitle: getBlog?.seoTitle,
      seoDescription: getBlog?.seoDescription,
      seoKeywords: getBlog?.seoKeywords,
    },
  });
  useEffect(() => {
    if (getBlogStatus === "succeeded") {
      form.reset({
        title: getBlog?.title || "",
        content: getBlog?.content || "",
        thumbnail: undefined,
        detailImage: undefined,
        isPublic: getBlog?.isPublic || true,
        seoTitle: getBlog?.seoTitle || "",
        seoDescription: getBlog?.seoDescription || "",
        seoKeywords: getBlog?.seoKeywords || "",
      });
    }
  }, [getBlogStatus, form, getBlog]);
  const onSubmit = async (values) => {
    const updateBlogPromise = dispatch(
      fetchUpdateBlog({ _id: getBlog?._id, ...values })
    ).unwrap();
    toast.promise(updateBlogPromise, {
      loading: "Updating blog... ",
      success: (data) => {
        router.push(`/blog`);
        return data.message || "Blog updated successfully";
      },
      error: (error) => {
        return error || "Failed to update blog. Please try again later.";
      },
    });
  };
  return (
    <div>
      {getBlogStatus === "loading" ? (
        <p>Loading</p>
      ) : getBlogStatus === "failed" ? (
        <p>Error</p>
      ) : getBlogStatus === "succeeded" ? (
        <Card className="w-full md:w-[95%] lg:w-[90%] mx-auto bg-transparent">
          <CardHeader>
            <CardTitle>Create Blog</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="space-y-4 bg-card p-2 md:p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
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
                        {editThumbnail ? (
                          <div className="flex items-center gap-2 w-full h-full justify-between">
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0] || null)
                                }
                                placeholder="thumbnail"
                              />
                            </FormControl>
                            <Button
                              variant={"outline"}
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                field.onChange(undefined);
                                setEditThumbnail(false);
                              }}
                            >
                              <X />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full h-full justify-between">
                            <img
                              src={getBlog?.thumbnail}
                              alt={getBlog?.title}
                              className="w-40 h-40 rounded-lg object-cover"
                            />
                            <Button
                              variant={"outline"}
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                setEditThumbnail(true);
                              }}
                            >
                              <Pencil />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="detailImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Detail Image</FormLabel>
                        {editDetailImage ? (
                          <div className="flex items-center gap-2 w-full h-full justify-between">
                            <FormControl>
                              <Input
                                type="file"
                                onChange={(e) =>
                                  field.onChange(e.target.files?.[0] || null)
                                }
                                placeholder="Detail Image"
                              />
                            </FormControl>
                            <Button
                              variant={"outline"}
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                field.onChange(undefined);
                                setEditDetailImage(false);
                              }}
                            >
                              <X />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full h-full justify-between">
                            <img
                              src={getBlog?.detailImage}
                              alt={getBlog?.title}
                              className="w-40 h-40 rounded-lg object-cover"
                            />
                            <Button
                              variant={"outline"}
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                setEditDetailImage(true);
                              }}
                            >
                              <Pencil />
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4 bg-card p-2 md:p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Public</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Public blog will be visible to everyone.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter SEO title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter SEO description"
                            rows={6}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seoKeywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Keywords</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter SEO Keywords"
                            rows={6}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="sm" className="w-full">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export default withAuth(UpdateBlog);
