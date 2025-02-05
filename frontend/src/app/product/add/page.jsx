"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchCreateProduct } from "@/lib/features/productSlice";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { fetchGetAllCategoriesNames } from "@/lib/features/categorySlice";
import { withAuth } from "@/components/withAuth";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full" />,
});

const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(500, { message: "Name must be at most 500 characters" }),
  affiliateLink: z
    .string()
    .url({ message: "Affiliate link must be a valid URL" }),
  productDescription: z.string().optional(),
  productDescriptionImage: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Product description image must be a valid file.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Product description image size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
  productDetail: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  thumbnail: z
    .any()
    .refine((file) => file instanceof File, {
      message: "Thumbnail must be a valid file.",
    })
    .refine((file) => file?.size <= 3 * 1024 * 1024, {
      message: "Thumbnail size must be less than 3MB.",
    })
    .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
      message: "Only .jpg and .png formats are supported.",
    }),
  images: z
    .array(
      z
        .custom()
        .refine((file) => file instanceof File, "Each file must be valid.")
        .refine(
          (file) => file.size <= 3 * 1024 * 1024,
          (file) => ({
            message: `File ${file?.name || "uploaded"} exceeds 3MB limit.`,
          })
        )
        .refine(
          (file) => ["image/jpeg", "image/png"].includes(file.type),
          (file) => ({
            message: `File ${
              file?.name || "uploaded"
            } must be a .jpg or .png file.`,
          })
        )
    )
    .min(1, { message: "At least one thumbnail is required." })
    .max(5, { message: "You can upload up to 5 thumbnails." }),
  sellingPrice: z
    .number()
    .positive({ message: "Selling price must be a positive number" })
    .min(1, { message: "Selling price must be at least 1" }),
  originalPrice: z
    .number()
    .positive({ message: "Discount must be a positive number" })
    .min(1, { message: "Discount must be at least 1" }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  subCategory: z.string({
    required_error: "Please select a sub category.",
  }),
  size: z.string().min(1, { message: "Size must be at least 1 characters" }),
  isPublic: z.boolean(),
});

function AddProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const getAllCategoriesNames = useSelector(
    (state) => state.category.getAllCategoriesNames.data
  );
  const getAllCategoriesNamesStatus = useSelector(
    (state) => state.category.getAllCategoriesNamesStatus
  );

  useEffect(() => {
    if (getAllCategoriesNames.length === 0) {
      dispatch(fetchGetAllCategoriesNames());
    }
  }, [getAllCategoriesNames.length, dispatch]);

  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      productDescription: "",
      productDetail: "",
      affiliateLink: "",
      sellingPrice: undefined,
      originalPrice: undefined,
      category: "",
      subCategory: "",
      size: "",
      images: undefined,
      thumbnail: undefined,
      productDescriptionImage: undefined,
      isPublic: true,
    },
  });
  function onSubmit(values) {
    // Create a new FormData instance
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formData.append("images", file));
      } else {
        formData.append(key, value);
      }
    });

    // Dispatch the action with FormData
    const createProductPromise = dispatch(
      fetchCreateProduct(formData)
    ).unwrap();

    // Handle toast notifications
    toast.promise(createProductPromise, {
      loading: "Creating product...",
      success: (data) => {
        router.push(`/product/update/${data.data}`);
        return data.message || "Product created successfully";
      },
      error: (error) => {
        return (
          error.message ||
          error ||
          "Something went wrong while creating the product"
        );
      },
    });
  }
  return (
    <>
      {getAllCategoriesNamesStatus === "loading" ? (
        <p>Loading...</p>
      ) : getAllCategoriesNamesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesNamesStatus === "succeeded" ? (
        <Card className="w-full md:w-[95%] lg:w-[90%]">
          <CardHeader>
            <CardTitle>Create Product</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input placeholder="Size" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getAllCategoriesNames.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category.name}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subCategory"
                    render={({ field }) => {
                      const selectedCategoryObj = getAllCategoriesNames.find(
                        (category) => category.name === selectedCategory
                      );
                      const filteredSubCategories = selectedCategoryObj
                        ? selectedCategoryObj.subCategories
                        : [];

                      return (
                        <FormItem>
                          <FormLabel>Sub Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Sub Category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {filteredSubCategories.map((subCategory) => (
                                <SelectItem
                                  key={subCategory._id}
                                  value={subCategory.name}
                                >
                                  {subCategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          <FormDescription>
                            First select a category, then select a sub category.
                          </FormDescription>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Original Price"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number(e.target.value)
                                : undefined;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Full price of the product.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Selling Price"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value
                                ? Number(e.target.value)
                                : undefined;
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Discounted price of the product.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="affiliateLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiliate Link</FormLabel>
                      <FormControl>
                        <Input placeholder="Affiliate link" {...field} />
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
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            field.onChange(files);
                            form.trigger("images");
                          }}
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Product Public</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDetail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Detail</FormLabel>
                      <FormControl>
                        <RichTextEditor {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDescriptionImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description Image</FormLabel>
                      <FormControl className="cursor-pointer">
                        <Input
                          type="file"
                          onChange={(e) =>
                            field.onChange(e.target.files?.[0] || null)
                          }
                          placeholder="Product Description Image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <RichTextEditor {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="sm" className="w-full">
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

export default withAuth(AddProduct);
