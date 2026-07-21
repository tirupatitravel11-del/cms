// Sidebar.tsx
"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Router,
  CalendarDays,
  Icon,
} from "lucide-react";
import { Context } from "@/contextApi/AuthContext";
import Link from "next/link";
import { contextType } from "@/contextApi/CreateDataContext";
import { sidebarConfig, SidebarItemType } from "@/sidebar/sidebarconfig";
import { usePathname, useRouter } from "next/navigation";
import { DateTime } from "luxon";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
}

export const sidebarContent = [
  {
    label: "",
    path: "",
    permission: "",
    icon: CalendarDays,
    role: [],
    subMenu: [
      {
        label: "",
        path: "",
        permission: "",
        icon: CalendarDays,
        role: [],
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  activeItem,
  onItemClick,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const { state, boundActions } = useContext<contextType>(Context);
  const { updateUserData } = boundActions;
  const permissions = state?.userData?.roleId?.permissions?.map((p: any) => p.name) || [];
  const pathName = usePathname();
  const router = useRouter();
  // const recentNoticeCount = state?.noticeCount?.map((notice: any) => DateTime.fromISO(notice?.created_at) < DateTime.now().minus({ days: 1 }))?.length || 0;

  const toggleExpand = (label: string) => {
    const newExpanded = new Set(expanded);
    newExpanded.has(label) ? newExpanded.delete(label) : newExpanded.add(label);
    setExpanded(newExpanded);
    // console.log(newExpanded);
  };

  // useEffect(() => {
  //     if (!state?.userData?._id) {
  //         updateUserData({ router, pathName })
  //     }
  // }, [state?.userData?._id])

  // const sidebarContent = useMemo<SidebarItemType[]>(() => {
  //   let roleName = state?.userData?.roleId?.name;

  //   return sidebarConfig
  //     .map((sidebar) => {
  //       if (
  //         !sidebar.role ||
  //         sidebar.role.includes(roleName as any) ||
  //         (permissions.includes("*") && sidebar.role.includes("admin"))
  //       ) {

  //         let mainLink = { ...sidebar };

  //         if (sidebar.subMenu && Array.isArray(sidebar.subMenu)) {
  //           mainLink.subMenu = sidebar.subMenu.filter((subItem: any) => true);
  //         }

  //         return mainLink;
  //       }

  //       return null;
  //     }).filter((item): item is SidebarItemType => Boolean(item));
  // }, [sidebarConfig, permissions]);

  const sidebarContent = useMemo<SidebarItemType[]>(() => {
    let roleName = state?.userData?.roleId?.name;

    return sidebarConfig
      .map((sidebar) => {
        // 🔹 Check main menu visibility
        const hasAccess =
          !sidebar.role ||
          sidebar.role.includes(roleName as any) ||
          (permissions.includes("*") && sidebar.role.includes("admin"));

        if (!hasAccess) return null;

        let mainLink = { ...sidebar };

        // 🔹 Filter submenu based on role
        if (sidebar.subMenu && Array.isArray(sidebar.subMenu)) {
          const filteredSubMenu = sidebar.subMenu.filter((subItem: any) => {
            return (
              !subItem.role ||
              subItem.role.includes(roleName as any) ||
              (permissions.includes("*") && subItem.role.includes("admin"))
            );
          });

          // 👉 If no submenu left, you can decide:
          // Option 1: hide parent
          if (filteredSubMenu.length === 0) {
            return null;
          }

          // Option 2 (alternative): show parent without submenu
          mainLink.subMenu = filteredSubMenu;
        }

        return mainLink;
      })
      .filter((item): item is SidebarItemType => Boolean(item));
  }, [sidebarConfig, permissions, state?.userData]);

  useEffect(() => {
    const newExpanded = new Set<string>();

    sidebarContent.forEach((item: any) => {
      if (item.subMenu?.some((sub: any) => pathName === sub.path)) {
        newExpanded.add(item.label);
      }
    });

    // ✅ only update if changed
    setExpanded((prev) => {
      const isSame =
        prev.size === newExpanded.size &&
        [...prev].every((val) => newExpanded.has(val));

      return isSame ? prev : newExpanded;
    });
  }, [pathName]);
  // const userSidebar = () => {
  //     const roleName = state?.userData?.roleId?.name;
  //     const sidebarContent = [];

  //     for (let sidebar of sidebarConfig) {
  //         if (!sidebar?.permission || permissions.includes(sidebar?.permission) || permissions.includes("*")) {
  //             let mainLink = { ...sidebar };

  //             if (sidebar.subMenu && Array.isArray(sidebar.subMenu)) {
  //                 mainLink.subMenu = sidebar.subMenu.filter(
  //                     (subItem) =>
  //                         !subItem?.permission ||
  //                         permissions.includes(subItem?.permission)

  //                 );
  //             }

  //             sidebarContent.push(mainLink);

  //         }

  //     }
  //                     setSidebarLink(sidebarContent);

  //     //   setSidebarLink(sidebarContent); // ✅ make sure to return this

  // }

  const canAccess = (item: SidebarItemType): boolean => {
    const roleName = state?.userData?.roleId?.name;
    // const permissions = state?.userData?.roleId?.permissions?.map((p: any) => p.name) || [];
    // console.log(permissions, "userpermission", roleName)
    // No permission required → always visible
    if (!item?.permission) return true;

    // If role restriction is set, enforce it
    // if (
    //   !item.role ||
    //   (Array.isArray(item.role) && !item.role.includes(roleName as "student" | "teacher"))
    // ) return false;

    // Admin with wildcard → access everything not restricted to student/teacher
    if (permissions.includes("*") && roleName === "admin") {
      if (
        Array.isArray(item.role) &&
        !item.role.includes(roleName as "student" | "teacher")
      ) {
        return false;
      } else {
        return true;
      }
    }

    // Normal case → check permission match
    return permissions.includes(item?.permission);
  };

  return (
    <div
      className={`bg-white shadow-lg transition-all ${isCollapsed ? "w-32" : "w-78"} h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!isCollapsed && (
          <div
            onClick={() => {
              router.push("/dashboard");
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-blue-500">Cyberous</span>
          </div>
        )}
        {isCollapsed && (
          <GraduationCap
            className="w-8 h-8 text-blue-500 mx-auto cursor-pointer"
            onClick={() => {
              router.push("/dashboard");
            }}
          />
        )}
        <button onClick={onToggle} className="p-1 rounded-lg hover:bg-gray-100">
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1  overflow-y-auto">
        <ul className="space-y-2 text-2xl font-bold">
          {sidebarContent?.map((item, i) => {
            let Icon = item?.icon;
            let hasSubmenu = item?.subMenu;
            const isActive = pathName === item?.path;
            let isNotice = item.label == "Notice"

            return (
              <li key={i}>
                <button
                  onClick={() => {
                    if (item?.subMenu) {
                      toggleExpand(item.label);
                    } else {
                      router.push(item?.path);
                    }
                  }}
                  className={`w-full  flex justify-between py-2 rounded-lg transition-all ${isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <div className={`flex gap-3 justify-center items-center `}>
                    {Icon && <Icon className="w-5 h-5" />}
                    {!isCollapsed && !item!.subMenu ? (
                      <Link href={item!.path}>
                        <span className="text-xl">
                          {!isCollapsed ? item!.label : ""}
                        </span>
                        {/* {isNotice?
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-4"> */}
                          {/* {state?.noticeCount? state?.noticeCount: 0} */}
                        {/* </span>:""} */}
                      </Link>
                    ) : (
                      <span className="text-xl">
                        {!isCollapsed ? item!.label : ""}
                      </span>
                    )}
                  </div>
                  {hasSubmenu && !isCollapsed && (
                    <div className="flex-shrink-0">
                      {expanded.has(item?.label) ? (
                        <ChevronUp className="w-4 h-4 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                      )}
                    </div>
                    // <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {hasSubmenu && expanded.has(item!.label) && !isCollapsed && (
                  <div className="ml-6 mt-1 space-y-1 font-semibold">
                    {item!.subMenu?.map((sub, j) => {
                      const isSubActive = pathName === sub.path; //  add this

                      return (
                        <Link
                          key={j}
                          href={sub.path}
                          className={`flex items-center gap-3 py-2 px-3 rounded-md text-xl ${isSubActive
                            ? "bg-blue-100 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          <sub.icon className="w-5 h-5" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      {/* <ul className="space-y-2 text-black">
                {sidebarContent.map((item, i) => (
                    <li key={i}>
                        <Link href={item?.path||""} className="block p-2 rounded">
                            {item?.label}
                        </Link>

                        {/* Render Submenu */}
      {/* {item?.subMenu && item?.subMenu.length > 0 && (
                            <ul className="ml-4 mt-1 space-y-1">
                                {item.subMenu.map((sub, j) => (
                                    <li key={j}>
                                        <Link
                                            href={sub?.path}
                                            className="block p-2 text-sm hover:bg-gray-600 rounded"
                                        >
                                            {sub?.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul> */}
    </div>
  );
};

export default Sidebar;
