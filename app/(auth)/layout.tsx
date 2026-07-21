"use client";
import SidebarLayout from "@/components/SidebarLayout";
import { Context } from "@/contextApi/AuthContext";
import { contextType } from "@/contextApi/CreateDataContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
