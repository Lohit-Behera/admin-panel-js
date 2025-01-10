import Banner from "@/components/Banner";
import RecentProducts from "@/components/recent-product";

export default function Home() {
  return (
    <div className="grid gap-6">
      <Banner />
      <RecentProducts />
    </div>
  );
}
