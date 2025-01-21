"use client";

import { fetchSearchProduct } from "@/lib/features/productSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function SearchProduct({ params }) {
  const dispatch = useDispatch();
  const searchProduct = useSelector(
    (state) => state.product.searchProduct.data
  );
  const searchProductStatus = useSelector(
    (state) => state.product.searchProductStatus
  );
  useEffect(() => {
    dispatch(fetchSearchProduct(params.slug));
  }, [dispatch, params.slug]);
  return (
    <>
      {searchProductStatus === "loading" ? (
        <div>Loading...</div>
      ) : searchProductStatus === "failed" ? (
        <div>Error</div>
      ) : searchProductStatus === "succeeded" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchProduct.map((product) => (
            <div key={product._id} className="grid gap-2 border p-4 rounded-md">
              <img
                src={product.thumbnail}
                alt={product.name}
                className="w-full h-44 rounded-md object-cover"
              />
              <h3 className="text-sm md:text-base font-semibold">
                {product.name}
              </h3>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default SearchProduct;
