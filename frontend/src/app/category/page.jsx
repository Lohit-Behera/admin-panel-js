"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllCategories } from "@/lib/features/categorySlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";

function Category() {
  const dispatch = useDispatch();
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
  }, []);

  useEffect(() => {
    if (deleteCategoryStatus === "succeeded") {
      dispatch(fetchGetAllCategories());
    }
  }, [deleteCategoryStatus]);
  return (
    <>
      {getAllCategoriesStatus === "loading" ? (
        <p>Loading</p>
      ) : getAllCategoriesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesStatus === "succeeded" ? (
        <DataTable columns={columns} data={categories} />
      ) : null}
    </>
  );
}

export default withAuth(Category);
