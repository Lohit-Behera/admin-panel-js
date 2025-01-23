"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetProduct,
  fetchUpdateProduct,
} from "@/lib/features/productSlice";
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
import { fetchGetAllCategoriesNames } from "@/lib/features/categorySlice";
import { toast } from "sonner";
import { Pencil, X } from "lucide-react";
import { withAuth } from "@/components/withAuth";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("@/components/TextEditor"), {
  ssr: false,
  loading: () => <Skeleton className="h-[200px] w-full" />,
});

const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(500, { message: "Name must be at most 500 characters" })
    .optional(),
  affiliateLink: z
    .string()
    .url({ message: "Affiliate link must be a valid URL" })
    .optional(),
  productDescription: z.string().optional(),
  productDetail: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .optional(),
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
    .max(5, { message: "You can upload up to 5 thumbnails." })
    .optional(),
  originalPrice: z
    .number()
    .positive({ message: "Selling price must be a positive number" })
    .min(1, { message: "Selling price must be at least 1" })
    .optional(),
  discount: z
    .number()
    .positive({ message: "Discount must be a positive number" })
    .min(0, { message: "Discount must be at least 0" })
    .max(100, { message: "Discount must be at most 100" })
    .optional(),
  category: z
    .string({
      required_error: "Please select a category.",
    })
    .optional(),
  size: z
    .string()
    .min(1, { message: "Size must be at least 1 characters" })
    .max(50, { message: "Size must be at most 50 characters" }),
  isPublic: z.boolean().optional(),
});

function UpdateProduct({ params }) {
  const dispatch = useDispatch();
  const [editThumbnail, setEditThumbnail] = useState(false);
  const [sellingPrice, setSellingPrice] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const getProduct = useSelector((state) => state.product.getProduct.data);
  const getProductStatus = useSelector(
    (state) => state.product.getProductStatus
  );

  const getAllCategoriesNames = useSelector(
    (state) => state.category.getAllCategoriesNames.data
  );

  const getAllCategoriesNamesStatus = useSelector(
    (state) => state.category.getAllCategoriesNamesStatus
  );

  const form = useForm({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: getProduct?.name || "",
      affiliateLink: getProduct?.affiliateLink || "",
      productDescription: getProduct?.productDescription || "",
      productDetail: getProduct?.productDetail || "",
      images: undefined,
      originalPrice: getProduct?.originalPrice || undefined,
      discount: getProduct?.discount || undefined,
      category: getProduct?.category || "",
      size: String(getProduct?.size) || "",
      isPublic: getProduct?.isPublic || false,
    },
  });

  useEffect(() => {
    dispatch(fetchGetProduct(params.slug));
    dispatch(fetchGetAllCategoriesNames());
  }, [params.slug, dispatch]);

  useEffect(() => {
    if (getProduct && getProductStatus === "succeeded") {
      form.reset({
        name: getProduct.name || "",
        affiliateLink: getProduct.affiliateLink || "",
        productDescription: getProduct.productDescription || "",
        productDetail: getProduct.productDetail || "",
        images: undefined,
        originalPrice: getProduct.originalPrice || undefined,
        discount: getProduct.discount || undefined,
        category: getProduct.category || "",
        size: String(getProduct?.size) || "",
        isPublic: getProduct.isPublic || false,
      });
      setSellingPrice(getProduct.sellingPrice);
      setLoading(false);
    }
  }, [getProduct, form, getProductStatus]);

  function onSubmit(values) {
    // Create a new FormData instance
    const formData = new FormData();
    formData.append("sellingPrice", sellingPrice);
    Object.entries(values).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        value.forEach((file) => formData.append("images", file));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const updateProductPromise = dispatch(
      fetchUpdateProduct({ productId: getProduct._id, product: formData })
    ).unwrap();

    toast.promise(updateProductPromise, {
      loading: "Updating product...",
      success: (data) => {
        dispatch(fetchGetProduct(params.slug));
        setEditThumbnail(false);
        return data.message || "Product updated successfully";
      },
      error: (error) => {
        return (
          error ||
          error.message ||
          error.data?.message ||
          "Error updating product. Please try again later."
        );
      },
    });
  }

  return (
    <>
      {getProductStatus === "loading" ||
      getAllCategoriesNamesStatus === "loading" ||
      loading ? (
        <p>Loading...</p>
      ) : getProductStatus === "failed" ||
        getAllCategoriesNamesStatus === "failed" ? (
        <p>Error</p>
      ) : getProductStatus === "succeeded" ||
        getAllCategoriesNamesStatus === "succeeded" ? (
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
                              const newPrice = e.target.value
                                ? Number(e.target.value)
                                : undefined;
                              field.onChange(newPrice);

                              const discountValue = form.getValues("discount");

                              if (newPrice && discountValue) {
                                const calculatedSellingPrice = Math.round(
                                  newPrice - (newPrice * discountValue) / 100
                                );
                                setSellingPrice(calculatedSellingPrice);
                              } else {
                                setSellingPrice(undefined);
                              }
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
                            onChange={(e) => {
                              const newDiscount = e.target.value
                                ? Number(e.target.value)
                                : undefined;
                              field.onChange(newDiscount);

                              const originalPrice =
                                form.getValues("originalPrice");

                              if (
                                originalPrice &&
                                newDiscount &&
                                newDiscount <= 99
                              ) {
                                const calculatedSellingPrice = Math.round(
                                  originalPrice -
                                    (originalPrice * newDiscount) / 100
                                );
                                setSellingPrice(calculatedSellingPrice);
                              } else if (newDiscount === 0) {
                                setSellingPrice(originalPrice);
                              } else {
                                setSellingPrice(0);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          Discount in % must be between 0 and 100.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="sellingPrice">Total Price</Label>
                  <Input
                    id="sellingPrice"
                    disable
                    type="number"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Total Price"
                    value={sellingPrice}
                  />
                  <p className="text-muted-foreground text-sm ">
                    It will be calculated automatically based on original price
                    and discount.
                  </p>
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
                      <FormLabel>images</FormLabel>
                      {editThumbnail ? (
                        <>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png"
                                onChange={(e) => {
                                  const files = Array.from(
                                    e.target.files || []
                                  );
                                  field.onChange(files);
                                  form.trigger("images");
                                }}
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEditThumbnail(false);
                                }}
                              >
                                <X />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getProduct.images &&
                            getProduct.images.length > 0 && (
                              <>
                                {getProduct.images.map((image) => (
                                  <img
                                    key={image}
                                    src={image}
                                    alt=""
                                    className="h-32 w-32 rounded-md object-cover"
                                  />
                                ))}
                              </>
                            )}
                          <Button
                            variant="outline"
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

export default withAuth(UpdateProduct);
