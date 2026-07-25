"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowBack,
  Search,
  MoreHoriz,
  Edit,
  Cancel,
  ReplayCircleFilled,
  ArrowDropUp,
  ArrowDropDown,
} from "@mui/icons-material";

import {
  Backdrop,
  CircularProgress,
  Pagination,
  TablePagination,
  ClickAwayListener,
} from "@mui/material";

import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import toast from "react-hot-toast";
import { X } from "lucide-react";
interface RouteType {
  _id: string;
  slug: string;
}

interface VehicleType {
  _id: string;
  name: string;
}
interface RouteFareType {
  _id: string;
  route_id: RouteType;
  vehicle_id: VehicleType;
  tripType: string;
  baseFare: number;
  minimumKm: number;
  pricePerKm: number;
  extraKmCharge: number;
  driverAllowance: number;
  tollCharge: number;
  parkingCharge: number;
  nightCharge: number;
  waitingCharge: number;
  isActive: boolean;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
}

const RouteFareTable = () => {
  const router = useRouter();

  const [data, setData] = useState<RouteFareType[]>([]);
  const [statelist, setStatelist] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newPage, setNewPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const totalPages = Math.ceil(dataCount / rowsPerPage);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");

  const [order, setOrder] = useState({
    col: "priority",
    order: 1,
  });

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    route_id: "",
    vehicle_id: "",
    tripType: "",
    baseFare: 0,
    minimumKm: 0,
    pricePerKm: 0,
    extraKmCharge: 0,
    driverAllowance: 0,
    tollCharge: 0,
    parkingCharge: 0,
    nightCharge: 0,
    waitingCharge: 0,
  });
  // const today = DateTime.now().toFormat("yyyy-MM-dd");
  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  // ✅ GET DATA
  const getData = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        process.env.apiUrl + "/api/all-fare",
        {
          limit: rowsPerPage,
          page: newPage,
          search: searchQuery,
          order,
        },
        { withCredentials: true },
      );

      setData(res?.data?.data);
      console.log(res?.data?.data);
      setDataCount(res?.data?.pagination?.total);
    } catch {
      toast.error("Error fetching Fare");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetStateList();
  }, []);
  useEffect(() => {
    getData();
  }, [newPage, rowsPerPage, searchQuery, order]);

  const handleGetStateList = async () => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/dropdown-fare",

        { withCredentials: true },
      );
      console.log(res?.data?.data, "sdf");

      // UI state update
      setStatelist(res?.data?.data);
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setError(error?.response?.data?.error);
        toast.error(error?.response?.data?.error);
      } else {
        setError("Error.");
        toast.error("Error.");
      }
    }
  };
  // ✅ CREATE / UPDATE
  const handleSave = async () => {
    try {
      setLoading(true);
      console.log(formData);

      let res = await axios.post(
        process.env.apiUrl + "/api/create-update-fare",
        formData,
        { withCredentials: true },
      );

      // backend ke response ke hisaab se data nikalna
      const addedOrUpdated = res?.data?.data || res?.data?.result;
      setAddModal(false);
      setEditModal(false);
      clearData();

      // setData((prev) => {
      //   if (formData.id) {
      //     // edit case
      //     return prev.map((item) =>
      //       item._id === addedOrUpdated._id ? addedOrUpdated : item,
      //     );
      //   } else {
      //     // add case
      //     let updatedList = [...prev];
      //     if (updatedList.length >= rowsPerPage) {
      //       updatedList = updatedList.filter(
      //         (_, index) => index !== updatedList.length - 1,
      //       );
      //     }
      //     if (addedOrUpdated) {
      //       updatedList.unshift(addedOrUpdated);
      //     }
      //     return updatedList;
      //   }
      // });
setData((prev) => {
  if (formData.id) {
    // EDIT CASE
    return prev.map((item) =>
      item._id === addedOrUpdated._id
        ? {
            ...addedOrUpdated,

            route_id:
              typeof addedOrUpdated.route_id === "object"
                ? addedOrUpdated.route_id
                : item.route_id,

            vehicle_id:
              typeof addedOrUpdated.vehicle_id === "object"
                ? addedOrUpdated.vehicle_id
                : item.vehicle_id,
          }
        : item,
    );
  } else {
    // ADD CASE
    let updatedList = [...prev];

    if (updatedList.length >= rowsPerPage) {
      updatedList = updatedList.filter(
        (_, index) => index !== updatedList.length - 1,
      );
    }

    if (addedOrUpdated) {
      updatedList.unshift(addedOrUpdated);
    }

    return updatedList;
  }
});
      if (!formData.id) {
        setDataCount((prevCount) => prevCount + 1);
      }

      toast.success(res?.data?.message);
    } catch (error: any) {
      if (error?.response?.data?.error) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("Error in saving Fare");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/delete-fare",
        { id },
        { withCredentials: true },
      );

      // UI state update without reload
      setData((prevData) =>
        prevData.map((data) =>
          data._id === id ? { ...data, isDeleted: true } : data,
        ),
      );

      setMessage(res?.data?.message);
      toast.success(res?.data?.message || "Fare deleted successfully");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setError(error?.response?.data?.error);
        toast.error(error?.response?.data?.error);
      } else {
        setError("Error while deleting Fare.");
        toast.error("Error while deleting Fare.");
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/restore-fare",
        { id },
        { withCredentials: true },
      );

      const restoredVehicleType = res?.data?.data;

      // UI state update
      setData((prevData) =>
        prevData.map((data) =>
          data._id === id ? { ...data, isDeleted: false } : data,
        ),
      );

      setMessage(res?.data?.message);
      toast.success(res?.data?.message || "Fare restored successfully");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setError(error?.response?.data?.error);
        toast.error(error?.response?.data?.error);
      } else {
        setError("Error while restoring Fare.");
        toast.error("Error while restoring Fare.");
      }
    }
  };

  const setEditData = (item: RouteFareType) => {
    const fromRouteId = item.route_id?._id || "";
    const fromVehicleId = item.vehicle_id?._id || "";

    setFormData({
      id: item._id,
      route_id: fromRouteId,
      vehicle_id: fromVehicleId,
      tripType: item.tripType,
      baseFare: item.baseFare,
      minimumKm: item.minimumKm,
      pricePerKm: item.pricePerKm,
      extraKmCharge: item.extraKmCharge,
      driverAllowance: item.driverAllowance,
      tollCharge: item.tollCharge,
      parkingCharge: item.parkingCharge,
      nightCharge: item.nightCharge,
      waitingCharge: item.waitingCharge,
    });
    setEditModal(true);
  };

  const clearData = () => {
    setFormData({
      id: "",
      route_id: "",
      vehicle_id: "",
      tripType: "",
      baseFare: 0,
      minimumKm: 0,
      pricePerKm: 0,
      extraKmCharge: 0,
      driverAllowance: 0,
      tollCharge: 0,
      parkingCharge: 0,
      nightCharge: 0,
      waitingCharge: 0,
    });
  };
  return (
    <>
      {/* HEADER */}
      <div className="mb-4 bg-white flex shadow mx-auto">
        <div className="flex items-center border px-4 border-gray-50 w-full rounded-lg justify-between">
          <div className="flex items-center gap-3 relative">
            <ArrowBack
              className="cursor-pointer"
              onClick={() => router.back()}
            />

            <div className="relative py-3 flex items-center">
              <Search className="absolute ms-3 w-4 h-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setNewPage(1);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search"
                className="block flex-1 py-1.5 pl-10 text-gray-900 
              placeholder:text-gray-400 sm:text-sm sm:leading-6 
              focus:outline-none md:w-[24rem] w-[14rem] 
              border border-gray-300 rounded-lg px-2.5"
              />
            </div>
          </div>

          <div
            onClick={() => setAddModal(true)}
            className="bg-blue-400 text-white px-4 py-1 rounded-md cursor-pointer"
          >
            Add Fare
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow sm:rounded-lg w-full border border-gray-100 h-96">
        <table className="w-full text-gray-500 ">
          <thead className="text-[1.05rem] font-midum text-gray-700 uppercase bg-blue-100 border-b border-blue-300">
            <tr className="align-top">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Status</th>
        
              {[
                { col: "route_id", label: "Route id" },
                { col: "vehicle_id", label: "Vehicle id" },
                { col: "tripType", label: "Trip Type" },
                { col: "baseFare", label: "Base Fare" },
                { col: "minimumKm", label: "Minimum Km" },
                { col: "pricePerKm", label: "Price per Km" },
                { col: "extraKmCharge", label: "Extra Km Charge" },
                { col: "driverAllowance", label: "Driver Allowance" },
                { col: "tollAllowance", label: "Toll Allowance" },
                { col: "parkingCharge", label: "Parking Charge" },
                { col: "nightCharge", label: "Night Charge" },
                { col: "waitingCharge", label: "Waiting Charge" },
                { col: "createdAt", label: "Created" },
                { col: "updatedAt", label: "Updated" },
              ].map((item) => (
                <th
                  key={item.col}
                  className="px-4 py-2 cursor-pointer text-center whitespace-normal break-words"
                  onClick={() =>
                    setOrder((prev) => ({
                      col: item.col,
                      order: prev.order * -1,
                    }))
                  }
                >
                  {item.label}
                  <span className="ml-1 inline-flex">
                    {order.col === item.col ? (
                      order.order === 1 ? (
                        <ArrowDropUp sx={{ color: "#16a34a" }} />
                      ) : (
                        <ArrowDropDown sx={{ color: "#16a34a" }} />
                      )
                    ) : (
                      <ArrowDropDown sx={{ color: "#64748b" }} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan={12} className="text-center py-6">
                  <CircularProgress />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="text-lg font-semibold text-gray-900">
              {data?.map((item, index) => (
                <tr
                
                  className="bg-white border-b align-top border-gray-300 text-[1.05rem] text-gray-900 hover:bg-gray-50 even:bg-gray-50"
                >
                  <td className="px-5 py-4 text-center">
                    {(newPage - 1) * rowsPerPage + index + 1}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-4 text-center relative">
                    <button
                      onClick={() =>
                        setOption(option === index ? undefined : index)
                      }
                      className="p-0.5 text-gray-500 hover:text-gray-800 rounded-lg"
                    >
                      <MoreHoriz className="text-orange-500" />
                    </button>

                    {option === index && (
                      <ClickAwayListener
                        onClickAway={() => setOption(undefined)}
                      >
                        <div
                          className="absolute left-10 top-9 border border-gray-100 w-32 bg-white rounded shadow-lg"
                          style={{ zIndex: 100 }}
                        >
                          {item.isDeleted === false ? (
                            <>
                              <div
                                onClick={() => {
                                  setEditData(item);
                                  setOption(undefined);
                                }}
                                className="hover:bg-gray-100 flex items-center px-4 py-2 cursor-pointer"
                              >
                                <Edit fontSize="small" htmlColor="orange" />
                                <span className="ml-2">Edit</span>
                              </div>

                              <div
                                onClick={() => {
                                  handleDelete(item._id);
                                  setOption(undefined);
                                }}
                                className="hover:bg-gray-100 flex items-center px-4 py-2 cursor-pointer"
                              >
                                <Cancel
                                  fontSize="small"
                                  sx={{ color: "red" }}
                                />
                                <span className="ml-2">Delete</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                onClick={() => {
                                  handleRestore(item._id);
                                  setOption(undefined);
                                }}
                                className="hover:bg-gray-100 flex items-center px-4 py-2 cursor-pointer"
                              >
                                <ReplayCircleFilled
                                  fontSize="small"
                                  sx={{ color: "green" }}
                                />
                                <span className="ml-2">Restore</span>
                              </div>

                              <div
                                onClick={() => {
                                  setEditData(item);
                                  setOption(undefined);
                                }}
                                className="hover:bg-gray-100 flex items-center px-4 py-2 cursor-pointer"
                              >
                                <Edit fontSize="small" htmlColor="orange" />
                                <span className="ml-2">Edit</span>
                              </div>
                            </>
                          )}
                        </div>
                      </ClickAwayListener>
                    )}
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        item.isDeleted === false
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isDeleted === false ? "Active" : "Deleted"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">{item.route_id.slug}</td>
                  <td className="px-4 py-4 text-center">{item.vehicle_id.name}</td>

                  <td className="px-4 py-4 text-center">{item.tripType}</td>
                  <td className="px-4 py-4 text-center">{item.baseFare}</td>
                  <td className="px-4 py-4 text-center">{item.minimumKm}</td>
                  <td className="px-4 py-4 text-center">{item.pricePerKm}</td>
                  <td className="px-4 py-4 text-center">
                    {item.extraKmCharge}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {item.driverAllowance}
                  </td>
                  <td className="px-4 py-4 text-center">{item.tollCharge}</td>
                  <td className="px-4 py-4 text-center">
                    {item.parkingCharge}
                  </td>
                  <td className="px-4 py-4 text-center">{item.nightCharge}</td>
                  <td className="px-4 py-4 text-center">
                    {item.waitingCharge}
                  </td>

                  {[item.created_at, item.updated_at].map((date, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {DateTime.fromISO(date).toFormat(
                          "LLL dd, yyyy  , hh:mm",
                        )}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {/* PAGINATION */}
      <div className="p-2 bg-white flex justify-between mt-2">
        <div className="flex justify-between w-full items-center">
          <div className="text-gray-500 text-sm">
            Total: <strong>{dataCount}</strong>
          </div>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataCount}
            rowsPerPage={rowsPerPage}
            page={newPage - 1}
            onPageChange={(e, p) => setNewPage(p + 1)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setNewPage(1);
            }}
            // Modern MUI slotProps syntax replaces back/nextIconButtonProps
            slotProps={{
              actions: {
                nextButton: { style: { display: "none" } },
                previousButton: { style: { display: "none" } },
              },
            }}
          />

          <Pagination
            count={totalPages}
            page={newPage}
            onChange={(e, p) => setNewPage(p)}
            variant="outlined"
            shape="rounded"
            siblingCount={1}
          />
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(addModal || editModal) && (
        <Backdrop open>
          <div className="relative bg-white p-6 rounded w-[400px] space-y-3 text-gray-700">
            {/* Close Button */}
            <button
              onClick={() => {
                setAddModal(false);
                setEditModal(false);
                clearData();
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={20} />
            </button>

            {/* <h2 className="text-xl font-bold">
              {editModal ? "Edit City" : "Add City"}
            </h2> */}
            {/* State Dropdown */}

            {/* <input
              name="badge"
              placeholder="Badge"
              value={formData.badge}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            /> */}

            {/* <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            /> */}

            {/* <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            /> */}
            {/* Popular Toggle */}
            {/* <div className="flex items-center justify-between border rounded p-3">
              <span className="font-medium">Popular City</span>

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    isPopular: !prev.isPopular,
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  formData.isPopular ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    formData.isPopular ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div> */}
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
              {editModal ? "Edit Route Fare" : "Add Route Fare"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Route ID */}

              <select
                name="route_id"
                value={formData.route_id}
                onChange={handleInput}
                className="border w-full p-2 rounded bg-white"
              >
                <option value="">Select Route</option>

                {[
                  ...new Map(
                    statelist.map((fare) => [fare.route_id._id, fare.route_id]),
                  ).values(),
                ].map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.slug}
                  </option>
                ))}
              </select>
              <select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleInput}
                className="border w-full p-2 rounded bg-white"
              >
                <option value="">Select Vehicle</option>

                {[
                  ...new Map(
                    statelist.map((fare) => [
                      fare.vehicle_id._id,
                      fare.vehicle_id,
                    ]),
                  ).values(),
                ].map((vehicle) => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>

              {/* Trip Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trip Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="tripType"
                  value={formData.tripType}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  required
                >
                  <option value="">Select Trip Type</option>
                  <option value="ONEWAY">One Way</option>
                  <option value="ROUNDTRIP">Round Trip</option>
                  <option value="LOCAL">Local</option>
                  <option value="AIRPORT">Airport</option>
                  <option value="RENTAL">Rental</option>
                </select>
              </div>

              {/* Base Fare */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Fare <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="baseFare"
                  placeholder="0.00"
                  value={formData.baseFare || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Minimum Km */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Km <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="minimumKm"
                  placeholder="0"
                  value={formData.minimumKm || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Price per Km */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Km <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerKm"
                  placeholder="0.00"
                  value={formData.pricePerKm || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Extra Km Charge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Km Charge
                </label>
                <input
                  type="number"
                  name="extraKmCharge"
                  placeholder="0.00"
                  value={formData.extraKmCharge || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Driver Allowance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver Allowance
                </label>
                <input
                  type="number"
                  name="driverAllowance"
                  placeholder="0.00"
                  value={formData.driverAllowance || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Toll Charge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Toll Charge
                </label>
                <input
                  type="number"
                  name="tollCharge"
                  placeholder="0.00"
                  value={formData.tollCharge || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Parking Charge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parking Charge
                </label>
                <input
                  type="number"
                  name="parkingCharge"
                  placeholder="0.00"
                  value={formData.parkingCharge || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Night Charge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Night Charge
                </label>
                <input
                  type="number"
                  name="nightCharge"
                  placeholder="0.00"
                  value={formData.nightCharge || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Waiting Charge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waiting Charge
                </label>
                <input
                  type="number"
                  name="waitingCharge"
                  placeholder="0.00"
                  value={formData.waitingCharge || ""}
                  onChange={handleInput}
                  className="border border-gray-300 w-full p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Save
            </button>
          </div>
        </Backdrop>
      )}
    </>
  );
};

export default RouteFareTable;
