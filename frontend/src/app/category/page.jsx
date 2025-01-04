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
  useEffect(() => {
    dispatch(fetchGetAllCategories());
  }, []);
  return (
    <>
      {getAllCategoriesStatus === "loading" ? (
        <p>Loading</p>
      ) : getAllCategoriesStatus === "failed" ? (
        <p>Error</p>
      ) : getAllCategoriesStatus === "succeeded" ? (
        <div className="w-full md:w-[95%] grid gap-6">
          <h2 className="text-lg md:text-2xl font-semibold">All Categories</h2>
          <DataTable columns={columns} data={categories} />
        </div>
      ) : null}
    </>
  );
}

export default withAuth(Category);
