"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/userSlice";
import { LogIn, LogOut } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
    loading: () => <Skeleton className="w-10 h-10" />,
  }
);

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useSelector((state) => state.user.userInfo);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <header className="z-20 w-full sticky top-0 p-2 backdrop-blur bg-background">
      {isClient && (
        <nav
          className={`flex ${
            userInfo ? "justify-between" : "justify-end"
          } space-x-2`}
        >
          {userInfo && <SidebarTrigger />}
          <div className="flex justify-end space-x-2">
            {userInfo ? (
              <Button
                variant={"outline"}
                size="sm"
                onClick={() => dispatch(logout())}
              >
                <LogOut />
                Logout
              </Button>
            ) : (
              <Button
                variant={pathname === "/login" ? "default" : "outline"}
                size="sm"
                onClick={() => router.push("/login")}
              >
                <LogIn />
                Login
              </Button>
            )}
            <ModeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
