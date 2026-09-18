
"use client";

import ProtectedRoute from "@/components/Protectedroutes";
import CabBookingTable from "@/components/tables/CabBookingTable";
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
    if (!state?.userData?._id) {
      updateUserData({ router, pathName });
    }
  }, []);
  return (
    <div className="mx-auto">      
      <CabBookingTable />
    </div>
  );

}


export default page


