"use client";
import CityTable from "@/components/tables/CityTable";
import RoleTable from "@/components/tables/RoleTable";
import StateTable from "@/components/tables/StateTable";

import { Context } from "@/contextApi/AuthContext";
import { contextType } from "@/contextApi/CreateDataContext";
import { Building2, Car, Megaphone, User, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const page = () => {
  const { state, boundActions } = useContext<contextType>(Context);
  const { updateUserData } = boundActions;
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!state?.userData?._id) {
      updateUserData({ router, pathName });
    }
  }, []);

  return (
    <>
      <div className="text-left flex bg-white p-2 border-gray-300 border rounded-md my-2 mx-auto">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 m-0 p-0">State</h1>
      </div>
      <StateTable />
    </>
  );
};

export default page;
