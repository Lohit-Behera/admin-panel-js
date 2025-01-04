"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllProducts } from "@/lib/features/productSlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";

function Product() {
  const dispatch = useDispatch();
  const getAllProducts = useSelector(
    (state) => state.product.getAllProducts.data
  );
  const getAllProductsStatus = useSelector(
    (state) => state.product.getAllProductsStatus
  );
  useEffect(() => {
    dispatch(fetchGetAllProducts());
  }, []);

  return (
    <>
      {getAllProductsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllProductsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllProductsStatus === "succeeded" ? (
        <DataTable columns={columns} data={getAllProducts} />
      ) : null}
    </>
  );
}

export default Product;
