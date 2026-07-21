// components/SidebarLayout.tsx
"use client";
import { useContext, useEffect, useState } from "react";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import { contextType } from "@/contextApi/CreateDataContext";
import { Context } from "@/contextApi/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const router = useRouter();


  const { state, boundActions } = useContext<contextType>(Context)
  const { updateUserData } = boundActions;


  // useEffect(() => {
  //   if (!state?.userData?._id) {
  //     updateUserData({ router, pathName });
  //   }
  // }, []);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");

  const handleToggle = () => setIsCollapsed((prev) => !prev);
  const handleItemClick = (item: string) => setActiveItem(item);

  return (
    <div className="app min-h-screen bg-white">
      {/* <CustomCursor /> */}
      <main className="flex h-screen">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={handleToggle}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />
        <div className="flex-1 gap-2 overflow-auto">
          <Header />
          <div className="p-4 bg-gray-50">{children}</div>
        </div>
      </main>
    </div>
  );
}
