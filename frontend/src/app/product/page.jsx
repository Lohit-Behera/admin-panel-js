"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllProducts } from "@/lib/features/productSlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";
import { useSearchParams } from "next/navigation";

function Product() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const getAllProducts = useSelector(
    (state) => state.product.getAllProducts.data
  );
  const getAllProductsStatus = useSelector(
    (state) => state.product.getAllProductsStatus
  );
  const deleteProductStatus = useSelector(
    (state) => state.product.deleteProductStatus
  );
  useEffect(() => {
    dispatch(fetchGetAllProducts());
  }, []);
  useEffect(() => {
    if (deleteProductStatus === "succeeded") dispatch(fetchGetAllProducts());
  }, [deleteProductStatus]);

  return (
    <>
      {getAllProductsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllProductsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllProductsStatus === "succeeded" ? (
        <DataTable columns={columns} data={getAllProducts} search={search} />
      ) : null}
    </>
  );
}

export default withAuth(Product);
