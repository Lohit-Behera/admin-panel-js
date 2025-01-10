"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetRecentProducts } from "@/lib/features/productSlice";
import Product from "./product";

function RecentProducts() {
  const dispatch = useDispatch();
  const recentProducts = useSelector(
    (state) => state.product.getRecentProducts.data
  );
  const getRecentProductsStatus = useSelector(
    (state) => state.product.getRecentProductsStatus
  );
  useEffect(() => {
    if (recentProducts.length === 0) {
      dispatch(fetchGetRecentProducts());
    }
  }, [dispatch]);
  return (
    <div>
      {getRecentProductsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getRecentProductsStatus === "failed" ? (
        <div>Error</div>
      ) : getRecentProductsStatus === "succeeded" ? (
        <div className="w-full md:w-[95%]">
          <h2 className="text-lg md:text-2xl font-semibold">Recent Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RecentProducts;
