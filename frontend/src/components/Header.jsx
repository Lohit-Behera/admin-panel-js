"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/userSlice";
import { LogIn, LogOut, Search } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Skeleton } from "./ui/skeleton";
const ModeToggle = dynamic(
  () => import("@/components/ModeToggle").then((mod) => mod.ModeToggle),
  {
    ssr: false,
    loading: () => <Skeleton className="w-10 h-10" />,
  }
);
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const userInfo = useSelector((state) => state.user.userInfo);

  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");

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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Search />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Search Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => router.push(`/product/${search}`)}
                  >
                    Search
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {userInfo ? (
              <Button
                variant={"destructive"}
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
