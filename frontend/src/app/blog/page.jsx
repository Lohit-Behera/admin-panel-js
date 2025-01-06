"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllBlogs } from "@/lib/features/blogSlice";
import { useEffect } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";
import { useSearchParams } from "next/navigation";

function AllBlogs() {
  const dispatch = useDispatch();

  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  const getAllBlogs = useSelector((state) => state.blog.getAllBlogs.data);

  const getAllBlogsStatus = useSelector(
    (state) => state.blog.getAllBlogsStatus
  );

  const deleteBlogStatus = useSelector((state) => state.blog.deleteBlogStatus);

  useEffect(() => {
    dispatch(fetchGetAllBlogs());
  }, []);

  useEffect(() => {
    if (deleteBlogStatus === "succeeded") {
      dispatch(fetchGetAllBlogs());
    }
  }, [deleteBlogStatus]);
  return (
    <>
      {getAllBlogsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllBlogsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllBlogsStatus === "succeeded" ? (
        <DataTable
          columns={columns}
          data={getAllBlogs}
          filter="title"
          search={search}
        />
      ) : null}
    </>
  );
}

export default withAuth(AllBlogs);
