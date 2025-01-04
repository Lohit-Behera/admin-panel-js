"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllBlogs } from "@/lib/features/blogSlice";
import { useLayoutEffect } from "react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { withAuth } from "@/components/withAuth";

function AllBlogs() {
  const dispatch = useDispatch();

  const getAllBlogs = useSelector((state) => state.blog.getAllBlogs.data);

  const getAllBlogsStatus = useSelector(
    (state) => state.blog.getAllBlogsStatus
  );

  useLayoutEffect(() => {
    if (getAllBlogs.length === 0) {
      dispatch(fetchGetAllBlogs());
    }
  }, []);
  return (
    <>
      {getAllBlogsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getAllBlogsStatus === "failed" ? (
        <div>Error</div>
      ) : getAllBlogsStatus === "succeeded" ? (
        <DataTable columns={columns} data={getAllBlogs} filter="title" />
      ) : null}
    </>
  );
}

export default withAuth(AllBlogs);
