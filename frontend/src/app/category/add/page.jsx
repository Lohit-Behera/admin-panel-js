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
import { useState } from "react";
import { Trash2 } from "lucide-react";

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

  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryIsPublic, setSubCategoryIsPublic] = useState(true);

  const form = useForm({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      isPublic: true,
      thumbnail: undefined,
    },
  });

  const onSubmit = async (values) => {
    const data = {
      name: values.name,
      isPublic: values.isPublic,
      thumbnail: values.thumbnail,
      subCategories: subCategories,
    };

    const createCategoryPromise = dispatch(fetchCreateCategory(data)).unwrap();
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
                      toast.warning("Please enter a name for the sub category");
                    } else if (
                      subCategories.some(
                        (subCategory) => subCategory.name === subCategoryName
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
                            const updatedSubCategories = [...subCategories];
                            updatedSubCategories[index].isPublic = e;
                            setSubCategories(updatedSubCategories);
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
  );
}

export default withAuth(AddCategory);
