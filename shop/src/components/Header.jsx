"use client";
import dynamic from "next/dynamic";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
  }
);

function Header() {
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      <nav className="flex justify-end space-x-2">
        <ModeToggle />
      </nav>
    </header>
  );
}

export default Header;
