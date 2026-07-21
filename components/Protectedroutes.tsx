// // ProtectedRoute.tsx
"use client";
import { contextType } from "@/contextApi/CreateDataContext";
import { Context } from "@/contextApi/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { sidebarConfig } from "@/sidebar/sidebarconfig";
import { useContext, useEffect } from "react";

// interface Props {
//   children: React.ReactNode;
//   allowedRoles: string[]; // ["admin", "teacher"]
// }

// const ProtectedRoute = ({ children, allowedRoles }: Props) => {
//   const router = useRouter();
//   const pathName = usePathname()
// const { state, boundActions } = useContext<contextType>(Context);
//   const { updateUserData } = boundActions;
//   useEffect(() => {
//     if (!state?.userData?._id) {
//       updateUserData({ router, pathName});
//     }

//   }, []);
//   const user:any = state?.userData;

//   useEffect(() => { 
//     console.log(allowedRoles, "allowedRoles in ProtectedRoute", user.roleId?.name)
//     if (!allowedRoles.includes(user.roleId?.name)) {
//       router.replace("/dashboard"); // logged in but not allowed
//     }
//   }, [state.userData, allowedRoles, router]);

//   if (!user || !allowedRoles.includes(user.roleId.name)) return null;

//   return <>{children}</>;
// };


// export default ProtectedRoute;

// ProtectedRoute.tsx



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { state, boundActions } = useContext<contextType>(Context);
  const pathName = usePathname();
  const { updateUserData } = boundActions;

  useEffect(() => {
    if (!state?.userData?._id) {
      updateUserData({ router, pathName });
    }
  }, []);
  // console.log(state.userData, "user details...........")

  useEffect(() => {
    const user: any = state?.userData;
    if (!user || user._id === "") return;
    const currentRole = user?.roleId?.name?.toLowerCase();
    if (!currentRole) {
      router.replace("/")
      return
    };


    // ✅ not logged in
    // if (!user?._id) {
    //   router.replace("/");
    //   return;
    // }

    const allRoutes = [
      ...sidebarConfig,
      ...sidebarConfig.flatMap((item) => item.subMenu || []),
    ];

    const route = allRoutes.find((r) => r.path === pathName);

    // console.log("Current Route:", route);
    // console.log("Current Role:", user?.roleId?.name);



    // ✅ role check
    if (route?.role?.length) {
      const allowedRoles = route.role.map((r: string) => r.toLowerCase());
      const currentRole = user?.roleId?.name?.toLowerCase();


      // console.log("Allowed Roles.........:", allowedRoles);
      // console.log("Current Role..........:", currentRole);

      if (!allowedRoles.includes(currentRole)) {
        router.replace("/dashboard");
        return;
      }


    }

  }, [router, pathName, state.userData]);


  return <>{children}</>;
};

export default ProtectedRoute;