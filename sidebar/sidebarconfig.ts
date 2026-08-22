// sidebar.config.ts
import {
  Email,
  EmailOutlined,
  LockOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import {
  LayoutDashboard,
  CalendarDays,
  Settings,
  BookOpen,
  GraduationCap,
  UserPlus,
  UserCircle,
  BriefcaseBusiness,
  NotebookPen,
  BookUser,
  Notebook,
  NotepadText,
  Hand,
  Activity,
  Rss,
  Megaphone,
  Users,
  LockKeyhole,
  Network,
  Image,
  Car,
  Building2,
  CarTaxiFront,
  Road,
  Banknote,
  Hotel,
  Package,
} from "lucide-react";

export interface SidebarItemType {
  label: string;
  path: string;
  permission?: string | null;
  icon: React.ComponentType<any>;
  role?: ("admin" | "student" | "teacher" | "counselor")[];
  subMenu?: SidebarItemType[];
}

export const sidebarConfig: SidebarItemType[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    permission: null,
    icon: LayoutDashboard,
  },

  {
    label: "Change Password",
    path: "/changepassword",
    permission: "change_password",
    icon: LockOutlined,
  },
  // {
  //   label: "Profile",
  //   path: "/profile",
  //   permission: "profile",
  //   icon: PersonOutlined,
  //   role: ["admin", "counselor", "teacher", "student"],
  // },
  { label: "Vehicle Type", path: "/vehicletype", permission: "", icon: Car },
  { label: "States", path: "/states", permission: "", icon: Building2 },
  { label: "Cities", path: "/city", permission: "", icon: Building2 },
  { label: "Vehicle", path: "/vehicle", permission: "", icon: CarTaxiFront },
  { label: "Route", path: "/route", permission: "", icon: Road },
  { label: "RouteFare", path: "/routefare", permission: "", icon: Banknote },
  { label: "CabHub", path: "/cabhub", permission: "", icon: CarTaxiFront },
  { label: "HotelHub", path: "/hotelhub", permission: "", icon: Hotel },
  { label: "PackageHub", path: "/packagehub", permission: "", icon: Package },

  {
    label: "Role & Permission",
    path: "",
    permission: "permission",
    icon: Hand,
    role: ["admin"],
    subMenu: [
      {
        label: "Role",
        path: "/role",
        permission: null,
        icon: Users,
        role: ["admin"],
      },
      {
        label: "Permission",
        path: "/permission",
        permission: null,
        icon: LockKeyhole,
        role: ["admin"],
      },
      {
        label: "Role Permission Assign",
        path: "/rolepermissionassign",
        permission: null,
        icon: Network,
        role: ["admin"],
      },
    ],
  },
];
