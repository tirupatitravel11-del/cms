"use client";
// import CustomCursor from "@/components/CustomCursor";
import Dashboard from "@/components/Dashboard";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
// import TeacherDashboard from "@/components/TeacherDashboard";
// import StudentDashboard from "@/components/StudentDashboard";
import Header from "@/components/Header";
import { contextType } from "@/contextApi/CreateDataContext";
import { Context } from "@/contextApi/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
// import { CounselorDashboard } from "@/components/CounselorDashboard"
import axios from "axios";
import { io } from "socket.io-client";

const Page = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [user, setUser] = useState('student')
  const router = useRouter();
  const pathName = usePathname();

  const { state, boundActions } = useContext<contextType>(Context)
  const { updateUserData, setSocket, setNotificationData, setNotificationPerm, getNoticeCount } = boundActions;

  const [notifications, setNotifications] = useState([]);
  const searchParams = useSearchParams()
  const notifyId = searchParams.get("notifyId");
  const [courseList, setCourseList] = useState<any>([])

  useEffect(() => {
    if (!state?.userData?._id) {
      updateUserData({ router, pathName });
    }
  }, []);

  useEffect(() => {
    if(notifyId) {
      handleViewNotification(notifyId);
    }
  }, [notifyId]);
  
  const getCourseByInstructor = async () => {
    try {
      let res = await axios.post(
        process.env.apiUrl + `/api/get-all-courses-by-assigned-user`,
        {
          userId: state?.userData?._id
        },
        { withCredentials: true }
      );
      let data = res?.data?.courses;
      setCourseList(data);
    }
    // API call to get courses by instructor

    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (state?.userData?._id) {
      getCourseByInstructor();
    }
  }, [state?.userData]);
  
const setNoticeCount = async () => {
 let batchIds=[]
  if(state.userData.roleId.name == "student"){
    batchIds = courseList.map((course: any) => course.batchId._id)
  }else{
  batchIds = courseList.flatMap((course: any) => course.batches).map((batch: any) => batch.batchId)
  }


    try {
      let res = await axios.post(
        process.env.apiUrl + `/api/get-notice-count`,
        {
          batchId: batchIds,
          userId: state?.userData?._id
        },
        { withCredentials: true }
      ); 

        getNoticeCount(res?.data?.latestNoticeCount)
      
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  }
  useEffect(() => {
    if (courseList.length > 0 && state?.userData?._id) {
      setNoticeCount()
    }
  }, [courseList, state?.userData])



  const handleViewNotification = async (id: string) => {
    // logic to view notification details or mark as read
    try {
      let result = await axios.post(process.env.apiUrl + '/api/update-notification-visited', { notify_id: id, user_id: state?.userData?._id }, { withCredentials: true })
      setNotificationData((prev:any) => prev.map((notify: any) => notify._id === id ? { ...notify, visited: true } : notify))
    } catch (error) {
      console.error("Error marking notification as visited", error);
    }
  }

  

const checkNotificationPermission = () => {
  if (typeof window === "undefined") return;

  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      // console.log("Notification permission already granted.");
      setNotificationPerm({ status: true });

    } else if (Notification.permission === "denied") {
      // console.log("Notification permission denied.");
      setNotificationPerm({ status: false });

    } else {
      // default state
      setNotificationPerm({ status: false });

      // ⚠️ iOS issue here (see below)
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // console.log("Notification permission granted.");
          setNotificationPerm({ status: true });
        } else {
          setNotificationPerm({ status: false });
        }
      });
    }
  }
};
 useEffect(() => {
    if (!state?.userData?._id) return;
    if (state?.socket) return
    // if(!state?.notificationPerm) return;
      setSocket({ user_id: state.userData._id });
      checkNotificationPermission();

  
  }, [state?.userData?._id, state?.notificationPerm]);
    


  return (
    <>
      <div className="text-left flex bg-white p-2 border-gray-300 border rounded-md mt-2 mx-4">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 m-0 p-0">Dashboard</h1>
      </div>
      {
    
   
          state?.userData?.roleId?.name == "admin" ?
            <Dashboard /> :
            ""}
    </>


  );
}



const RenderPage = () => {
  return (
    <Suspense>
      <Page />
    </Suspense>
  );
}

export default RenderPage;