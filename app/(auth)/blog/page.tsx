
"use client";

import BlogTable from "@/components/BlogComponent/BlogTable";
import ProtectedRoute from "@/components/Protectedroutes";
import { Context } from "@/contextApi/AuthContext";
import { contextType } from "@/contextApi/CreateDataContext";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

// Editor.js must be dynamic (client only)
// const Editor = dynamic(() => import(""), {
//   ssr: false,
// });

const page = () => {
  const router = useRouter();
  const pathName = usePathname();
  const { state, boundActions } = useContext<contextType>(Context)
  const { updateUserData } = boundActions;
  
  useEffect(() => {
    // console.log("Dashboard page useEffect called, userData:", state?.userData);
    if (!state?.userData?._id) {
      // console.log("Updating user data for dashboard", state?.userData?._id)
      updateUserData({ router, pathName});
    }
  }, []);
  return (
    <div className="mx-auto">
      <BlogTable />
    </div>
  );

}


export default page


