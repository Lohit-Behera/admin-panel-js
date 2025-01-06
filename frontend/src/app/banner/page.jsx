"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetBanner } from "@/lib/features/bannerSlice";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

function Banner() {
  const dispatch = useDispatch();
  const getBanner = useSelector((state) => state.banner.getBanner.data);
  const getBannerStatus = useSelector((state) => state.banner.getBannerStatus);
  const deleteBannerStatus = useSelector(
    (state) => state.banner.deleteBannerStatus
  );
  useEffect(() => {
    dispatch(fetchGetBanner());
  }, []);

  useEffect(() => {
    if (deleteBannerStatus === "succeeded") {
      dispatch(fetchGetBanner());
    }
  }, [deleteBannerStatus]);
  return (
    <>
      {getBannerStatus === "loading" ? (
        <p>Loading</p>
      ) : getBannerStatus === "failed" ? (
        <p>Error</p>
      ) : getBannerStatus === "succeeded" ? (
        <DataTable columns={columns} data={getBanner} searchFunction={false} />
      ) : null}
    </>
  );
}

export default Banner;
