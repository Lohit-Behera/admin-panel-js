import Banner from "@/components/Banner";
import RecentBlogs from "@/components/recent-blog";
import RecentProducts from "@/components/recent-product";

export default function Home() {
  return (
    <div className="grid gap-6">
      <Banner />
      <h2 className="text-lg md:text-2xl font-semibold">Recent Products</h2>
      <RecentProducts />
      <h2 className="text-lg md:text-xl font-semibold">Recent Blogs</h2>
      <RecentBlogs />
    </div>
  );
}
