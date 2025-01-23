"use client";

import * as React from "react";
import {
  GalleryVerticalEnd,
  List,
  Minus,
  Plus,
  SquarePlus,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Image, LayoutGrid, NotebookPen, Package2 } from "lucide-react";
const data = {
  navMain: [
    {
      title: "Product",
      icon: <Package2 />,
      items: [
        {
          icon: <SquarePlus />,
          title: "Add Product",
          url: "/product/add",
        },
        {
          icon: <List />,
          title: "All Product",
          url: "/product",
        },
      ],
    },
    {
      title: "Blog",
      icon: <NotebookPen />,
      items: [
        {
          icon: <SquarePlus />,
          title: "Add Blog",
          url: "/blog/add",
        },
        {
          icon: <List />,
          title: "All Blog",
          url: "/blog",
        },
      ],
    },
    {
      title: "Category",
      icon: <LayoutGrid />,
      items: [
        {
          icon: <SquarePlus />,
          title: "Add Category",
          url: "/category/add",
        },
        {
          icon: <List />,
          title: "All Category",
          url: "/category",
        },
      ],
    },
    {
      title: "Banner",
      icon: <Image />,
      items: [
        {
          icon: <SquarePlus />,
          title: "Add Banner",
          url: "/banner/add",
        },
        {
          icon: <List />,
          title: "All Banner",
          url: "/banner",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <>
      {isClient && userInfo && (
        <Sidebar {...props}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold">Logo</span>
                      <span className="">v1.0.0</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                {data.navMain.map((item, index) => (
                  <Collapsible
                    key={item.title}
                    defaultOpen={index === 1}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon}
                          {item.title}{" "}
                          <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {item.items?.length ? (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((item) => (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={item.url === pathname}
                                >
                                  <Link href={item.url}>
                                    {item.icon}
                                    {item.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      )}
    </>
  );
}
