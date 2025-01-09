"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetCategories } from "@/lib/features/categorySlice";
import { Loader2, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { fetchGetRecentProducts } from "@/lib/features/productSlice";
import { fetchGetRecentBlogs } from "@/lib/features/blogSlice";

const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.getCategories.data);
  const getCategoriesStatus = useSelector(
    (state) => state.category.getCategoriesStatus
  );

  const recentProducts = useSelector(
    (state) => state.product.getRecentProducts.data
  );
  const getRecentProductsStatus = useSelector(
    (state) => state.product.getRecentProductsStatus
  );

  const recentBlogs = useSelector((state) => state.blog.getRecentBlogs.data);
  const getRecentBlogsStatus = useSelector(
    (state) => state.blog.getRecentBlogsStatus
  );

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchGetCategories());
    }
    if (recentProducts.length === 0) {
      dispatch(fetchGetRecentProducts());
    }
    if (recentBlogs.length === 0) {
      dispatch(fetchGetRecentBlogs());
    }
  }, [dispatch]);
  return (
    <header className="flex flex-col space-y-4 z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex flex-wrap justify-center items-center md:justify-between gap-2">
        <h1 className="text-2xl font-bold">Logo</h1>
        <div className="relative flex h-9 w-full md:w-[50%] rounded-full border border-input bg-background shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 ring-ring">
          <Input
            className="h-auto border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 bg-transparent w-full"
            type="text"
            placeholder="Search"
          />
          <span className="px-1 py-1 cursor-pointer absolute inset-y-0 right-0 flex items-center rounded-r-full bg-primary hover:bg-primary/80">
            <Search className="w-6 h-6 mr-1" color="white" />
          </span>
        </div>
        <div className="flex justify-center space-x-1">
          <Button size="icon" variant="outline">
            <ShoppingCart />
          </Button>
          <ModeToggle />
        </div>
      </nav>
      <NavigationMenu className="w-[60%] mx-auto hidden md:flex border rounded-md">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Category</NavigationMenuTrigger>
            <NavigationMenuContent>
              {getCategoriesStatus === "loading" ? (
                <div className="flex justify-center items-center p-4 w-28">
                  <Loader2 className="animate-spin" />
                </div>
              ) : getCategoriesStatus === "failed" ? (
                <div className="p-4 w-28">Error</div>
              ) : getCategoriesStatus === "succeeded" ? (
                <div className="min-w-96">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/product/${category.name}`}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {category.name}
                      </NavigationMenuLink>
                    </Link>
                  ))}
                </div>
              ) : null}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Recent Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              {getRecentProductsStatus === "loading" ? (
                <div className="flex justify-center items-center p-4 w-28">
                  <Loader2 className="animate-spin" />
                </div>
              ) : getRecentProductsStatus === "failed" ? (
                <div className="p-4 w-28">Error</div>
              ) : getRecentProductsStatus === "succeeded" ? (
                <div className="grid grid-cols-2 gap-2 p-4 min-w-96">
                  {recentProducts.map((product) => (
                    <div
                      className="flex flex-col space-y-1 justify-center"
                      key={product._id}
                    >
                      <Link href={`/product/${product._id}`}>
                        <img
                          src={product.thumbnail}
                          alt=""
                          className="w-full h-20 object-cover rounded-md"
                        />
                      </Link>
                      <Link
                        className="text-sm line-clamp-1 hover:underline"
                        href={`/product/${product._id}`}
                      >
                        {product.name}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : null}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Recent Blogs</NavigationMenuTrigger>
            <NavigationMenuContent>
              {getRecentBlogsStatus === "loading" ? (
                <div className="flex justify-center items-center p-4 w-28">
                  <Loader2 className="animate-spin" />
                </div>
              ) : getRecentBlogsStatus === "failed" ? (
                <div className="p-4 w-28">Error</div>
              ) : getRecentBlogsStatus === "succeeded" ? (
                <div className="grid grid-cols-2 gap-2 p-4 min-w-96">
                  {recentBlogs.map((blog) => (
                    <div
                      className="flex flex-col space-y-1 justify-center"
                      key={blog._id}
                    >
                      <Link href={`/blog/${blog._id}`}>
                        <img
                          src={blog.thumbnail}
                          alt=""
                          className="w-full h-20 object-cover rounded-md"
                        />
                      </Link>
                      <Link
                        className="text-sm line-clamp-1 hover:underline"
                        href={`/blog/${blog._id}`}
                      >
                        {blog.title}
                      </Link>
                    </div>
                  ))}
                </div>
              ) : null}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/product" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Product
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/blog" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Blog
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}

export default Header;
