"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowBack,
  Search,
  MoreHoriz,
  Edit,
  Cancel,
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

interface RoleType {
  _id: string;
  name: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
  isDeleted: boolean;
}

const RoleTable = () => {
  const router = useRouter();

  const [data, setData] = useState<RoleType[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newPage, setNewPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const totalPages = Math.ceil(dataCount / rowsPerPage);

  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");

  const [order, setOrder] = useState({
    col: "created_at",
    order: -1,
  });

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    permissions: [] as string[],
  });

  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ GET ROLES
  const getData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(process.env.apiUrl + "/api/get-all-role", {
        withCredentials: true,
      });

      let roles = res?.data?.data || [];

      // search filter frontend (kyuki backend pagination nahi diya)
      if (searchQuery) {
        roles = roles.filter((r: any) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      setDataCount(roles.length);

      // pagination slice
      const start = (newPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      setData(roles.slice(start, end));
    } catch {
      toast.error("Error fetching roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [newPage, rowsPerPage, searchQuery, order]);

  // ✅ SAVE ROLE
  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Role name required");
      return;
    }

    try {
      setLoading(true);

      let res = await axios.post(
        process.env.apiUrl + "/api/create-role",
        formData,
        { withCredentials: true },
      );

      toast.success(res.data.message);

      setAddModal(false);
      setEditModal(false);

      setFormData({
        id: "",
        name: "",
        permissions: [],
      });

      getData();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Error saving role");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE ROLE
  const handleDelete = async (id: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/delete-role",
        { id },
        { withCredentials: true },
      );

      toast.success(res?.data?.message);
      getData();
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };
  const handleSoftDelete = async (id: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/soft-delete-role",
        { id },
        { withCredentials: true },
      );

      toast.success(res?.data?.message);
       setData((prevData) =>
        prevData.map((data) =>
          data._id === data?._id ? { ...data, isDeleted: true } : data
        )
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  const setEditData = (item: RoleType) => {
    setFormData({
      id: item._id,
      name: item.name,
      permissions: item.permissions || [],
    });
    setEditModal(true);
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-4 bg-white flex shadow mx-auto text-black">
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
                placeholder="Search Role"
                className="block py-1.5 pl-10 border rounded-lg px-2.5"
              />
            </div>
          </div>

          <div
            onClick={() => setAddModal(true)}
            className="bg-blue-400 text-white px-4 py-1 rounded-md cursor-pointer"
          >
            Add Role
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow sm:rounded-lg w-full border border-gray-100 h-96 text-black">
        <table className="w-full table-fixed">
          <thead className="bg-blue-100 border-b">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Action</th>

              {[
                { col: "status", label: "Status" },
                { col: "name", label: "Role Name" },
                { col: "permissions", label: "Permissions" },
                { col: "created_at", label: "Created" },
                { col: "updated_at", label: "Updated" },
              ].map((item) => (
                <th
                  key={item.col}
                  className="px-4 py-2 cursor-pointer text-center"
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
                <td colSpan={6} className="text-center py-6">
                  <CircularProgress />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data?.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="px-5 py-4 text-center">
                    {(newPage - 1) * rowsPerPage + index + 1}
                  </td>

                  {/* ACTION */}
                  <td className="px-4 py-4 text-center relative">
                    <button
                      onClick={() =>
                        setOption(option === index ? undefined : index)
                      }
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
                          <div
                            onClick={() => {
                              setEditData(item);
                              setOption(undefined);
                            }}
                            className="hover:bg-gray-100 flex items-center px-4 py-2 cursor-pointer"
                          >
                            <Edit fontSize="small" />
                            <span className="ml-2">Edit</span>
                          </div>

                          <div
                            onClick={() => {
                              handleDelete(item._id);
                              setOption(undefined);
                            }}
                            className="hover:bg-gray-100 flex items-center px-4 py-2 cursor-pointer"
                          >
                            <Cancel fontSize="small" sx={{ color: "red" }} />
                            <span className="ml-2">Delete</span>
                          </div>
                        </div>
                      </ClickAwayListener>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {item.isDeleted ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Deleted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">{item.name}</td>

                  <td className="px-4 py-4 text-center">
                    {item.permissions?.length || 0}
                  </td>

                  {[item.created_at, item.updated_at].map((date, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {DateTime.fromISO(date).toFormat("LLL dd, yyyy")}
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
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataCount}
          rowsPerPage={rowsPerPage}
          page={newPage - 1}
          onPageChange={(e, p) => setNewPage(p + 1)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setNewPage(1);
          }}
        />

        <Pagination
          count={totalPages}
          page={newPage}
          onChange={(e, p) => setNewPage(p)}
          variant="outlined"
          shape="rounded"
        />
      </div>

      {/* ADD / EDIT MODAL */}
      {(addModal || editModal) && (
        <Backdrop open>
          <div className="relative bg-white p-6 rounded w-[400px] space-y-3 text-black">
            <button
              onClick={() => {
                setAddModal(false);
                setEditModal(false);
              }}
              className="absolute top-3 right-3"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold">
              {editModal ? "Edit Role" : "Add Role"}
            </h2>

            <input
              name="name"
              placeholder="Role Name"
              value={formData.name}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            />

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

export default RoleTable;
