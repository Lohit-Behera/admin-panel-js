"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllCategories } from "@/lib/features/categorySlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";
import { useSearchParams } from "next/navigation";

function Category() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const categories = useSelector(
    (state) => state.category.getAllCategories.data
  );

  const getAllCategoriesStatus = useSelector(
    (state) => state.category.getAllCategoriesStatus
  );

  const deleteCategoryStatus = useSelector(
    (state) => state.category.deleteCategoryStatus
  );
  useEffect(() => {
    dispatch(fetchGetAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (deleteCategoryStatus === "succeeded") {
      dispatch(fetchGetAllCategories());
    }
  }, [deleteCategoryStatus, dispatch]);
  return (
    <>
      {getAllCategoriesStatus === "loading" ? (
        <p>Loading</p>
      ) : getAllCategoriesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesStatus === "succeeded" ? (
        <DataTable columns={columns} data={categories} search={search || ""} />
      ) : null}
    </>
  );
}

export default withAuth(Category);
