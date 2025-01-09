"use client";

import { fetchGetBanners } from "@/lib/features/bannerSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function Banner() {
  const dispatch = useDispatch();
  const banners = useSelector((state) => state.banner.getBanners.data);
  const bannersStatus = useSelector((state) => state.banner.getBannersStatus);
  useEffect(() => {
    dispatch(fetchGetBanners());
  }, []);
  return (
    <Carousel className="relative w-full md:w-[70%] mx-auto">
      <CarouselContent>
        {bannersStatus === "loading" ? (
          <div>Loading...</div>
        ) : (
          banners.map((banner) => (
            <CarouselItem key={banner._id}>
              <img
                src={banner.image}
                alt=""
                className="w-full max-h-[60vh] object-cover rounded-md"
              />
            </CarouselItem>
          ))
        )}
      </CarouselContent>
      <CarouselPrevious className="absolute left-0 rounded-none rounded-r-md" />
      <CarouselNext className="absolute right-0 rounded-none rounded-l-md" />
    </Carousel>
  );
}

export default Banner;
