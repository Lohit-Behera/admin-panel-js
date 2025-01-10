"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowUp } from "lucide-react";

function ScrollToTop() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      {showScrollToTop && (
        <Button
          className="fixed bottom-10 right-10 rounded-full w-11 h-11 z-50"
          variant="secondary"
          onClick={(e) => scrollToTop(e)}
          size="icon"
        >
          <ArrowUp />
        </Button>
      )}
    </>
  );
}

export default ScrollToTop;
