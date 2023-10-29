"use client";
import React, { Children } from "react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Box from "./Box";
import SideBarItem from "./SideBarItem";
import Library from "./Library";
import { song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";

interface sidebarprops {
  children: React.ReactNode;
  songs: song[];
}

const Sidebar: React.FC<sidebarprops> = ({ children, songs }) => {
  const Pathname = usePathname();
  const player= usePlayer();

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: Pathname !== "/search",
        href: "/",
      },
      {
        icon: BiSearch,
        label: "Search",
        active: Pathname === "/search",
        href: "/search",
      },
    ],
    [Pathname]
  );
  return (
    <div className={twMerge(`
    flex
    h-full

    `,
    player.activtedId && "h-[calc(100%-80px)]"
    )}>
      <div
        className="hidden
          md:flex
          flex-col
          gap-y-2
          bg-black
          h-full
          w-[300px]
          p-2
          "
      >
        <Box className="">
          <div
            className="
        flex
        flex-col
        gap-y-4
        px-5
        py-4
        "
          >
            {routes.map((item) => (
              <SideBarItem key={item.label} {...item} />
            ))}
          </div>
        </Box>
        <Box className="overflow-y-auto h-full">
          <Library songs={songs} />
        </Box>
      </div>
      <main className="h-full overflow-y-auto py-2 flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
