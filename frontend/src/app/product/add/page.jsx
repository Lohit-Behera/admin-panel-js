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
import RichTextEditor from "@/components/TextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useEffect } from "react";
import { fetchGetAllCategoriesNames } from "@/lib/features/categorySlice";
import { withAuth } from "@/components/withAuth";

const createProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(500, { message: "Name must be at most 500 characters" }),
  affiliateLink: z
    .string()
    .url({ message: "Affiliate link must be a valid URL" }),
  productDescription: z.string().optional(),
  productDetail: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(2000, { message: "Description must be at most 2000 characters" }),
  images: z
    .array(
      z
        .any()
        .refine((file) => file instanceof File, {
          message: "Each thumbnail must be a file.",
        })
        .refine((file) => file?.size <= 3 * 1024 * 1024, {
          message: "Each thumbnail size must be less than 3MB.",
        })
        .refine((file) => ["image/jpeg", "image/png"].includes(file?.type), {
          message: "Only .jpg and .png formats are supported for thumbnails.",
        })
    )
    .min(1, { message: "At least one thumbnail is required." })
    .max(5, { message: "You can upload up to 5 thumbnails." }),

  totalPrice: z
    .number()
    .positive({ message: "Total price must be a positive number" })
    .min(1, { message: "Total price must be at least 1" }),
  discount: z
    .number()
    .positive({ message: "Discount must be a positive number" })
    .min(1, { message: "Discount must be at least 1" })
    .max(99, { message: "Discount must be at most 99" }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  quantity: z.number().positive({ message: "Price must be a positive number" }),
  isPublic: z.boolean(),
});

function AddProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
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
  });
  const form = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      productDescription: "",
      productDetail: "",
      affiliateLink: "",
      totalPrice: undefined,
      discount: undefined,
      category: "",
      quantity: undefined,
      images: undefined,
      isPublic: true,
    },
  });

  function onSubmit(values) {
    // Create a new FormData instance
    const formData = new FormData();

    // Append all values to the FormData object
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
        router.push(`/product?search=${data.data}`);
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Quantity"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Amount"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
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
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="Discount"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Discount in % must be between 1 and 99.
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
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Images</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          name="images"
                          onChange={(e) =>
                            field.onChange(Array.from(e.target.files || []))
                          }
                          placeholder="Images"
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
                <Tabs defaultValue="details" className="w-full">
                  <TabsList>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                    <TabsTrigger value="description">
                      Product Description
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <FormField
                      control={form.control}
                      name="productDetail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Detail</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="description">
                    <FormField
                      control={form.control}
                      name="productDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Description</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
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
