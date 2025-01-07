"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, LayoutGrid, NotebookPen, Package2 } from "lucide-react";
import { fetchGetCount } from "@/lib/features/baseSlice";
import { withAuth } from "@/components/withAuth";

function Home() {
  const dispatch = useDispatch();
  const getCount = useSelector((state) => state.base.getCount.data);
  const getCountStatus = useSelector((state) => state.base.getCountStatus);

  useEffect(() => {
    dispatch(fetchGetCount());
  }, []);
  return (
    <>
      {getCountStatus === "loading" ? (
        <p>Loading</p>
      ) : getCountStatus === "failed" ? (
        <p>Error</p>
      ) : getCountStatus == "succeeded" ? (
        <div className="w-full md:w-[90%] h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
            <div className="flex flex-col space-y-4 p-4 rounded-md border min-h-40">
              <h2 className="text-base md:text-xl font-semibold">
                Total Products
              </h2>
              <div className="h-full flex justify-between space-x-2 items-end">
                <Package2 />
                <span className="text-base md:text-xl font-semibold text-center">
                  {getCount.productCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 p-4 rounded-md border min-h-40">
              <h2 className="text-base md:text-xl font-semibold">
                Total Categories
              </h2>
              <div className="h-full flex justify-between space-x-2 items-end">
                <LayoutGrid />
                <span className="text-base md:text-xl font-semibold text-center">
                  {getCount.categoryCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 p-4 rounded-md border min-h-40">
              <h2 className="text-base md:text-xl font-semibold">
                Total Blogs
              </h2>
              <div className="h-full flex justify-between space-x-2 items-end">
                <NotebookPen />
                <span className="text-base md:text-xl font-semibold text-center">
                  {getCount.blogCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-4 p-4 rounded-md border min-h-40">
              <h2 className="text-base md:text-xl font-semibold">
                Total Banner
              </h2>
              <div className="h-full flex justify-between space-x-2 items-end">
                <Image />
                <span className="text-base md:text-xl font-semibold text-center">
                  {getCount.bannerCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
export default withAuth(Home);
