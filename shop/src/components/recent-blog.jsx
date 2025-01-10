"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetRecentBlogs } from "@/lib/features/blogSlice";
import Blog from "./blog";

function RecentBlogs() {
  const dispatch = useDispatch();
  const recentBlogs = useSelector((state) => state.blog.getRecentBlogs.data);
  const getRecentBlogsStatus = useSelector(
    (state) => state.blog.getRecentBlogsStatus
  );
  useEffect(() => {
    if (recentBlogs.length === 0) {
      dispatch(fetchGetRecentBlogs());
    }
  }, [dispatch]);
  return (
    <div>
      {getRecentBlogsStatus === "loading" ? (
        <div>Loading...</div>
      ) : getRecentBlogsStatus === "failed" ? (
        <div>Error</div>
      ) : getRecentBlogsStatus === "succeeded" ? (
        <div className="w-full md:w-[95%]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {recentBlogs.map((blog) => (
              <Blog key={blog._id} blog={blog} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RecentBlogs;
