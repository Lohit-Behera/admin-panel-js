"use client";

import { useDispatch, useSelector } from "react-redux";
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
import { withAuth } from "@/components/withAuth";
import { useEffect, useState } from "react";
import {
  fetchGetCategory,
  fetchUpdateCategory,
} from "@/lib/features/categorySlice";
import { Pencil, Trash2, X } from "lucide-react";

const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be at most 50 characters" })
    .optional(),
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
    })
    .optional(),
});
function UpdateCategory({ params }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const category = useSelector((state) => state.category.getCategory.data);

  const getCategoryStatus = useSelector(
    (state) => state.category.getCategoryStatus
  );

  const [editThumbnail, setEditThumbnail] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryIsPublic, setSubCategoryIsPublic] = useState(true);

  useEffect(() => {
    dispatch(fetchGetCategory(params.slug));
  }, [params.slug, dispatch]);

  const form = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      isPublic: true,
      thumbnail: undefined,
    },
  });

  useEffect(() => {
    if (getCategoryStatus === "succeeded" && category) {
      form.reset({
        name: category.name || "",
        isPublic: category.isPublic || true,
        thumbnail: undefined,
      });
      setSubCategories(category.subCategories);
    }
  }, [category, form, getCategoryStatus]);

  const onSubmit = async (values) => {
    const data = {
      _id: category?._id,
      name: values.name,
      isPublic: values.isPublic,
      thumbnail: values.thumbnail,
      subCategories: subCategories,
    };
    const updateCategoryPromise = dispatch(fetchUpdateCategory(data)).unwrap();

    toast.promise(updateCategoryPromise, {
      loading: "Updating category...",
      success: (data) => {
        dispatch(fetchGetCategory(params.slug));
        return data.message || "Category updated successfully";
      },
      error: (error) => {
        return (
          error ||
          error.message ||
          "An error occurred while updating the category"
        );
      },
    });
  };

  return (
    <>
      {getCategoryStatus === "loading" ? (
        <p>Loading</p>
      ) : getCategoryStatus === "failed" ? (
        <p>Error</p>
      ) : getCategoryStatus === "succeeded" ? (
        <Card className="w-full md:w-[95%] lg:w-[90%]">
          <CardHeader>
            <CardTitle>Update Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                            src={category?.thumbnail}
                            alt={category?.name}
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

                <h2 className="text-base md:text-lg font-semibold">
                  Add Sub Categories
                </h2>
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-4 p-4 rounded-md border min-h-40">
                    <div className="flex items-center gap-2 w-full h-full">
                      <Input
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        placeholder="Enter sub category name"
                      />
                    </div>
                    <div className="flex items-center gap-2 w-full h-full">
                      <Checkbox
                        checked={subCategoryIsPublic}
                        onCheckedChange={(e) => setSubCategoryIsPublic(e)}
                      />
                      <span>Is Public</span>
                    </div>
                    <Button
                      className="h-8"
                      onClick={(e) => {
                        e.preventDefault();
                        if (subCategoryName.length === 0) {
                          toast.warning(
                            "Please enter a name for the sub category"
                          );
                        } else if (
                          subCategories.some(
                            (subCategory) =>
                              subCategory.name === subCategoryName
                          )
                        ) {
                          toast.warning("Sub category name already exists");
                        } else {
                          setSubCategories([
                            ...subCategories,
                            {
                              name: subCategoryName,
                              isPublic: subCategoryIsPublic,
                            },
                          ]);
                          setSubCategoryName("");
                          setSubCategoryIsPublic(true);
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {subCategories.length > 0 && (
                    <div className="flex flex-col space-y-4 p-4 rounded-md border">
                      {subCategories.map((subCategory, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center gap-2 w-full h-full bg-muted-foreground/10 p-2 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <span>{index + 1}.</span>
                            <span>{subCategory.name}</span>
                            <Checkbox
                              checked={subCategory.isPublic}
                              onCheckedChange={(e) => {
                                setSubCategories((prevSubCategories) =>
                                  prevSubCategories.map((subCategory, i) =>
                                    i === index
                                      ? { ...subCategory, isPublic: e }
                                      : subCategory
                                  )
                                );
                              }}
                            />
                            <span>Is Public</span>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={(e) => {
                              e.preventDefault();
                              const updatedSubCategories = [...subCategories];
                              updatedSubCategories.splice(index, 1);
                              setSubCategories(updatedSubCategories);
                            }}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button className="w-full" type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

export default withAuth(UpdateCategory);
