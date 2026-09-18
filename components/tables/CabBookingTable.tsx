"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowBack,
  MoreHoriz,
  Cancel,
} from "@mui/icons-material";
import {
  CircularProgress,
  Pagination,
  TablePagination,
  ClickAwayListener,
} from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Search } from "lucide-react";
import { DateTime } from "luxon";
import NoData from "../NoData";

interface CabBookingType {
  _id: string;
  name: string;
  phoneNo: string;
  serviceType: string;
  pickup: string;
  drop: string;
  trip: string;
  date: string;
  from: string;
  to: string;
  fare: number;
  vehicle: string;
  createdAt: string;
  updatedAt: string;
}

const CabBookingTable = () => {
  const router = useRouter();

  const [data, setData] = useState<CabBookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newPage, setNewPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);

  const [option, setOption] = useState<number | undefined>();

  const totalPages = Math.ceil(dataCount / rowsPerPage);

  // =========================
  // GET DATA
  // =========================
  const getData = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        process.env.apiUrl + "/api/get-booking-cab",
        {
          page: newPage,
          limit: rowsPerPage,
          search: searchQuery,
          order: {
            col: "createdAt",
            order: -1,
          },
        }
      );

      setData(res?.data?.data || []);
      setDataCount(res?.data?.count || 0);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching cab bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [searchQuery, newPage, rowsPerPage]);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await axios.post(
        process.env.apiUrl + "/api/delete-cab-booking",
        { id }
      );

      setData((prevData) =>
        prevData.filter((item) => item._id !== id)
      );

      setDataCount((prev) => Math.max(prev - 1, 0));

      toast.success("Booking deleted.");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete booking.");
    }
  };

  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="mb-4 bg-white flex shadow mx-auto">
        <div className="flex items-center border px-4 border-gray-50 w-full rounded-lg justify-between">
<div className="font-semibold text-gray-700">
            Cab Bookings
          </div>
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
                className="
                  block flex-1 py-1.5 pl-10
                  text-gray-900
                  placeholder:text-gray-400
                  sm:text-sm sm:leading-6
                  focus:outline-none
                  md:w-[24rem] w-[14rem]
                  border border-gray-300
                  rounded-lg px-2.5
                "
              />
            </div>
          </div>

          

        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto shadow sm:rounded-lg w-full border border-gray-100 h-96">

        <table className="w-full text-gray-500 table-fixed">

          {/* HEADER */}
          <thead
            className="
              text-[1.05rem]
              font-medium
              text-gray-700
              uppercase
              bg-blue-100
              border-b
              border-blue-300
            "
          >
            <tr>

              <th className="px-2 py-2 w-[50px]">
                #
              </th>

              <th className="px-2 py-2 w-[80px]">
                Action
              </th>

              <th className="px-4 py-2 w-[160px]">
                Name
              </th>

              <th className="px-4 py-2 w-[150px]">
                Phone
              </th>

              <th className="px-4 py-2 w-[120px]">
                Service
              </th>

              <th className="px-4 py-2 w-[180px]">
                Pickup
              </th>

              <th className="px-4 py-2 w-[180px]">
                Drop
              </th>

              <th className="px-4 py-2 w-[130px]">
                Trip
              </th>

              <th className="px-4 py-2 w-[130px]">
                Date
              </th>

              <th className="px-4 py-2 w-[150px]">
                From
              </th>

              <th className="px-4 py-2 w-[150px]">
                To
              </th>

              <th className="px-4 py-2 w-[120px]">
                Fare
              </th>

              <th className="px-4 py-2 w-[220px]">
                Vehicle
              </th>

              <th className="px-4 py-2 w-[160px]">
                Created
              </th>

              <th className="px-4 py-2 w-[160px]">
                Updated
              </th>

            </tr>
          </thead>

          {/* ================= BODY ================= */}

          {loading ? (
            <tbody>
              <tr>
                <td
                  colSpan={15}
                  className="text-center py-6"
                >
                  <CircularProgress />
                </td>
              </tr>
            </tbody>
          ) : data?.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={15}>
                  <NoData />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody
              className="
                text-md
                font-semibold
                text-gray-900
              "
            >

              {data.map((item, index) => (
                <tr
                  key={item._id}
                  className="
                    bg-white
                    border-b
                    border-gray-300
                    hover:bg-gray-50
                    even:bg-gray-50
                  "
                >

                  {/* INDEX */}
                  <td className="px-4 py-3 text-center">
                    {(newPage - 1) * rowsPerPage +
                      index +
                      1}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-3 text-center relative">

                    <button
                      onClick={() =>
                        setOption(
                          option === index
                            ? undefined
                            : index
                        )
                      }
                      className="
                        p-0.5
                        text-gray-500
                        hover:text-gray-800
                        rounded-lg
                      "
                    >
                      <MoreHoriz className="text-orange-500" />
                    </button>

                    {option === index && (
                      <ClickAwayListener
                        onClickAway={() =>
                          setOption(undefined)
                        }
                      >
                        <div
                          className="
                            absolute
                            left-10
                            top-9
                            border
                            border-gray-100
                            w-32
                            bg-white
                            rounded
                            shadow-lg
                          "
                          style={{ zIndex: 100 }}
                        >

                          <div
                            onClick={() => {
                              handleDelete(item._id);
                              setOption(undefined);
                            }}
                            className="
                              hover:bg-gray-100
                              flex
                              items-center
                              px-4
                              py-2
                              cursor-pointer
                            "
                          >
                            <Cancel
                              fontSize="small"
                              sx={{ color: "red" }}
                            />

                            <span className="ml-2">
                              Delete
                            </span>
                          </div>

                        </div>
                      </ClickAwayListener>
                    )}

                  </td>

                  {/* NAME */}
                  <td className="px-4 py-3 text-center break-words">
                    {item.name || "-"}
                  </td>

                  {/* PHONE */}
                  <td className="px-4 py-3 text-center">
                    {item.phoneNo || "-"}
                  </td>

                  {/* SERVICE TYPE */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="
                        bg-blue-100
                        text-blue-700
                        px-2
                        py-1
                        rounded
                        text-xs
                      "
                    >
                      {item.serviceType || "-"}
                    </span>
                  </td>

                  {/* PICKUP */}
                  <td className="px-4 py-3 text-center break-words">
                    {item.pickup || "-"}
                  </td>

                  {/* DROP */}
                  <td className="px-4 py-3 text-center break-words">
                    {item.drop || "-"}
                  </td>

                  {/* TRIP */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="
                        bg-purple-100
                        text-purple-700
                        px-2
                        py-1
                        rounded
                        text-xs
                      "
                    >
                      {item.trip || "-"}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="
                        bg-green-100
                        text-green-800
                        text-xs
                        font-medium
                        px-2.5
                        py-0.5
                        rounded-full
                      "
                    >
                      {item.date
                        ? DateTime.fromISO(
                            item.date
                          ).toFormat("dd LLL yyyy")
                        : "-"}
                    </span>
                  </td>

                  {/* FROM */}
                  <td className="px-4 py-3 text-center break-words">
                    {item.from || "-"}
                  </td>

                  {/* TO */}
                  <td className="px-4 py-3 text-center break-words">
                    {item.to || "-"}
                  </td>

                  {/* FARE */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="
                        bg-yellow-100
                        text-yellow-800
                        px-2
                        py-1
                        rounded
                        text-xs
                      "
                    >
                      ₹{item.fare?.toLocaleString("en-IN") || 0}
                    </span>
                  </td>

                  {/* VEHICLE */}
                  <td className="px-4 py-3 text-center break-words">
                    {item.vehicle || "-"}
                  </td>

                  {/* CREATED */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="
                        bg-red-100
                        text-red-800
                        text-xs
                        font-medium
                        px-2.5
                        py-0.5
                        rounded-full
                      "
                    >
                      {item.createdAt
                        ? DateTime.fromISO(
                            item.createdAt
                          ).toFormat("dd LLL yyyy, hh:mm a")
                        : "-"}
                    </span>
                  </td>

                  {/* UPDATED */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className="
                        bg-orange-100
                        text-orange-800
                        text-xs
                        font-medium
                        px-2.5
                        py-0.5
                        rounded-full
                      "
                    >
                      {item.updatedAt
                        ? DateTime.fromISO(
                            item.updatedAt
                          ).toFormat("dd LLL yyyy, hh:mm a")
                        : "-"}
                    </span>
                  </td>

                </tr>
              ))}

            </tbody>
          )}

        </table>
      </div>

      {/* ================= PAGINATION ================= */}

      <div className="p-2 bg-white flex justify-between mt-2">

        <div className="flex justify-between w-full items-center">

          {/* TOTAL */}
          <div className="text-gray-500 text-sm">
            Total: <strong>{dataCount}</strong>
          </div>

          {/* ROWS PER PAGE */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={dataCount}
            rowsPerPage={rowsPerPage}
            page={newPage - 1}
            onPageChange={(e, p) =>
              setNewPage(p + 1)
            }
            onRowsPerPageChange={(e) => {
              setRowsPerPage(
                parseInt(e.target.value)
              );
              setNewPage(1);
            }}
            // backIconButtonProps={{
            //   style: { display: "none" },
            // }}
            // nextIconButtonProps={{
            //   style: { display: "none" },
            // }}
             slotProps={{
    actions: {
      nextButton: { style: { display: "none" } },
      previousButton: { style: { display: "none" } }
    }
  }}
          />

          {/* PAGE NUMBERS */}
          <Pagination
            count={totalPages}
            page={newPage}
            onChange={(e, p) =>
              setNewPage(p)
            }
            variant="outlined"
            shape="rounded"
          />

        </div>
      </div>
    </>
  );
};

export default CabBookingTable;