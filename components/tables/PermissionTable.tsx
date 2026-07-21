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

interface PermissionType {
  _id: string;
  name: string;
  label: string;
  created_at: string;
  updated_at: string;
}

interface PermissionFormType {
  id: string;
  name: string;
  label: string;
}

const PermissionTable = () => {
  const router = useRouter();

  const [data, setData] = useState<PermissionType[]>([]);
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

  const [formData, setFormData] = useState<PermissionFormType>({
    id: "",
    name: "",
    label: "",
  });

  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ GET DATA
  const getData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        process.env.apiUrl + "/api/get-all-permission",
        { withCredentials: true }
      );

      let list = res?.data?.data || [];

      if (searchQuery) {
        list = list.filter((p: any) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setDataCount(list.length);

      const start = (newPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;

      setData(list.slice(start, end));
    } catch {
      toast.error("Error fetching permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [newPage, rowsPerPage, searchQuery, order]);

  // ✅ SAVE (ADD / EDIT)
  const handleSave = async () => {
    if (!formData.name || !formData.label) {
      toast.error("Name & Label required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        process.env.apiUrl + "/api/create-permission",
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message);

      setAddModal(false);
      setEditModal(false);

      setFormData({
        id: "",
        name: "",
        label: "",
      });

      getData();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Error saving permission");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.post(
        process.env.apiUrl + `/api/delete-permission`,
        { id },
        { withCredentials: true }
      );

      toast.success(res?.data?.message);
      getData();
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  const setEditData = (item: PermissionType) => {
    setFormData({
      id: item._id,
      name: item.name,
      label: item.label,
    });
    setEditModal(true);
  };

  return (
    <>
      {/* HEADER */}
      <div className="mb-4 bg-white flex shadow mx-auto text-black">
        <div className="flex items-center border px-4 w-full rounded-lg justify-between">
          <div className="flex items-center gap-3 relative">
            <ArrowBack onClick={() => router.back()} className="cursor-pointer"/>

            <div className="relative py-3 flex items-center">
              <Search className="absolute ms-3 w-4 h-4 text-gray-500" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setNewPage(1);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search Permission"
                className="block py-1.5 pl-10 border rounded-lg px-2.5"
              />
            </div>
          </div>

          <div
            onClick={() => setAddModal(true)}
            className="bg-blue-400 text-white px-4 py-1 rounded-md cursor-pointer"
          >
            Add Permission
          </div>
        </div>
      </div>

      {/* TABLE */}
            <div className="overflow-x-auto shadow sm:rounded-lg w-full border border-gray-100">

        <table className="w-full text-gray-500 table-fixed">
          <thead className="text-[1.1rem] font-bold text-gray-700 uppercase bg-blue-100 border-b border-blue-300 ">
                 <tr className="align-top ">
              {["#", "Action"].map((h, i) => (
                <th key={i} className="px-4 py-4 w-24 text-center">
                  {h}
                </th>
              ))}

              {[
                { col: "name", label: "Name" },
                { col: "label", label: "Label" },
                { col: "created_at", label: "Created" },
                { col: "updated_at", label: "Updated" },
              ].map((item) => (
                <th key={item.col} className="cursor-pointer px-4 py-4  text-center w-52 text-wrap ">
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center px-5 py-6">
                  <CircularProgress />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {data.map((item, index) => (
                <tr key={item._id} className="bg-white border-b align-top border-gray-300 text-[1.1rem] text-gray-900 hover:bg-gray-50 even:bg-gray-50"
                  >
                  <td className="text-center">{(newPage - 1) * rowsPerPage + index + 1}</td>

                  {/* ACTION */}
                  <td className="px-5 py-4  font-bold relative text-center">
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
                        <div className="absolute left-10 top-9 border w-32 bg-white rounded shadow-lg">
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
                            <Cancel sx={{ color: "red" }} />
                            <span className="ml-2">Delete</span>
                          </div>
                        </div>
                      </ClickAwayListener>
                    )}
                  </td>

                  <td className="text-center">{item.name}</td>
                  <td className="text-center">{item.label}</td>

                  {[item.created_at, item.updated_at].map((date, i) => (
                    <td key={i} className="text-center">
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
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

      {/* MODAL */}
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
              {editModal ? "Edit Permission" : "Add Permission"}
            </h2>

            <input
              name="name"
              placeholder="Name (edit_user)"
              value={formData.name}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            />

            <input
              name="label"
              placeholder="Label (Edit User)"
              value={formData.label}
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

export default PermissionTable;
