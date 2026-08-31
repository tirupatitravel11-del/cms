"use client";
// import { AuthRoutes } from "@/route_config/config";
import createDataContext from "./CreateDataContext";

import axios from "axios";
import { io, Socket } from "socket.io-client";
import { DateTime } from "luxon";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";

import path from "path";
import { act } from "react";
export type notificationType = {
  // body_template_id: { content: string };
  // content:string,
  receiver_name: string;
  created_at: string;
  // data: [];
  seen: boolean;
  title: string;
  // type_id: number;
  updated_at: string;
  visited: boolean;
  user_id: string;
  notifcation_type: string;
  _id: string;
  body: string;
};
export type permissionType = {
  _id: string;
  label: string;
  created_at: string;
  updated_at: string;
};

axios.defaults.withCredentials = true;
// Reducers

export type stateType = {
  userData: {
    _id: string;
    email: string;
    name: string;
    photo: string;
    signup_method: number;
    OS: string;
    created_at: string;
    delete_request_at: string;
    email_verified: boolean;
    email_verified_at: string;
    isLoggedIn: boolean;
    status: number;
    time_zone: string;
    updated_at: string;
    updated_by: string;
    user_type_id: number;
    empNo: string;
    roleId: {
      created_at: string;
      name: string;
      permissions: permissionType[];
      updated_at: string;
      _id: string;
    };
    token: string;
  };
  userProfile: {
    photo: string;
    dob: string;
    gender: string;
    phone: string;
    address: string;
    dob_zone: string;
    about: string;
    admissionDate: string;
    bloodGroup: string;
    city: string;
    country: string;
    created_at: string;
    dateofBirth: string;
    dateofJoining: string;
    education: string;
    experience: string;
    familyOccupation: string;
    fatherName: string;
    isDeleted: false;
    landmark: string;
    motherName: string;
    registrationNo: string;
    religion: string;
    salary: 0;
    state: string;
    updated_at: string;
    updated_by: string;
    userId: string;
    zipCode: string;
  };
  getUserDetails: {};
  userToken: string | null;
  webToken: string | null;
  isLoading: boolean;
  isSignout: boolean;
  ads: [];
  profiles: [];
  allCategory: [];
  isSignIn: boolean;
  adBookmarks: [];
  adsCount: number;
  myAds: [];
  otherAds: [];
  myAdsCount: number;
  otherAdsCount: number;
  ongoing: [];
  ongoingCount: number;
  accepted: [];
  acceptedCount: number;
  rejected: [];
  rejectedCount: number;
  bestMatches: [];
  bestMatchesCount: number;
  businessBookmarks: [];
  notifications: [];
  badgeCount: number;
  notif_Count: number;
  socket: Socket<any, any> | null;
  notificationPerm: boolean;
  chats: [];
  all_nseen: {};
  message_notification: number;
  total_chats: number;
  block_list: [];
  isSubscribed: boolean;
  plan_id: number;
  subscription_start: string;
  subscription_end: string;
  cancel_request: boolean;
  subscription_method: null;
  next_billing_time: null;
  subscription_id: null;
  isTrial: null;
  trial_start: null;
  trial_end: null;
  all_reviews: [];
  all_reviews_count: number;
  ad_bookmark_count: number;
  business_bm_count: number;
  paypal_payment: boolean;
  notifCurrentDate: string;
  allMeets: [];
  allMeetCount: number;
  allMeetInvites: [];
  allMeetInvitesCount: number;
  friendList: [];
  friend_count: number;
  meetTravelStart: boolean;
  destinationCord: null;
  meetName: string;
  meetId: null;
  LWPRef: null;
  currentLN: string;
  isMyMeet: boolean;
  meetDeleteCount: number;
  updateMyMeet: boolean;
  updateMeetInvite: boolean;
  backgroundMeetData: {};
  allFriendCount: number;
  isSideBarNavOpen: boolean;
  avatar_list: string[];
  staging_subscription: {
    price_id: string;
    plan_id: string;
    plan_type_id: string;
    plan_name: string;
    plan_price: string;
    plan_interval: string;
    address: string;
    state: string;
    country: string;
  };
  sideSubMenuDropDown: boolean;

  userSubscriptionData: {
    user_id: string;
    plan_type_id: string;
    stripe_cus_id: string;
    plan_id: string;
    plan_name: string;
    stripe_plan_id: string;
    isSubscribed: boolean;
    isPayPerInterval: boolean;
    isFreePlan: boolean;
    subscription_id: string;
    subscription_method: number;
    cancel_request: boolean;
    subscription_start: string;
    subscription_end: string;
    trial_start: string;
    trial_end: string;
    next_billing_time: string;
    interval: string;
    subscriptionPlanName: string;
  };
  notificationData: notificationType[];
  notificationCount: number;
  notificationBadgeCount: number;
  editedAvatarId: string;
  refreshAvatarList: boolean;
  loadingContent: boolean;
  loadingNotificationData: boolean;
  urlData: any;
  noticeCount: number;
};
type actionType = {
  type: string;
  payload: any;
  [key: string]: string | any;
};

export type authReducerType = (
  state: stateType,
  action: actionType,
) => stateType;
export type actionFunctionType = (
  dispatch: React.Dispatch<actionType>,
) => (fn: any) => Promise<void>;
export type boundAction = (fn: any) => Promise<void>;
export type contextActionType = {
  signIn: actionFunctionType;
  signInWithGoogle: actionFunctionType;
  signInWithFacebook: actionFunctionType;
  signOut: actionFunctionType;
  updateUserData: actionFunctionType;

  updateUserProfile: actionFunctionType;
  fetchUpdatedProfileData: actionFunctionType;

  setSignInStatus: actionFunctionType;
  setLoadingStatus: actionFunctionType;

  getNotifications: actionFunctionType;
  setNotificationSeen: actionFunctionType;
  setNotificationVisited: actionFunctionType;
  getChats: actionFunctionType;

  // modifyNotification:actionFunctionType,

  getUnseenMessages: actionFunctionType;

  verifyCode: actionFunctionType;

  // setNotificationBadgeCount :actionFunctionType,
  toggleSideBar: actionFunctionType;
  setStagingSubscription: actionFunctionType;
  toggleSideSubMenu: actionFunctionType;
  updateUserActivity: actionFunctionType;
  setSocket: actionFunctionType;
  getUserSubscriptionData: actionFunctionType;
  setNotificationPerm: actionFunctionType;
  setNotificationData: actionFunctionType;
  setNotificationCount: actionFunctionType;
  setNotificationBadgeCount: actionFunctionType;
  setNotificationMessage: actionFunctionType;
  setEditedAvatarId: actionFunctionType;
  onRefreshAvatarList: actionFunctionType;
  setUrlData: actionFunctionType;

  [key: string]: actionFunctionType;
};
export type boundActionType = {
  signIn: boundAction;
  signInWithGoogle: boundAction;
  signInWithFacebook: boundAction;
  signOut: boundAction;
  updateUserData: boundAction;
  updateUserProfile: boundAction;
  fetchUpdatedProfileData: boundAction;
  setSignInStatus: boundAction;
  setLoadingStatus: boundAction;
  getNotifications: boundAction;
  setNotificationSeen: boundAction;
  setNotificationVisited: boundAction;
  getChats: boundAction;
  toggleSideBar: boundAction;
  toggleSideSubMenu: boundAction;
  updateUserActivity: boundAction;
  // modifyNotification:actionFunctionType,
  getUnseenMessages: boundAction;
  verifyCode: boundAction;
  setStagingSubscription: boundAction;
  setSocket: boundAction;
  getUserSubscriptionData: boundAction;
  setNotificationPerm: boundAction;
  setNotificationData: boundAction;
  setNotificationCount: boundAction;
  setNotificationBadgeCount: boundAction;
  setNotificationMessage: boundAction;
  setEditedAvatarId: boundAction;
  onRefreshAvatarList: boundAction;
  setUrlData: boundAction;
  getNoticeCount: boundAction;

  [key: string]: boundAction;
};
export const initialBoundActions = {
  signIn: async () => {},
  signInWithGoogle: async () => {},
  signInWithFacebook: async () => {},
  signOut: async () => {},
  updateUserData: async () => {},
  updateUserProfile: async () => {},
  fetchUpdatedProfileData: async () => {},
  setSignInStatus: async () => {},
  setLoadingStatus: async () => {},
  getNotifications: async () => {},
  setNotificationSeen: async () => {},
  setNotificationVisited: async () => {},
  getChats: async () => {},
  // modifyNotification:actionFunctionType,
  getUnseenMessages: async () => {},
  verifyCode: async () => {},
  // setNotificationBadgeCount :async()=>{},
  toggleSideBar: async () => {},
  setStagingSubscription: async () => {},
  toggleSideSubMenu: async () => {},
  updateUserActivity: async () => {},
  setSocket: async () => {},
  getUserSubscriptionData: async () => {},
  setNotificationPerm: async () => {},
  setNotificationData: async () => {},
  setNotificationCount: async () => {},
  setNotificationBadgeCount: async () => {},
  setNotificationMessage: async () => {},
  setEditedAvatarId: async () => {},
  onRefreshAvatarList: async () => {},
  setUrlData: async () => {},
  getNoticeCount: async () => {},
};
const AuthReducer: authReducerType = (
  state: stateType,
  action: actionType,
): stateType => {
  if (action.type === "SIGN_IN") {
    return {
      ...state,
      isSignout: false,
      userToken: action.payload,
      webToken: action.payload,
      ads: [],
      profiles: [],
      isSignIn: true,
    };
  } else if (action.type === "SIGN_OUT") {
    return {
      ...state,
      userData: {
        _id: "",
        email: "",
        name: "",
        photo: "",
        signup_method: -1,
        OS: "",
        created_at: "",
        delete_request_at: "",
        email_verified: false,
        email_verified_at: "",
        isLoggedIn: false,
        status: 0,
        time_zone: "",
        updated_at: "",
        updated_by: "",
        user_type_id: 0,
        empNo: "",
        roleId: {
          created_at: "",
          name: "",
          permissions: [],
          updated_at: "",
          _id: "",
        },
        token: "",
      },
      userProfile: {
        dob: "",
        gender: "",
        phone: "",
        photo: "",
        address: "",
        dob_zone: "",
        about: "",
        admissionDate: "",
        bloodGroup: "",
        city: "",
        country: "",
        created_at: "",
        dateofBirth: "",
        dateofJoining: "",
        education: "",
        experience: "",
        familyOccupation: "",
        fatherName: "",
        isDeleted: false,
        landmark: "",
        motherName: "",
        registrationNo: "",
        religion: "",
        salary: 0,
        state: "",
        updated_at: "",
        updated_by: "",
        userId: "",
        zipCode: "",
      },
      getUserDetails: [],
      isSignout: true,
      userToken: null,
      webToken: null,
      ads: [],
      profiles: [],
      allCategory: [],
      isSignIn: false,
      notifications: [],
      badgeCount: 0,
      notif_Count: 0,
      chats: [],
      all_nseen: {},
      message_notification: 0,
      total_chats: 0,
      block_list: [],
      plan_id: 0,
      isSubscribed: false,
      subscription_start: "",
      subscription_end: "",
      cancel_request: false,
      subscription_method: null,
      next_billing_time: null,
      subscription_id: null,
      isTrial: null,
      trial_start: null,
      trial_end: null,
      paypal_payment: false,
      notifCurrentDate: "",
      destinationCord: null,

      LWPRef: null,
      currentLN: "",
      isMyMeet: false,
      isSideBarNavOpen: true,
      sideSubMenuDropDown: false,
      staging_subscription: {
        price_id: "",
        plan_id: "",
        plan_type_id: "",
        plan_name: "",
        plan_price: "",
        plan_interval: "",
        address: "",
        state: "",
        country: "US",
      },
      userSubscriptionData: {
        user_id: "",
        plan_type_id: "",
        stripe_cus_id: "",
        plan_id: "",
        plan_name: "",
        stripe_plan_id: "",
        isSubscribed: false,
        isPayPerInterval: false,
        isFreePlan: false,
        subscription_id: "",
        subscription_method: 0,
        cancel_request: false,
        subscription_start: "",
        subscription_end: "",
        trial_start: "",
        trial_end: "",
        next_billing_time: "",
        interval: "",
        subscriptionPlanName: "",
      },
      socket: null,
      notificationData: [],
      notificationCount: 0,
      notificationBadgeCount: 0,
      editedAvatarId: "",
      refreshAvatarList: false,
      loadingContent: false,
      loadingNotificationData: false,
      urlData: null,
      noticeCount: 0,
    };
  } else if (action.type === "USER_DATA") {
    return {
      ...state,
      userData: action.payload,
      isSignIn: true,
    };
  } else if (action.type === "UPDATE_TOKEN") {
    return {
      ...state,
      webToken: action.payload.token,
    };
  } else if (action.type === "UPDATE_USER_DATA") {
    return {
      ...state,
      userData: action.payload,
    };
  } else if (action.type === "UPDATE_PROFILE") {
    return {
      ...state,
      userProfile: action.payload,
    };
  } else if (action.type === "GET_ALL_PROFILE") {
    return {
      ...state,
      profiles: action.payload,
    };
  } else if (action.type === "GET_CATEGORY") {
    return {
      ...state,
      allCategory: action.payload,
    };
  } else if (action.type === "SIGNIN_STATUS") {
    return {
      ...state,
      isSignIn: true,
      isLoading: false,
    };
  } else if (action.type === "LOADING_STATUS") {
    return {
      ...state,

      isLoading: action.payload,
    };
  } else if (action.type == "BADGE") {
    return {
      ...state,
      badgeCount: action.payload,
    };
  } else if (action.type == "CLEAR_NOTIFICATION") {
    return {
      ...state,
      notificationData: [],
      notificationCount: 0,
      notificationBadgeCount: 0,
    };
  } else if (action.type == "SET_NSEEN") {
    return {
      ...state,
      all_nseen: action.payload,
    };
  } else if (action.type == "CLEAR_NSEEN") {
    return {
      ...state,
      all_nseen: {},
    };
  } else if (action.type == "SET_MNC") {
    return {
      ...state,
      message_notification: 1 + state.message_notification,
    };
  } else if (action.type == "CLEAR_SOCKET") {
    return {
      ...state,
      socket: null,
    };
  } else if (action.type == "SET_TOTAL_CHATS") {
    return {
      ...state,
      total_chats: action.payload,
    };
  } else if (action.type == "CLEAR_TOTAL_CHATS") {
    return {
      ...state,
      total_chats: 0,
      chats: [],
    };
  } else if (action.type == "BLOCK_LIST") {
    return {
      ...state,
      block_list: action.payload,
    };
  } else if (action.type == "SUB_CANCEL_REQ") {
    return {
      ...state,
      cancel_request: action.payload,
    };
  }
  // else if (action.type == "CLEAR_ALL_REVIEWS") {
  //   return {
  //     ...state,
  //     all_reviews: [],
  //     all_reviews_count: 0

  //   }
  // }
  else if (action.type == "PAYPAL_PAYMENT") {
    return {
      ...state,
      paypal_payment: action.payload,
    };
  } else if (action.type == "SET_NOTIF_DATE") {
    return {
      ...state,
      notifCurrentDate: action.payload,
    };
  } else if (action.type == "SET_LWP") {
    return {
      ...state,
      LWPRef: action.payload,
    };
  } else if (action.type == "SET_CURRENTLN") {
    return {
      ...state,
      currentLN: action.payload,
    };
  } else if (action.type == "UPDATE_AVATAR_STAGING_DETAILS") {
    return {
      ...state,
    };
  } else if (action.type == "SET_SIDEBAR") {
    if (action.payload.value != "") {
      return {
        ...state,

        isSideBarNavOpen: action.payload.value,
      };
    } else {
      return {
        ...state,
        isSideBarNavOpen: !state.isSideBarNavOpen,
      };
    }
  } else if (action.type == "SET_SUB_SIDEBAR") {
    if (action.payload.value != "") {
      return {
        ...state,

        sideSubMenuDropDown: action.payload.value,
      };
    } else {
      return {
        ...state,
        sideSubMenuDropDown: !state.isSideBarNavOpen,
      };
    }
  } else if (action.type == "SET_STAGING_SUBSCRIPTION") {
    const {
      price_id,
      address,
      state_name,
      country,
      plan_id,
      plan_name,
      plan_price,
      plan_type_id,
      plan_interval,
    } = action.payload;

    return {
      ...state,
      staging_subscription: {
        price_id,
        address,
        state: state_name,
        country,
        plan_id,
        plan_name,
        plan_price,
        plan_type_id,
        plan_interval,
      },
    };
  } else if (action.type == "SET_USER_SUBSCRIPTION_DATA") {
    return {
      ...state,
      userSubscriptionData: { ...action.payload },
    };
  } else if (action.type == "SOCKET") {
    let soc = action.payload.socket;
    soc.on("connect", () => {
      soc.emit("user-online", {
        socket_id: soc.id,
        user_id: state.userData._id,
      });
    });
    soc.on("new-lead", (message: any) => {
      const notification = new window.Notification(message.title, {
        body: message.body,
        icon: "/favicon.ico", // optional
        // data: { url: message.url }, // optional, for click handling
      });
      action.payload.setNotificationData({ user_id: state.userData._id });
    });

    return {
      ...state,
      socket: action.payload.socket,
    };
  } else if (action.type == "SET_NOTIFICATIONPERM") {
    return {
      ...state,
      notificationPerm: action.payload.status,
    };
  } else if (action.type == "SET_NOTIFICATION_DATA") {
    return {
      ...state,
      notificationData: [...state.notificationData, ...action.payload],
      // notificationBadgeCount:action.payload.nsCount,
      // notificationCount:action.payload.notifCount
    };
  } else if (action.type == "SET_NOTIFICATION_COUNT") {
    return {
      ...state,
      notificationCount: action.payload,
    };
  } else if (action.type == "SET_NOTIFICATION_BADGE_COUNT") {
    return {
      ...state,
      notificationBadgeCount: action.payload,
    };
  } else if (action.type == "SET_EDITED_AVATAR_ID") {
    return {
      ...state,
      editedAvatarId: action.payload,
    };
  } else if (action.type == "REFRESH_AVATARS") {
    return {
      ...state,
      refreshAvatarList: action.payload,
    };
  } else if (action.type == "LOADING_CONTENT") {
    return {
      ...state,
      loadingContent: action.payload,
    };
  } else if (action.type == "LOADING_NOTIF_DATA") {
    return {
      ...state,
      loadingNotificationData: action.payload,
    };
  } else if (action.type == "URL_DATA") {
    return {
      ...state,
      urlData: action.payload,
    };
  } else if (action.type == "NOTICE_COUNT") {
    return {
      ...state,
      noticeCount: action.payload,
    };
  } else {
    return { ...state };
  }
};

// actions (This code can be written in another file)

const verifyCode: actionFunctionType = (dispatch) => {
  return async ({
    email,
    code,
    navigation,
    setError,
    setVisibleSnack,
    setVisibleSnackErr,
    setUpdateStatus,
    setLoading,
  }) => {
    try {
      setLoading(true);
      // let res = await instance.post("/users/verifyemailcode",{email,code})
      // if(res.data?.verified){
      //   await AsyncStorage.setItem("user_id",res.data.userData._id.toString())
      //   await AsyncStorage.setItem("token",res.data.token)
      //   dispatch({type:"USER_DATA",payload:res.data?.userData})
      //     navigation.navigate("HomeScreen")
      // }
      setLoading(false);
    } catch (error) {
      // if(error?.response?.data?.message){
      //   setError(error.response.data.message)
      // }else{
      //   setError("Error occured")
      // }

      setVisibleSnackErr(true);
      setLoading(false);
    }
  };
};

// const signIn: actionFunctionType = (dispatch) => {
//   return async ({
//     email,
//     password,
//     navigation,
//     setLoading,
//     setError,
//     setNeedEmailVerification,
//     // setSignUpEmail,
//     // setEmail,
//     // setPassword,
//     // setDisable,
//     // setVisibleSnackErr,
//     // mode,
//     // setMode = null,
//     // backHand,
//     // setRequireEmailVerification,
//     router,
//     // updateUserActivity,
//     // pathName,
//     // setSocket,
//   }) => {
//     try {
//       dispatch({ type: "LOADING_CONTENT", payload: true });
//       setLoading(true)
//       let response;
//       response = await axios.post(process.env.apiUrl + "/api/web-signin", {
//         email,
//         password,
//         timezone: DateTime.now().zoneName,
//         OS:
//           navigator?.userAgent?.substring(
//             navigator?.userAgent?.indexOf("(") + 1,
//             navigator?.userAgent?.indexOf(";")
//           ) || "",
//       });

//       try {
//         window.localStorage.setItem("token", response.data.userData?.web_token)
//       } catch (error) {}
//       dispatch({ type: "UPDATE_TOKEN", payload: { token: response.data.userData?.web_token } });
//       let data = response?.data;

//       try {
//         let subRes = await axios.post(
//           process.env.apiUrl + "/api/get-single-subscription",
//           { user_id: data.userData._id },
//           { headers: { Authorization: `Bearer ${response.data.userData?.web_token}` } }
//         );
//         let subData = subRes.data.subscription;
//         dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
//         // dispatch({ type: "LOADING_CONTENT", payload: false });
//       } catch (error) {
//         // dispatch({ type: "LOADING_CONTENT", payload: false });
//       }
//       // setLoading(false);
//       dispatch({ type: "USER_DATA", payload: response.data.userData });
//       try {
//         let timezone = DateTime.now().zoneName;
//         let res = await axios.post(process.env.apiUrl + "/api/get-single-user", {
//           id: response?.data?.userData?._id,
//           timezone,
//         });
//         dispatch({ type: "UPDATE_PROFILE", payload: res.data?.profile });
//       } catch (error) {}
//       const returnUrl = localStorage.getItem("returnUrl");
//       if (returnUrl) {
//         router.push(returnUrl);
//       localStorage.removeItem("returnUrl");
//       } else {
//         router.push("/");
//       }
//             setLoading(false);
//       dispatch({ type: "LOADING_CONTENT", payload: false });
//     } catch (err: any) {
//       setLoading(false);
//       dispatch({ type: "LOADING_CONTENT", payload: false });

//       if (err?.response?.data?.message) {
//         setError(err.response.data.message);
//         // toast.error(err.response.data.message);
//       }
//       if (err?.response?.data?.needVerification) {
//         setNeedEmailVerification(true);
//       }

//     }
//   };
// };

// const signIn: actionFunctionType = (dispatch) => {
//   return async ({
//     email,
//     password,
//     setLoading,
//     setError,
//     setNeedEmailVerification,
//     router,
//   }) => {
//     try {
//       // dispatch({ type: "LOADING_CONTENT", payload: true });
//       setLoading(true);

//       // Step 1: Sign In
//       const response = await axios.post(`${process.env.apiUrl}/api/web-signin`, {
//         email,
//         password,
//         timezone: DateTime.now().zoneName,
//         OS:
//           navigator?.userAgent?.substring(
//             navigator?.userAgent?.indexOf("(") + 1,
//             navigator?.userAgent?.indexOf(";")
//           ) || "",
//       });

//       const token = response.data.userData?.web_token;
//       const userId = response.data.userData?._id;

//       try {
//         localStorage.setItem("token", token);
//       } catch (error) { }

//       // Step 2: Fetch Subscription Data
//       const subRes = await axios.post(
//         `${process.env.apiUrl}/api/get-single-subscription`,
//         { user_id: userId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const subData = subRes.data.subscription;

//       // Step 3: Fetch User Profile
//       const timezone = DateTime.now().zoneName;
//       const profileRes = await axios.post(`${process.env.apiUrl}/api/get-single-user`, {
//         id: userId,
//         timezone,
//       });
//       const profile = profileRes.data?.profile;

//       // Step 4: Dispatch All Together
//       dispatch({ type: "UPDATE_TOKEN", payload: { token } });
//       dispatch({ type: "USER_DATA", payload: response.data.userData });
//       dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
//       dispatch({ type: "UPDATE_PROFILE", payload: profile });

//       // Step 5: Navigate
//       const returnUrl = localStorage.getItem("returnUrl");
//       if (returnUrl) {
//         router.push(returnUrl);
//         localStorage.removeItem("returnUrl");
//       } else {
//         router.push("/");
//       }

//       // setLoading(false);
//       // dispatch({ type: "LOADING_CONTENT", payload: false });

//     } catch (err: any) {
//       setLoading(false);
//       dispatch({ type: "LOADING_CONTENT", payload: false });

//       if (err?.response?.data?.message) {
//         setError(err.response.data.message);
//       }

//       if (err?.response?.data?.needVerification) {
//         setNeedEmailVerification(true);
//       }
//     }
//   };
// };
const signIn: actionFunctionType = (dispatch) => {
  return async ({
    email,
    password,
    setLoading,
    setError,
    router,
    // selectedrole,
  }) => {
    try {
      // dispatch({ type: "LOADING_CONTENT", payload: true });
      setLoading(true);

      // Step 1: Sign In
      const response = await axios.post(
        `${process.env.apiUrl}/api/admin-login`,
        {
          email,
          password,
          // selectedrole
          //   timezone: DateTime.now().zoneName,
          //   OS:
          //     navigator?.userAgent?.substring(
          //       navigator?.userAgent?.indexOf("(") + 1,
          //       navigator?.userAgent?.indexOf(";")
          //     ) || "",
        },
      );

      // console.log(response, "siginresponse")
      const token = response?.data?.token;
      const userId = response.data.userData?._id;
      toast.success(response?.data?.message);

      try {
        localStorage.setItem("token", token);
      } catch (error) {}

      // Step 2: Fetch Subscription Data
      // const subRes = await axios.post(
      //   `${process.env.apiUrl}/api/get-single-subscription`,
      //   { user_id: userId },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // const subData = subRes.data.subscription;

      // Step 3: Fetch User Profile
      // const timezone = DateTime.now().zoneName;
      const profileRes = await axios.post(
        `${process.env.apiUrl}/api/get-single-user`,
        {
          id: userId,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // console.log(profileRes, "profile")
      const profile = profileRes.data?.userprofile;

      // Step 4: Dispatch All Together
      dispatch({ type: "UPDATE_TOKEN", payload: { token } });
      dispatch({ type: "USER_DATA", payload: response?.data?.userData });
      // dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
      dispatch({ type: "UPDATE_PROFILE", payload: profile });

      // Step 5: Navigate
      const returnUrl = localStorage.getItem("returnUrl");
      if (returnUrl) {
        router.push(returnUrl);
        localStorage.removeItem("returnUrl");
      } else {
        router.push("/dashboard");
      }

      // setLoading(false);
      // dispatch({ type: "LOADING_CONTENT", payload: false });
    } catch (err: any) {
      setLoading(false);
      dispatch({ type: "LOADING_CONTENT", payload: false });

      if (err?.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      }

      // if (err?.response?.data?.needVerification) {
      //   setNeedEmailVerification(true);
      // }
    }
  };
};

// const signIn: actionFunctionType = (dispatch) => {
//   return async ({
//     email,
//     password,
//     setLoading,
//     setError,
//     router,
//     selectedrole,
//   }) => {
//     try {
//       // dispatch({ type: "LOADING_CONTENT", payload: true });
//       setLoading(true);

//       // Step 1: Sign In
//       const response = await axios.post(`${process.env.apiUrl}/api/admin-login`, {
//         email,
//         password,
//         // selectedrole
//         //   timezone: DateTime.now().zoneName,
//         //   OS:
//         //     navigator?.userAgent?.substring(
//         //       navigator?.userAgent?.indexOf("(") + 1,
//         //       navigator?.userAgent?.indexOf(";")
//         //     ) || "",
//       });

//       console.log(response, "siginresponse")
//       // const token = response?.data?.token;
//       const userId = response?.data?.userData?._id;
//       toast.success(response?.data?.message)

//       // try {
//       localStorage.setItem("userData", JSON.stringify(response?.data?.userData));
//       // } catch (error) {

//       // }
//       // const token
//       // const profileRes = await axios.post(
//       //   `${process.env.apiUrl}/api/get-single-user`,
//       //   {
//       //     id: userId,
//       //   },
//       //   {
//       //     withCredentials: true, // ✅ correct place
//       //   }
//       // );

//       // const profileRes = await axios.post(`${process.env.apiUrl}/api/get-single-user`, {
//       //   id: response?.data?.userData?._id,
//       // }, { headers: { withCredentials: true } });
//       // console.log(profileRes, "profile")
//       // const profile = profileRes.data?.userprofile;

//       // Step 4: Dispatch All Together
//       // dispatch({ type: "UPDATE_TOKEN", payload: { token } });
//       dispatch({ type: "USER_DATA", payload: response?.data?.userData });
//       // dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
//       // dispatch({ type: "UPDATE_PROFILE", payload: profile });

//       // Step 5: Navigate
//       const returnUrl = localStorage.getItem("returnUrl");
//       if (returnUrl) {
//         router.push(returnUrl);
//         localStorage.removeItem("returnUrl");
//       } else {
//         router.push("/dashboard");
//       }

//       // setLoading(false);
//       // dispatch({ type: "LOADING_CONTENT", payload: false });

//     } catch (err: any) {
//       setLoading(false);
//       dispatch({ type: "LOADING_CONTENT", payload: false });

//       if (err?.response?.data?.message) {
//         setError(err.response.data.message);
//         toast.error(err.response.data.message)
//       }

//       // if (err?.response?.data?.needVerification) {
//       //   setNeedEmailVerification(true);
//       // }
//     }
//   };
// };
const signInWithGoogle: actionFunctionType = (dispatch) => {
  return async ({
    email,
    password,
    credential,
    navigation,
    setLoading,
    setError,
    setNeedEmailVerification,
    setSignUpEmail,
    setEmail,
    setPassword,
    setDisable,
    setVisibleSnackErr,
    mode,
    setMode = null,
    backHand,
    setRequireEmailVerification,
    router,
    updateUserActivity,
    pathName,
    setSocket,
  }) => {
    try {
      setLoading(true);
      // creating post request for login
      let response;
      // if (mode == 100) {

      response = await axios.post(process.env.apiUrl + "/api/signin-google", {
        credential,
      });
      // try {
      //   let subRes = await axios.post(
      //     process.env.apiUrl + "/api/single-user-subscription",
      //     { id: response.data.userData._id }
      //   );
      //   let subData = subRes.data.usersubscriptiondoc;
      //   dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
      // } catch (error) {}
      setLoading(false);
      try {
        updateUserActivity({
          user_id: response?.data?.userData?._id,
          action: response?.data?.message,
          actionUrl: pathName,
        });
      } catch (error) {}
      const returnUrl = localStorage.getItem("returnUrl");
      localStorage.removeItem("returnUrl");
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/");
      }
      // router.push("/")
      // } else {
      // response = await instance.post("/users/signin", { email, mode, request_origin: "app" });

      // }
      // const data = response.data.result;
      // const token = response.data.token

      dispatch({ type: "USER_DATA", payload: response.data.userData });

      // if (backHand) {
      //   backHand.removeEventListener("hardwareBackPress")
      // }
      // setLoading(false)
      // if (data.user_type_id && data.address) {

      //   navigation.navigate("HomeScreen");
      // } else {
      //   navigation.navigate("ProfileStack")
      // }

      // if (mode == 100) {

      //   setEmail("")
      //   setPassword("")
      //   setTimeout(() => { setDisable(false) }, 3000)
      // } else {
      //   setSignUpEmail("")
      // }

      // if(setMode){
      //   setMode(100)
      // }
    } catch (err: any) {
      // if (mode == 98) {
      // LoginManager.logOut()
      // }

      console.log(err);

      // if (mode == 99) {
      // GoogleSignin.signOut()
      // }

      setLoading(false);

      try {
        // googleLogout()
      } catch (error) {}
      // setDisable(false)
      // setError(err.response.data.message)
      // setVisibleSnackErr(true)

      if (err?.response?.data?.message) {
        setError(err.response.data.message);

        // setRequireEmailVerification(true)
      }
      if (err?.response?.data?.needVerification) {
        setNeedEmailVerification(true);

        // setRequireEmailVerification(true)
      }
      try {
        if (err?.response?.data?.userData?._id) {
          updateUserActivity({
            user_id: err?.response?.data?.userData?._id,
            action: err.response.data.message,
            actionUrl: pathName,
          });
        } else {
          updateUserActivity({
            user_id: "",
            action: err?.response?.data?.message,
            actionUrl: pathName,
          });
        }
      } catch (error) {
        // console.log(error)
      }
    }
  };
};
const signInWithFacebook: actionFunctionType = (dispatch) => {
  return async ({
    email,
    password,
    access_token,
    navigation,
    setLoading,
    setError,
    setNeedEmailVerification,
    setSignUpEmail,
    setEmail,
    setPassword,
    setDisable,
    setVisibleSnackErr,
    mode,
    setMode = null,
    backHand,
    setRequireEmailVerification,
    router,
    updateUserActivity,
    pathName,
    setSocket,
  }) => {
    try {
      setLoading(true);
      // creating post request for login
      let response;
      // if (mode == 100) {

      response = await axios.post(process.env.apiUrl + "/api/signin-facebook", {
        access_token,
      });
      // try {
      //   let subRes = await axios.post(
      //     process.env.apiUrl + "/api/single-user-subscription",
      //     { id: response.data.userData._id }
      //   );
      //   let subData = subRes.data.usersubscriptiondoc;
      //   dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
      // } catch (error) {}
      setLoading(false);
      try {
        updateUserActivity({
          user_id: response?.data?.userData?._id,
          action: response?.data?.message,
          actionUrl: pathName,
        });
      } catch (error) {
        // console.log(error)
      }

      const returnUrl = localStorage.getItem("returnUrl");
      localStorage.removeItem("returnUrl");
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push("/");
      }

      // router.push("/")
      // } else {
      // response = await instance.post("/users/signin", { email, mode, request_origin: "app" });

      // }
      // const data = response.data.result;
      // const token = response.data.token

      dispatch({ type: "USER_DATA", payload: response.data.userData });

      // if (backHand) {
      //   backHand.removeEventListener("hardwareBackPress")
      // }
      // setLoading(false)
      // if (data.user_type_id && data.address) {

      //   navigation.navigate("HomeScreen");
      // } else {
      //   navigation.navigate("ProfileStack")
      // }

      // if (mode == 100) {

      //   setEmail("")
      //   setPassword("")
      //   setTimeout(() => { setDisable(false) }, 3000)
      // } else {
      //   setSignUpEmail("")
      // }

      // if(setMode){
      //   setMode(100)
      // }
    } catch (err: any) {
      // if (mode == 98) {
      // LoginManager.logOut()
      // }

      console.log(err);

      // if (mode == 99) {
      // GoogleSignin.signOut()
      // }
      try {
        // window.fbAsyncInit()
        // window.FB.logout((res:any)=>{
        //   console.log("facebook logout success");
        // })
      } catch (error) {}

      setLoading(false);
      // setDisable(false)
      // setError(err.response.data.message)
      // setVisibleSnackErr(true)

      if (err?.response?.data?.message) {
        setError(err.response.data.message);

        // setRequireEmailVerification(true)
      }
      // if (err?.response?.data?.needVerification) {
      //   setNeedEmailVerification(true);

      // setRequireEmailVerification(true)
    }
  };
};

const fetchUpdatedProfileData: actionFunctionType = (dispatch) => {
  return async ({
    setUpdateStatus,
    profileUpdated = false,
    navigation,
    setDisable,
    initialData,
  }) => {
    try {
      // const email = await AsyncStorage.getItem("email");
      // const id = await AsyncStorage.getItem("user_id");

      // const token = await AsyncStorage.getItem("token");
      // const response = await instance.post("/users/getsingleuser", { id }, { headers: { Authorization: `Bearer ${token}` } });

      // dispatch({ type: "USER_DATA", payload: response.data.user });
      setDisable(false);

      navigation.navigate("HomeScreen");

      if (profileUpdated) {
      }
    } catch (err) {
      setDisable(false);

      // console.warn(err.response.data.message);
    }
  };
};

const signOut: actionFunctionType = (dispatch) => {
  return async ({
    // navigation,
    user_id,
    // socket,
    // mode,
    router,
    // signup_method,
    // updateUserActivity,
    pathName,
    token,
  }) => {
    try {
      const BG_TASK = "BACKGROUND-NOTIFICATION-TASK";
      // await AsyncStorage.setItem("isLoggedIn", "false");
      // const token = await AsyncStorage.getItem("token");
      let res = await axios.post(
        process.env.apiUrl + "/api/signout",
        { userId: user_id },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      try {
        window.localStorage.setItem("token", "");
      } catch (error) {}
      dispatch({ type: "UPDATE_TOKEN", payload: { token: "" } });
      // try {
      //   updateUserActivity({
      //     user_id: res?.data?.userData?._id,
      //     action: "Signout successful",
      //     actionUrl: "/Signout",
      //   });
      // } catch (error) {
      //   console.log(error, "");
      // }
      dispatch({ type: "CLEAR_SOCKET", payload: {} });
      dispatch({ type: "SIGN_OUT", payload: {} });
      router.push("/");
      // if (signup_method == 58) {
      //   // googleLogout()
      // }

      // if (signup_method == 59) {
      // window.fbAsyncInit()
      // window.FB.logout((res:any)=>{
      //   console.log("facebook logout success");
      // })
      // }

      // await AsyncStorage.setItem("user_id", "");
      // await AsyncStorage.removeItem("user_email");
      // await AsyncStorage.removeItem("user_firstname");
      // await AsyncStorage.removeItem("user_lastname");
      // await AsyncStorage.removeItem("user_mappin");
      // await AsyncStorage.setItem("token","");
      // await AsyncStorage.removeItem("user_photo");
      // await AsyncStorage.removeItem("user_type_id");
      // await AsyncStorage.setItem("isSubscribed", "null")
      // await AsyncStorage.setItem("isTrial", "null")
      // await AsyncStorage.setItem("next_billing_time", "null")

      try {
      } catch (error) {}
      // await AsyncStorage.setItem("schedule_subscription", "false")

      // await instance.post("/users/signout", { user_id })

      // dispatch({ type: "SIGN_OUT" });
      // navigation.navigate("Login");
    } catch (error) {}
  };
};

const updateUserData: actionFunctionType = (dispatch) => {
  return async ({
    // id,
    router,
    onSignIn = false,
    pathName,
    // tourData = null,
    // setNotificationData,
  }) => {
    //  const token = await AsyncStorage.getItem("token");
    try {
      //     const response = await axios.post(process.env.apiUrl+"/getsingleuserdata", {
      // id
      //     //   headers: {
      //     //     Authorization: `Bearer ${token}`,
      //       // },
      //     });
      let webToken = window.localStorage.getItem("token");

      if (!webToken) {
        dispatch({ type: "UPDATE_USER_DATA", payload: {} });

        return;
      }

      let res = await axios.post(
        process.env.apiUrl + "/api/get-single-user",
        {},
        // {
        //   timezone: DateTime.now().zoneName,
        //   OS:
        //     navigator?.userAgent?.substring(
        //       navigator?.userAgent?.indexOf("(") + 1,
        //       navigator?.userAgent?.indexOf(";")
        //     ) || "",
        // },
        { headers: { Authorization: `Bearer ${webToken}` } },
      );
      dispatch({
        type: "UPDATE_TOKEN",
        payload: { token: res?.data?.result?.token },
      });
      dispatch({ type: "UPDATE_USER_DATA", payload: res?.data?.result });
      dispatch({ type: "UPDATE_PROFILE", payload: res?.data?.userprofile });
      let socket: Socket<any, any> = io(`${process.env.apiUrl}`, {
        path: "/api/tirupatitravel",
      });

      //   let subRes = await axios.post(process.env.apiUrl+"/api/single-user-subscription",{id:res.data.data._id})
      //   let subData = subRes.data.usersubscriptiondoc
      // dispatch({
      //   type: "SET_USER_SUBSCRIPTION_DATA",
      //   payload: res.data?.subscription,
      // });
      //     let socket:Socket<any,any> = io(`${process.env.apiUrl}`, {path:"/api/socketconnect"});
      const updateNotificationData = async ({
        user_id,
        page,
      }: {
        user_id: any;
        page: any;
      }) => {
        // const updateNotificationData = async({user_id, page, currentDate}:{user_id:any,page:any,currentDate:any})=>{
        // let user_id =res.data.data._id
        if (user_id) {
          dispatch({ type: "CLEAR_NOTIFICATION", payload: {} });
          let res = await axios.post(
            process.env.apiUrl + `/api/get-user-notification/1`,
            { user_id },
            { withCredentials: true },
          );
          let notificationlist = res?.data?.userNotification;
          if (res?.data) {
            // setNotificationBadgeCount(res?.data?.nsCount)

            dispatch({
              type: "SET_NOTIFICATION_DATA",
              payload: notificationlist,
            });
            dispatch({
              type: "SET_NOTIFICATION_COUNT",
              payload: res?.data?.notifCount,
            });
            dispatch({
              type: "SET_NOTIFICATION_BADGE_COUNT",
              payload: res?.data?.nsCount,
            });
          }
        }
      };
      dispatch({
        type: "SOCKET",
        payload: { socket, setNotificationData: updateNotificationData },
      });
      // updateNotificationData({user_id:res?.data?.data?._id, page:1, currentDate:DateTime.now().toUTC().toISO()})
      updateNotificationData({ user_id: res?.data?.data?._id, page: 1 });
      // dispatch({ type: "SOCKET", payload: { socket, user_id: res?.data?.result?._id } })

      // if (onSignIn) {
      //   router.push("/");
      // }
    } catch (err) {
      // console.log(err);
      // console.log(pathName);
      // console.error(tourData)
      // dispatch({ type: "UPDATE_USER_DATA", payload:{}});
      dispatch({ type: "SIGN_OUT", payload: {} });

      // if (AuthRoutes[pathName]) {
      // router.push("/");
      // }
    }
  };
};

// const updateUserData: actionFunctionType = (dispatch) => {
//   return async ({
//     //id
//     router,
//     onSignIn = false,
//     pathName,
//     // tourData = null,
//     // setNotificationData,
//   }) => {
//     //  const token = await AsyncStorage.getItem("token");
//     try {
//       // if (AuthRoutes[pathName]) {
//       // console.log("pushing to home")
//       // router.push("/");
//       // }
//       //     const response = await axios.post(process.env.apiUrl+"/getsingleuserdata", {
//       // id
//       //     //   headers: {
//       //     //     Authorization: `Bearer ${token}`,
//       //       // },
//       //     });
//       let webToken = window.localStorage.getItem("token");
//       let userId = window.localStorage.getItem("userData") ? JSON.parse(window.localStorage.getItem("userData") || "{}")._id : null;

//       // if (!webToken) {
//       //   return
//       // }
//       console.log("updating user data", pathName, userId)
//       let res = await axios.post(process.env.apiUrl + "/api/get-single-user", { id: userId },
//         // {
//         //   timezone: DateTime.now().zoneName,
//         //   OS:
//         //     navigator?.userAgent?.substring(
//         //       navigator?.userAgent?.indexOf("(") + 1,
//         //       navigator?.userAgent?.indexOf(";")
//         //     ) || "",
//         // },
//         { withCredentials: true }
//       );
//       dispatch({ type: "UPDATE_TOKEN", payload: { token: res?.data?.result?.token } });
//       dispatch({ type: "UPDATE_USER_DATA", payload: res?.data?.result });
//       dispatch({ type: "UPDATE_PROFILE", payload: res?.data?.userprofile });
//       //   let subRes = await axios.post(process.env.apiUrl+"/api/single-user-subscription",{id:res.data.data._id})
//       //   let subData = subRes.data.usersubscriptiondoc
//       // dispatch({
//       //   type: "SET_USER_SUBSCRIPTION_DATA",
//       //   payload: res.data?.subscription,
//       // });
//       let socket: Socket<any, any> = io(`${process.env.apiUrl}`, { path: "/api/tirupatitravels" });
//       // const updateNotificationData = async({user_id, page, currentDate}:{user_id:any,page:any,currentDate:any})=>{
//       //   // let user_id =res.data.data._id
//       //     if(user_id){
//       //       dispatch({type:"CLEAR_NOTIFICATION",payload:{}})
//       //       let res = await axios.post(process.env.apiUrl+`/api/get-user-notification/1`,{user_id, currentDate},{withCredentials:true})
//       //       let notificationlist = res?.data?.userNotification
//       //       if(res?.data){
//       //         // setNotificationBadgeCount(res?.data?.nsCount)

//       //         dispatch({type:"SET_NOTIFICATION_DATA", payload:notificationlist})
//       //         dispatch({type:"SET_NOTIFICATION_COUNT", payload:res?.data?.notifCount})
//       //         dispatch({type:"SET_NOTIFICATION_BADGE_COUNT", payload:res?.data?.nsCount})

//       //       }

//       //     }
//       // }
//       console.log(userId, "socket dispatching in update user data", socket)
//       dispatch({ type: "SOCKET", payload: { socket, user_id: userId } })
//       // updateNotificationData({user_id:res?.data?.data?._id, page:1, currentDate:DateTime.now().toUTC().toISO()})

//       // if (onSignIn) {
//       //   router.push("/");
//       // }
//       // if (AuthRoutes[pathName]) {
//       // router.push("/");
//       // }
//     } catch (err) {
//       // console.log(err);
//       // console.log(pathName);
//       // console.error(tourData)
//       dispatch({ type: "SIGN_OUT", payload: {} });

//       // if (AuthRoutes[pathName]) {
//       // router.push("/");
//       // }
//     }
//   };
// };

const updateUserProfile: actionFunctionType = (dispatch) => {
  return async ({
    data,
    setLoading,
    setUpdateStatus,
    user_status,
    setError,
    setDisable,
    photoData,
    removePhoto,
    photoUrl,
    setRemovePhoto,
    userData,
    photo,
    user_id,
    dob_zone,
    dob,
    name,
    gender,
    phone,
    address,
    setMessage,
  }) => {
    try {
      setLoading(true);
      let web_token = localStorage.getItem("token");
      let res = await axios.post(
        process.env.apiUrl + "/api/update-user-profile",
        { user_id, dob_zone, dob, name, gender, phone, address },
        { headers: { Authorization: `Bearer ${web_token}` } },
      );

      toast.success("Profile updated successfully.");
      // const response = await  instance.put("/users/updateuser", { ...data, id, request_origin: "app" }, { headers: { Authorization: `Bearer ${token}` } })

      // if (photoData) {
      // let upres = await FileSytemUpload.uploadAsync("https://api.plannmeet.com/api/profile/img/upload", photoData.uri, {
      // fieldName: "photo",
      // uploadType: FileSytemUpload.FileSystemUploadType.MULTIPART,
      // httpMethod: "POST",
      // headers:{Authorization:`Bearer ${token}`} ,
      // parameters: { id: photoData.id,photo}
      // })
      // if (upres.status != 200) {
      //   console.log(upres.body);
      //   if (upres.body?.message) {
      //     setError(upres.body.message)
      //   } else {
      //   console.log(upres.body);
      //     setError("Profile photo upload failed, photo size might be large")
      //   }
      //   setLoading(false)
      //   setDisable(false)
      //   return
      // }
      // }

      // if (removePhoto && !photoData) {
      // let res = await instance.post("/removeprofilephoto", { id: userData._id.toString(),  },{headers:{Authorization:`Bearer ${token}`}})

      // setRemovePhoto(false);
      // }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setDisable(false);
      setError("Profile update failed");
      // toast.error("Profile update failed");
    }
  };
};

const setSignInStatus: actionFunctionType = (dispatch) => {
  return async ({ setLoading }) => {
    try {
      //  let token = await AsyncStorage.getItem("token")

      // let userid = await AsyncStorage.getItem("user_id")

      // let userdata = await instance.post("/users/getsingleuser", { id: userid }, { headers: { Authorization: `Bearer ${token}` } })

      // if (userdata.data.user.isLoggedIn) {

      //   // dispatch({ type: "USER_DATA", payload: userdata.data.user })
      //   // dispatch({ type: "SIGNIN_STATUS" })
      // } else {
      //   // dispatch({ type: "LOADING_STATUS", payload: false })
      // }
      setLoading(false);
    } catch (error) {
      // dispatch({ type: "LOADING_STATUS", payload: false })
      setLoading(false);
    }
  };
};
const setLoadingStatus: actionFunctionType = (dispatch) => {
  return async ({ status }) => {
    try {
      // dispatch({ type: "LOADING_STATUS", payload: status })
    } catch (error) {}
  };
};

const getNotifications: actionFunctionType = (dispatch) => {
  return async ({
    user_id,
    page = 1,
    setLoadingMore,
    setScrollRefresh = null,
    currentDate,
  }) => {
    try {
      if (page == 1) {
        // dispatch({ type: "CLEAR_NOTIFICATION" })
      } else {
        setLoadingMore(true);
      }

      if (setScrollRefresh) {
        setScrollRefresh(true);
      }

      // let token = await AsyncStorage.getItem("token")
      // let notdata = await instance.post(`/users/getusernotifications/${page}`, { user_id ,currentDate}, { headers: { Authorization: `Bearer ${token}` } })

      // dispatch({ type: "NOTIFICATION", payload: { data: notdata.data.notifications, count: notdata.data.notifCount } })
      if (page == 1) {
        // dispatch({ type: "BADGE", payload: notdata.data.nsCount })
      } else {
        setLoadingMore(false);
      }

      if (setScrollRefresh) {
        setScrollRefresh(false);
      }
    } catch (error) {
      if (page > 1) {
        setLoadingMore(false);
      }
      if (setScrollRefresh) {
        setScrollRefresh(false);
      }
    }
  };
};

// const setNotificationSeen:actionFunctionType = (dispatch) => {

//   return async ({ user_id, notifData }) => {

//     try {

//       let notifyIds = []

//       notifData.forEach(e => {
//         if (!e.seen) {
//           notifyIds.push(e._id)
//         }
//       })
//       console.log(notifyIds.length, "==noti");

//       if (notifyIds.length) {

//         // let token = await AsyncStorage.getItem("token")
//         // let res = await instance.post("/users/updatenotificationseen", { user_id, notifyIds }, { headers: { Authorization: `Bearer ${token}` } })
//         dispatch({ type: "SET_BADGE", payload: notifyIds.length })
//       }

//       // await Notifications.setBadgeCountAsync(0)

//     } catch (error) {
//     }
//   }

// }

const setNotificationVisited: actionFunctionType = () => {
  return async ({ user_id, notify_id }) => {
    try {
      // let token = await AsyncStorage.getItem("token")
      // let res = await instance.post("/users/updatenotificationvisited", { user_id, notify_id }, { headers: { Authorization: `Bearer ${token}` } })
    } catch (error) {
      console.log(error);
    }
  };
};

const getChats: actionFunctionType = (dispatch) => {
  return async ({ user_id, page = 1, setLoadingMoreChats, setLoadingChat }) => {
    if (page == 1) {
      // dispatch({ type: "CLEAR_TOTAL_CHATS" })
      setLoadingChat(true);
    }

    if (page > 1) {
      setLoadingMoreChats(true);
    }

    try {
      // let token = await AsyncStorage.getItem("token")
      // let data = await instance.post(`/users/getchats/${page}`, { user_id }, { headers: { Authorization: `Bearer ${token}` } })
      // let message_data = await instance.post("/users/messagenotseen", { user_id }, { headers: { Authorization: `Bearer ${token}` } })

      // dispatch({ type: "SET_NSEEN", payload: message_data.data.all_nseen })
      // dispatch({ type: "SET_TOTAL_CHATS", payload: data.data.total_chats })
      // dispatch({ type: "CHATS", payload: data.data.chats })
      if (page > 1) {
        setLoadingMoreChats(false);
      } else {
        setLoadingChat(false);
      }
    } catch (error) {
      if (page > 1) {
        setLoadingMoreChats(false);
      } else {
        setLoadingChat(false);
      }
    }
  };
};

// const setNotificationCount:actionFunctionType = (dispatch) => {
//   return async ({ user_id }) => {
//     try {

//       console.log("dispatch snc");
//       dispatch({ type: "SET_MNC" })
//       let token = await AsyncStorage.getItem("token")
//       let message_data = await instance.post("/users/messagenotseen", { user_id }, { headers: { Authorization: `Bearer ${token}` } })
//       dispatch({ type: "SET_NSEEN", payload: message_data.data.all_nseen })
//     } catch (error) {
//     }

//   }
// }
const setSocket: actionFunctionType = (dispatch) => {
  return async ({ user_id }) => {
    let socket = io(process.env.apiUrl, { path: "/api/tirupatitravels" });
    dispatch({ type: "SOCKET", payload: { socket, user_id } });
  };
};

// const modifyNotification:actionFunctionType = (dispatch) => {
//   return async ({ Notifications, data }) => {
//     try {

//       let preNoti = await Notifications.getPresentedNotificationsAsync()

//       if (!preNoti.length) {
//         return
//       }
//       let doc = preNoti.find(n => {
//         return data.request.content.data.user_id == n.request.content.data.user_id
//       })

//       if (doc) {

//         await Notifications.dismissNotificationAsync(doc.request.identifier)

//       }
//     } catch (error) {

//     }

//   }
// }

// const getBlockList:actionFunctionType = (dispatch) => {
//   return async ({ user_id }) => {

//     try {
//       let token = await AsyncStorage.getItem("token")
//       let doc = await instance.post("/users/getblocklist", { user_id }, { headers: { Authorization: `Bearer ${token}` } })
//       dispatch({ type: "BLOCK_LIST", payload: doc.data.blocklist })
//     } catch (error) {

//     }

//   }
// }

const getUnseenMessages: actionFunctionType = (dispatch) => {
  return async ({ user_id }) => {
    try {
      // let token = await AsyncStorage.getItem("token")
      // let message_data = await instance.post("/users/messagenotseen", { user_id }, { headers: { Authorization: `Bearer ${token}` } })
      // dispatch({ type: "SET_NSEEN", payload: message_data.data.all_nseen })
    } catch (error) {}
  };
};

const toggleSideBar: actionFunctionType = (dispatch) => {
  return async ({ value = "" }) => {
    try {
      dispatch({ type: "SET_SIDEBAR", payload: { value } });
    } catch (error) {
      console.log(error);
    }
  };
};

const toggleSideSubMenu: actionFunctionType = (dispatch) => {
  return async ({ value = "" }) => {
    try {
      dispatch({ type: "SET_SUB_SIDEBAR", payload: { value } });
    } catch (error) {
      console.log(error);
    }
  };
};

const setStagingSubscription: actionFunctionType = (dispatch) => {
  return async ({
    price_id,
    plan_id,
    plan_name,
    plan_price,
    plan_type_id,
    address,
    state,
    country,
    plan_interval,
    router = null,
  }) => {
    dispatch({
      type: "SET_STAGING_SUBSCRIPTION",
      payload: {
        price_id,
        plan_name,
        plan_type_id,
        plan_price,
        plan_id,
        plan_interval,
        address,
        state_name: state,
        country,
      },
    });
    if (router) {
      router.push("/checkout");
    }
  };
};
// const getUserSubscriptionData: actionFunctionType = (dispatch) => {
//   return async ({ user_id }) => {
//     let res = await axios.post(
//       process.env.apiUrl + "/api/get-single-subscription",
//       { id: user_id }
//     );
//     let subData = res.data.subscription;
//     dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });

//   };
// };

const updateUserActivity: actionFunctionType = (dispatch) => {
  return async ({ user_id, action, actionUrl }) => {
    try {
      if (user_id) {
        let res = await axios.post(
          process.env.apiUrl + "/api/add-user-activity",
          { user_id, action, actionUrl },
        );
      } else {
        let res = await axios.post(
          process.env.apiUrl + "/api/add-user-activity",
          { action, actionUrl },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const setNotificationPerm: actionFunctionType = (dispatch) => {
  return async ({ status }) => {
    console.log(status, "setting notification permission in context api");
    try {
      dispatch({ type: "SET_NOTIFICATIONPERM", payload: { status } });
    } catch (error) {
      console.log(error);
    }
  };
};

const setNotificationData: actionFunctionType = (dispatch) => {
  return async ({
    user_id,
    page = 1,
    currentDate,
    setNotificationBadgeCount,
    notificationBadgeCount,
  }) => {
    try {
      if (user_id) {
        // if (page == 1) {
        // dispatch({ type: "CLEAR_NOTIFICATION", payload: {} });
        // dispatch({ type: "LOADING_NOTIF_DATA", payload: true });
        // }
        let limit = 10;
        if (page == 1) {
          dispatch({ type: "CLEAR_NOTIFICATION", payload: {} });
        }

        let res = await axios.post(
          process.env.apiUrl + `/api/get-user-notification/${page}`,
          { user_id, limit },
          { withCredentials: true },
        );
        let notificationlist = res?.data?.userNotification;
        console.log(res?.data, "==notification data in context api==");
        if (res?.data) {
          // setNotificationBadgeCount(res?.data?.nsCount)

          dispatch({
            type: "SET_NOTIFICATION_DATA",
            payload: notificationlist,
          });
          dispatch({
            type: "SET_NOTIFICATION_COUNT",
            payload: res?.data?.notifCount,
          });
          dispatch({
            type: "SET_NOTIFICATION_BADGE_COUNT",
            payload: res?.data?.nsCount,
          });
        }

        dispatch({ type: "LOADING_NOTIF_DATA", payload: false });
      }
    } catch (error) {
      dispatch({ type: "LOADING_NOTIF_DATA", payload: false });
      console.log(error);
    }
  };
};

const setNotificationBadgeCount: actionFunctionType = (dispatch) => {
  return async (value) => {
    try {
      if (value) {
        dispatch({ type: "SET_NOTIFICATION_BADGE_COUNT", payload: value });
      }
    } catch (error) {
      console.log(error);
    }
  };
};
const setNotificationCount: actionFunctionType = (dispatch) => {
  return async ({ notificationCount }) => {
    try {
      dispatch({
        type: "SET_NOTIFICATION_COUNT",
        payload: { notificationCount },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

const setNotificationMessage: actionFunctionType = (dispatch) => {
  return async (notificationata) => {
    try {
      dispatch({ type: "SET_NOTIFICATION_DATA", payload: notificationata });
    } catch (error) {
      console.log(error);
    }
  };
};

const setNotificationSeen: actionFunctionType = (dispatch) => {
  return async ({
    notifyIds,
    user_id,
    // setNotificationBadgeCount,
    notificationBadgeCount,
    // notificationData,
  }: {
    notifyIds: [];
    user_id: string;
    // setNotificationBadgeCount: Function;
    notificationBadgeCount: number;
    // notificationData: notificationType[];
  }) => {
    try {
      // let notifyIds: string[] = [];
      // notificationData.forEach((data) => {
      //   if (!data.seen) {
      //     notifyIds.push(data?._id);
      //   }
      // });

      if (notifyIds.length > 0) {
        // console.log(notifyIds, "==updating seen=======================");
        let res = await axios.post(
          process.env.apiUrl + `/api/update-notification-seen`,
          { user_id, notifyIds },
        );
        // setNotificationBadgeCount(notificationBadgeCount)
        let seenCount = notifyIds?.length;

        let badge = notificationBadgeCount - seenCount;
        // setNotificationBadgeCount(badge)
        dispatch({ type: "SET_NOTIFICATION_BADGE_COUNT", payload: badge });

        // dispatch({type:"SET_NOTIFICATION_BADGE_COUNT", payload:res?.data?.nsCount})
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const setEditedAvatarId: actionFunctionType = (dispatch) => {
  return async ({ id, router = null, path }) => {
    dispatch({ type: "SET_EDITED_AVATAR_ID", payload: id });

    if (router) {
      router.push(path);
    }
  };
};
const onRefreshAvatarList: actionFunctionType = (dispatch) => {
  return async ({ value }) => {
    dispatch({ type: "REFRESH_AVATARS", payload: value });
  };
};
const setUrlData: actionFunctionType = (dispatch) => {
  return async (data) => {
    dispatch({ type: "URL_DATA", payload: data });
  };
};

const getUserSubscriptionData: actionFunctionType = (dispatch) => {
  return async ({ user_id }) => {
    try {
      const webToken = localStorage.getItem("token");
      let res = await axios.post(
        process.env.apiUrl + "/api/get-single-subscription",
        { user_id },
        { headers: { Authorization: `Bearer ${webToken}` } },
      );
      let subData = res?.data?.subscription;
      dispatch({ type: "SET_USER_SUBSCRIPTION_DATA", payload: subData });
    } catch (error) {}
  };
};
const getUserData: actionFunctionType = (dispatch) => {
  return async ({ user_id }) => {
    try {
      let timezone = DateTime.now().zoneName;
      let res = await axios.post(process.env.apiUrl + "/api/get-single-user", {
        id: user_id,
        timezone,
      });
      dispatch({ type: "USER_DATA", payload: res.data?.result });
      dispatch({ type: "UPDATE_PROFILE", payload: res.data?.profile });
    } catch (error) {}
  };
};

const getNoticeCount: actionFunctionType = (dispatch) => {
  return async (count) => {
    try {
      dispatch({ type: "NOTICE_COUNT", payload: count });
    } catch (error) {}
  };
};

// exporting all methods and setting initalState from here
const { Context, Provider } = createDataContext(
  AuthReducer,
  {
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
    updateUserProfile,
    updateUserData,
    fetchUpdatedProfileData,
    setSignInStatus,
    setLoadingStatus,
    getNotifications,
    setNotificationSeen,
    setNotificationVisited,
    getChats,
    toggleSideBar,
    toggleSideSubMenu,
    getUnseenMessages,
    verifyCode,

    // setNotificationBadgeCount ,
    setStagingSubscription,
    updateUserActivity,
    setSocket,
    getUserSubscriptionData,
    setNotificationPerm,
    setNotificationData,
    setNotificationCount,
    setNotificationBadgeCount,
    setNotificationMessage,
    setEditedAvatarId,
    onRefreshAvatarList,
    // setNotificationSeen,
    setUrlData,
    getUserData,
    getNoticeCount,
  },
  {
    userData: {
      _id: "",
      email: "",
      name: "",
      photo: "",
      signup_method: -1,
      OS: "",
      created_at: "",
      delete_request_at: "",
      email_verified: false,
      email_verified_at: "",
      isLoggedIn: false,
      status: 0,
      time_zone: "",
      updated_at: "",
      updated_by: "",
      user_type_id: 0,
      empNo: "",
      roleId: {
        created_at: "",
        updated_at: "",
        _id: "",
        name: "",
        permissions: [],
      },
      token: "",
    },
    userProfile: {
      dob: "",
      gender: "",
      phone: "",
      photo: "",
      address: "",
      dob_zone: "",
      about: "",
      admissionDate: "",
      bloodGroup: "",
      city: "",
      country: "",
      created_at: "",
      dateofBirth: "",
      dateofJoining: "",
      education: "",
      experience: "",
      familyOccupation: "",
      fatherName: "",
      isDeleted: false,
      landmark: "",
      motherName: "",
      registrationNo: "",
      religion: "",
      salary: 0,
      state: "",
      updated_at: "",
      updated_by: "",
      userId: "",
      zipCode: "",
    },
    getUserDetails: {},
    userToken: null,
    webToken: null,
    isLoading: true,
    isSignout: false,
    ads: [],
    profiles: [],
    allCategory: [],
    isSignIn: false,
    adBookmarks: [],
    adsCount: 0,
    myAds: [],
    otherAds: [],
    myAdsCount: 0,
    otherAdsCount: 0,
    ongoing: [],
    ongoingCount: 0,
    accepted: [],
    acceptedCount: 0,
    rejected: [],
    rejectedCount: 0,
    bestMatches: [],
    bestMatchesCount: 0,
    businessBookmarks: [],
    notifications: [],
    badgeCount: 0,
    notif_Count: 0,
    socket: null,
    notificationPerm: false,
    chats: [],
    all_nseen: {},
    message_notification: 0,
    total_chats: 0,
    block_list: [],
    isSubscribed: true,
    plan_id: 0,
    subscription_start: "",
    subscription_end: "",
    cancel_request: false,
    subscription_method: null,
    next_billing_time: null,
    subscription_id: null,
    isTrial: null,
    trial_start: null,
    trial_end: null,
    all_reviews: [],
    all_reviews_count: 0,
    ad_bookmark_count: 0,
    business_bm_count: 0,
    paypal_payment: false,
    notifCurrentDate: "",
    allMeets: [],
    allMeetCount: 0,
    allMeetInvites: [],
    allMeetInvitesCount: 0,
    friendList: [],
    friend_count: 0,
    meetTravelStart: false,
    destinationCord: null,
    meetName: "",
    meetId: null,
    LWPRef: null,
    currentLN: "",
    isMyMeet: false,
    meetDeleteCount: 0,
    updateMyMeet: false,
    updateMeetInvite: false,
    backgroundMeetData: {},
    allFriendCount: 0,
    isSideBarNavOpen: true,
    sideSubMenuDropDown: false,
    avatar_list: [],
    staging_subscription: {
      price_id: "",
      plan_type_id: "",
      plan_id: "",
      plan_name: "",
      plan_price: "",
      plan_interval: "",
      address: "",
      state: "",
      country: "US",
    },
    userSubscriptionData: {
      user_id: "",
      plan_type_id: "",
      stripe_cus_id: "",
      plan_id: "",
      plan_name: "",
      stripe_plan_id: "",
      isSubscribed: false,
      isPayPerInterval: false,
      isFreePlan: false,
      subscription_id: "",
      subscription_method: 0,
      cancel_request: false,
      subscription_start: "",
      subscription_end: "",
      trial_start: "",
      trial_end: "",
      next_billing_time: "",
      interval: "",
      subscriptionPlanName: "",
    },
    notificationData: [],
    notificationCount: 0,
    notificationBadgeCount: 0,
    editedAvatarId: "",
    refreshAvatarList: false,
    loadingContent: false,
    loadingNotificationData: false,
    urlData: null,
    noticeCount: 0,
  },
);

export { Provider, Context };
