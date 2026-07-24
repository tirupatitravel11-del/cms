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

  from_state_id: string;
  from_city_id: string;

  to_state_id: string;
  to_city_id: string;

  slug: string;
  distance: number | "";
  duration: string;
  image: string;
  tags: string[];
  isPopular: boolean;
  sortOrder: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  created_at: string;
  updated_at: string;
}
interface RouteTypeForm {
  id?: string;
  from_state_id: string;
  from_city_id: string;
  to_state_id: string;
  to_city_id: string;
  slug: string;
  distance: number | "";
  duration: string;
  image: string;
  tags: string[];
  isPopular: boolean;
  description: string;
}
const Route = () => {
  const router = useRouter();

  const [data, setData] = useState<RouteType[]>([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statelist, setStatelist] = useState<any[]>([]);
  const [newPage, setNewPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);
  const totalPages = Math.ceil(dataCount / rowsPerPage);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [option, setOption] = useState<number>();
  const [searchQuery, setSearchQuery] = useState("");
  const [tagInput, setTagInput] = useState("");

  const [order, setOrder] = useState({
    col: "priority",
    order: 1,
  });

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [fromCityList, setFromCityList] = useState<any[]>([]);
  const [toCityList, setToCityList] = useState<any[]>([]);

  const [formData, setFormData] = useState<RouteTypeForm>({
    id: "",
    from_state_id: "",
    from_city_id: "",
    to_state_id: "",
    to_city_id: "",
    slug: "",
    distance: "",
    duration: "",
    image: "",
    tags: [],
    isPopular: false,
    description: "",
  });
  // const today = DateTime.now().toFormat("yyyy-MM-dd");
  const handleInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGetStateList = async () => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/dropdown-state",

        { withCredentials: true },
      );

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
  useEffect(() => {
    handleGetStateList();
  }, []);

  const handleGetCityList = async (stateId: string, type: "from" | "to") => {
    try {
      const res = await axios.post(
        process.env.apiUrl + "/api/dropdown-city",
        {
          state_id: stateId,
        },
        {
          withCredentials: true,
        },
      );

      if (type === "from") {
        setFromCityList(res?.data?.data || []);
      } else {
        setToCityList(res?.data?.data || []);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Error fetching Route");
    }
  };

  const handleStateChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "from_state_id" && {
        from_city_id: "",
      }),

      ...(name === "to_state_id" && {
        to_city_id: "",
      }),
    }));

    if (name === "from_state_id") {
      setFromCityList([]);
      handleGetCityList(value, "from");
    }

    if (name === "to_state_id") {
      setToCityList([]);
      handleGetCityList(value, "to");
    }
  };
  // ✅ GET DATA
  const getData = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        process.env.apiUrl + "/api/all-route",
        {
          limit: rowsPerPage,
          page: newPage,
          search: searchQuery,
          order,
        },
        { withCredentials: true },
      );

      setData(res?.data?.data);

      setDataCount(res?.data?.pagination?.total);
    } catch {
      toast.error("Error fetching Route");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [newPage, rowsPerPage, searchQuery, order]);

  // ✅ CREATE / UPDATE
  const handleSave = async () => {
    try {
      setLoading(true);
      let res = await axios.post(
        process.env.apiUrl + "/api/create-update-route",
        formData,
        { withCredentials: true },
      );

      // backend ke response ke hisaab se data nikalna
      const addedOrUpdated = res?.data?.data || res?.data?.result;
      setAddModal(false);
      setEditModal(false);
      clearData();

      setData((prev) => {
        if (formData.id) {
          // edit case
          return prev.map((item) =>
            item._id === addedOrUpdated._id ? addedOrUpdated : item,
          );
        } else {
          // add case
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
        toast.error("Error in saving Route");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleAddTag = () => {
    const newTag = tagInput.trim();

    if (!newTag) return;

    // Prevent duplicate tags
    if (formData.tags.includes(newTag)) {
      toast.error("Tag already exists");
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));

    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/delete-route",
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
      toast.success(res?.data?.message || "Route deleted successfully");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setError(error?.response?.data?.error);
        toast.error(error?.response?.data?.error);
      } else {
        setError("Error while deleting Route.");
        toast.error("Error while deleting Route.");
      }
    }
  };

  const handleRestore = async (id: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + "/api/restore-route",
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
      toast.success(res?.data?.message || "Route restored successfully");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        setError(error?.response?.data?.error);
        toast.error(error?.response?.data?.error);
      } else {
        setError("Error while restoring Route.");
        toast.error("Error while restoring Route.");
      }
    }
  };

  // const handleToggle = async (id: string, isActive: boolean) => {
  //   try {
  //     let url = isActive
  //       ? process.env.apiUrl + "/api/unpublish-flash"
  //       : process.env.apiUrl + "/api/publish-flash";

  //     let res = await axios.post(url, { id }, { withCredentials: true });

  //     // UI update
  //     setData((prevData) =>
  //       prevData.map((flash) =>
  //         flash._id === id ? { ...flash, isActive: !isActive } : flash,
  //       ),
  //     );

  //     toast.success(res?.data?.message);
  //   } catch (error: any) {
  //     toast.error(error?.response?.data?.error || "Error toggling status");
  //   }
  // };

  const setEditData = (item: RouteTypeForm) => {
    setFormData({
      id: item.id,
      from_state_id: item.from_state_id,
      from_city_id: item.from_city_id,
      to_state_id: item.to_state_id,
      to_city_id: item.to_city_id,
      slug: item.slug,
      distance: item.distance,
      duration: item.duration,
      image: item.image,
      tags: item.tags,
      isPopular: item.isPopular,
      description: item.description,
    });
    setEditModal(true);
  };

  const clearData = () => {
    setFormData({
      id: "",
      from_state_id: "",
      from_city_id: "",
      to_state_id: "",
      to_city_id: "",
      slug: "",
      distance: "",
      duration: "",
      image: "",
      tags: [],
      isPopular: false,
      description: "",
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
            Add Route
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow sm:rounded-lg w-full border border-gray-100 h-96">
        <table className="w-full text-gray-500 table-fixed">
          <thead className="text-[1.05rem] font-midum text-gray-700 uppercase bg-blue-100 border-b border-blue-300">
            <tr className="align-top">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Action</th>
              <th className="px-4 py-2">Status</th>
              {/* <th className="px-4 py-2">Visibility</th> */}

              {[
                { col: "name", label: "Name" },

                { col: "description", label: "Description" },
                { col: "tags", label: "Tags" },
                { col: "popular", label: "Popular" },
                { col: "created_at", label: "Created" },
                { col: "updated_at", label: "Updated" },
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
                  key={item._id}
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

                  {/* VISIBILITY */}
                  {/* <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleToggle(item._id, item.isActive)}
                          className={`relative flex w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
                            item.isActive ? "bg-blue-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
                              item.isActive ? "translate-x-5" : ""
                            }`}
                          />
                        </button>

                        <span
                          className={`text-md font-bold ${
                            item.isActive ? "text-blue-700" : "text-gray-600"
                          }`}
                        >
                          {item.isActive ? "Published" : "Unpublished"}
                        </span>
                      </div>
                    </td> */}

                  {/* <td className="px-4 py-4 text-center">{item.badge}</td> */}
                  <td className="px-4 py-4 text-center">{item.slug}</td>
                  <td className="px-4 py-4 text-center">{item.description}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {item.tags?.length > 0 ? (
                        item.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                        item.isPopular === false
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item.isPopular === false ? "Rare" : "Popular"}
                    </span>
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

            <h2 className="text-xl font-bold">
              {editModal ? "Edit Route " : "Add Route "}
            </h2>
            <select
              name="from_state_id"
              value={formData.from_state_id}
              onChange={handleStateChange}
              className="border w-full p-2 rounded bg-white"
            >
              <option value="">Select From State</option>

              {statelist.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
            <select
              name="from_city_id"
              value={formData.from_city_id}
              onChange={handleInput}
              className="border w-full p-2 rounded bg-white"
            >
              <option value="">Select From City</option>

              {fromCityList.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            <select
              name="to_state_id"
              value={formData.to_state_id}
              onChange={handleStateChange}
              className="border w-full p-2 rounded bg-white"
            >
              <option value="">Select To State</option>

              {statelist.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
            <select
              name="to_city_id"
              value={formData.to_city_id}
              onChange={handleInput}
              className="border w-full p-2 rounded bg-white"
            >
              <option value="">Select To City</option>

              {toCityList.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            <input
              name="distance"
              placeholder="Distance"
              value={formData.distance}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            />
            <input
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInput}
              className="border w-full p-2 rounded"
            />
            {/* TAGS */}
            <div className="space-y-2">
              <label className="font-medium">Tags</label>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="border w-full p-2 rounded"
                />

                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-blue-500 text-white px-3 rounded"
                >
                  Add
                </button>
              </div>

              {/* Added tags shown only inside form */}
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{tag}</span>

                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-blue-700 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Toggle */}
            <div className="flex items-center justify-between border rounded p-3">
              <span className="font-medium">Popular Cab Type</span>

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

export default Route;
