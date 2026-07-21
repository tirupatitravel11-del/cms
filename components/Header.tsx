import { Context } from "@/contextApi/AuthContext";
import { contextType } from "@/contextApi/CreateDataContext";
import { Bell, LogOut, Settings, Shield } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import NotificationTable from "./tables/NotificationBell";
// import NotificationBell from "./tables/NotificationBell";

interface HeaderProps {
  onLogout: () => void;
}

const Header = () => {
  const { state, boundActions } = useContext<contextType>(Context);
  const { signOut, setNotificationData, setNotificationSeen } = boundActions;
  const router = useRouter();
  const [open, setOpen] = useState(false);


  const onLogout = async () => {
    // console.log("loggng out", state?.socket)
    signOut({ user_id: state?.userData?._id, router, token: state?.userData?.token, soc: state?.socket });

    // let result = await axios.post(process.env.apiUrl + '/api/logout', {withcredentials:true})
  };

  useEffect(() => {
    if (!state?.userData?._id) return;
    setNotificationData({ user_id: state?.userData?._id, page: 1 })
  }, [state?.userData?._id])

  const notifyIds: string[] = [];
  state?.notificationData?.forEach((data) => {
    if (!data.seen) {
      notifyIds.push(data?._id);
    }
  });

  const handleNotificationSeen = () => {
    setNotificationData({ user_id: state?.userData?._id, page: 1 })
    setNotificationSeen({ user_id: state?.userData?._id, notifyIds, setNotificationBadgeCount: boundActions.setNotificationBadgeCount, notificationBadgeCount: state?.notificationBadgeCount })
    setOpen(true);
  }

  // console.log(notifyIds, "==notifyids in header==");
  return (
    <header className={`border-b border-gray-200`}>
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center"></div>

          <div className="flex items-center space-x-4 font-semibold relative">
            <span className="px-4 py-2 text-black font-bold">{state?.userData?.name}</span>

            {/* <span className="absolute top-0 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{state?.notificationBadgeCount}</span> */}

            <button
              onClick={handleNotificationSeen}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-6 h-6" />
              {state?.notificationBadgeCount ?
                <span className="absolute top-0 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{state?.notificationBadgeCount}</span> : null}

            </button>
            {/* {notificationsMock.length} */}
            {/* <NotificationBell open={open} setOpen={setOpen} /> */}

            {/* <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-6 h-6" />
            </button> */}

            <button
              onClick={() => {
                onLogout();
              }}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header >
  );
};

export default Header;
