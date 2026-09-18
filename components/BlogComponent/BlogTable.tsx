"use client";
import {
  ArrowBack,
  ArrowDropDown,
  ArrowDropUp,
  Cancel,
  Close,
  Edit,
  FilterAlt,
  MoreHoriz,
  Replay,
  ReplayCircleFilled,
  Search,
  SimCardDownloadOutlined,
} from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { DateTime } from "luxon";
import axios from "axios";
import {
  Backdrop,
  CircularProgress,
  ClickAwayListener,
  Pagination,
  Skeleton,
  TablePagination,
  Tooltip,
} from "@mui/material";
// import { NextPageFuncType, PrevPageFuncType, QAListType } from "@/app/feed-question/page";/
import { usePathname, useRouter } from "next/navigation";
import { CourseType } from "@/types/type";
import NoData from "../NoData";
import Toast from "../Toast";
import toast from "react-hot-toast";
import { BookKey } from "lucide-react";
import Link from "next/link";
import slugify from "slugify";

interface blogType {
  _id: string;
  title: string;
  content: {},
  blogstatus: string
  status: number,
  author: string,
  slug: string,
  publisheddate: string,
  created_at: string,
  updated_at: string
}

const BlogTable = () => {
  const [data, setData] = useState<blogType[]>([]);
  const [dataCount, setDataCount] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [newPage, setNewPage] = useState<number>(1);
  const page = useRef<number>(1);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const totalPages = Math.ceil(dataCount / rowsPerPage);
  const [option, setOption] = useState<number>();
  const [order, setOrder] = useState<{ col: string; order: number }>({
    col: "created_at",
    order: -1,
  });
  const [addModal, setAddModal] = useState<boolean>(false);
  const showAddModal = () => setAddModal(true);
  const hideAddModal = () => setAddModal(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const showEditModal = () => setEditModal(true);
  const hideEditModal = () => setEditModal(false);
  const [Modules, setModules] = useState<boolean>(false);
  const showModulesModal = () => setModules(true);
  const hideModulesModal = () => setModules(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const pathName = usePathname()
  const router = useRouter()


  const [blogs, setBlogs] = useState<blogType[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 3000);
    } else if (message) {
      timer = setTimeout(() => {
        setMessage("");
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [error, message]);

  useEffect(() => {   
      getAllBlogs();
     }, [newPage, rowsPerPage, order, searchQuery]);

  const getAllBlogs = async () => {
    try {
      setLoading(true);
      let res = await axios.post(
        process.env.apiUrl + `/api/get-all-blog-admin`,
        {order, page:newPage, limit:rowsPerPage, search:searchQuery},
        { withCredentials: true }
      );
      let data = res?.data?.blogs;
      setBlogs(data);
      setDataCount(res?.data.totalCount)
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    setNewPage(newPage);
  };
  const onChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setNewPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setNewPage(1);
  };



  const handleDelete = async (blogId: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + `/api/delete-blog`,
        { id: blogId },
        { withCredentials: true }
      );
      // setData([...data])
      setBlogs((prevData) =>
        prevData.map((blog: blogType) =>
          blog._id === blogId ? { ...blog, status: 14, blogstatus:"draft" } : blog
        )
      );
      toast.success("Blog deleted successfully");

      setMessage(res?.data?.message);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError("Error while deleting the course.");
      }
    }
  };
  const handleRestore = async (blogId: string) => {
    try {
      let res = await axios.post(
        process.env.apiUrl + `/api/restore-blog`,
        { id: blogId },
        { withCredentials: true }
      );
      setBlogs((prevData) =>
        prevData.map((blog) =>
          blog._id === blogId ? { ...blog, status: 13, blogstatus:"published"} : blog
        )
      );
      toast.success("Blog restored successfully");

      setMessage(res?.data?.message);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError("Error while restoring the course.");
      }
    }
  };


  const handlePublishStatus = async (blogId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "published" ? "draft" : "published";
      let res = await axios.post(
        process.env.apiUrl + `/api/blog-status`,
        { id: blogId, blogstatus: newStatus },
        { withCredentials: true }
      );
      setBlogs((prevData) =>
        prevData.map((blog) =>
          blog._id === blogId ? { ...blog, blogstatus: newStatus } : blog
        )
      );
      toast.success("Blog status updated successfully");
      setMessage(res?.data?.message);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        setError(error?.response?.data?.message);
      } else {
        setError("Error while updating blog status.");
      }
    }

  };

  return (
    <>
      {/* 🔍 Header Section */}

      <div className="mb-4 bg-white flex shadow mx-auto">
        <div className="flex items-center border px-4 border-gray-50 w-full rounded-lg justify-between">
          <div className="flex items-center gap-3 relative">
            <ArrowBack
              className="cursor-pointer"
              onClick={() => router.back()}
            />

            {/* Search Input */}
            <div className="relative py-3 flex items-center">
              <Search className="absolute ms-3 w-4 h-4 text-gray-500" />
              <input
                onChange={(e) => {
                  setNewPage(1);
                  setSearchQuery(e.target.value);
                  // setFilter(false);
                }}
                value={searchQuery}
                type="text"
                placeholder="Search"
                className="block flex-1 py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none md:w-[24rem] w-[14rem] border border-gray-300 rounded-lg px-2.5"
              />
            </div>
          </div>

          {/* Add Button */}
          <div className="flex gap-2">
            <div
              onClick={() => {
                router.push("/blog/new")
              }}
              className="bg-blue-400 text-white px-4 py-1 rounded-md cursor-pointer" >
              Add
            </div>

            {/* Filter + Reload */}
            {data.length > 0 && (
              <div className="flex items-center gap-2">
                <Tooltip title="Filter" placement="top-start">
                  <button
                    className="block text-black bg-white border-2 border-blue-400 font-medium rounded-lg text-sm px-2 py-0.5 text-center"
                    type="button"
                  >
                    <FilterAlt
                      sx={{ color: "#4289e8", width: "1.2rem", height: "1.2rem" }}
                    />
                    Filter By
                  </button>
                </Tooltip>

                <span className="rounded-full cursor-pointer">
                  <Replay sx={{ color: "#4289e8" }} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 🧾 Table Section */}
      <div className="overflow-x-auto shadow sm:rounded-lg w-full border border-gray-100">
        <table className="w-full text-gray-500 table-fixed">
          <thead className="text-[1.1rem] font-bold text-gray-700 uppercase bg-blue-100 border-b border-blue-300 ">
            <tr className="align-top ">

              {["#", "Action"].map((h, i) => (
                <th key={i} className="px-4 py-4 w-24">
                  {h}
                </th>
              ))}

              {/* Sortable Columns */}
              {[
                { col: "blogstatus", label: "Blog Status" },
                { col: "title", label: "Title" },
                { col: "author", label: "Author" },
                { col: "publisheddate", label: "Published" },
                { col: "slug", label: "Slug/Url" },
                { col: "created_at", label: "Created At" },
                { col: "updated_at", label: "Updated At" },
              ].map((item) => (
                <th
                  key={item.col}
                  scope="col"
                  className={`px-4 py-4 cursor-pointer text-center align-top
                  ${item.col === "description" ? "w-80" : "w-40"} 
                  whitespace-normal break-words`}
                  onClick={() =>
                    setOrder((prev) =>
                      prev.col === item.col
                        ? { col: item.col, order: prev.order * -1 }
                        : { col: item.col, order: 1 }
                    )
                  }
                >
                  <span>{item.label}</span>
                  <span className="ml-2">
                    {order?.col === item.col ? (
                      order.order === -1 ? (
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

          {/* Table Body */}
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={8} className="text-center py-5">
                  <CircularProgress />
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="text-lg font-semibold text-gray-900">
              {blogs?.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <NoData />
                  </td>
                </tr>
              ) : (
                blogs?.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b align-top border-gray-300 text-[1.2rem] text-gray-900 hover:bg-gray-50 even:bg-gray-50"
                  >
                    {/* Index */}
                    <td className="px-5 py-4 text-center">
                      {(newPage - 1) * rowsPerPage + (index + 1)}
                    </td>

                    {/* Action Dropdown */}
                    <td className="px-4 py-4 text-center relative">
                      <button
                        onClick={() =>
                          setOption(option === index + 1 ? 0 : index + 1)
                        }
                        className="p-0.5 text-gray-500 hover:text-gray-800 rounded-lg"
                      >
                        <MoreHoriz className="text-orange-500" />
                      </button>

                      {option === index + 1 && (
                        <ClickAwayListener onClickAway={() => setOption(0)}>
                          <div
                            className={`absolute ${data.length - 1 === index ? "bottom-5" : "top-9"
                              } left-14 border border-gray-100 w-32 bg-white rounded shadow-lg`}
                            style={{ zIndex: 100 }}
                          >
                            <ul className="text-md text-gray-700 cursor-pointer">
                              {item.status === 13 ? (
                                <>
                                  {/* Edit Option */}
                                  <li
                                    onClick={() => {
                                      // console.log("edit clicked", item.title);
                                      router.push(`/blog/${item?.slug}`);
                                      // setEditData(item);
                                      // showEditModal();
                                      setOption(0);
                                    }}
                                    className="hover:bg-gray-100 flex items-center px-4 py-2"
                                  >

                                    <Edit fontSize="small" htmlColor="orange" />
                                    <span className="ml-2">Edit</span>
                                  </li>

                                  {/* Delete Option */}
                                  <li
                                    onClick={() => {
                                      handleDelete(item._id);
                                      setOption(0);
                                    }}
                                    className="hover:bg-gray-100 flex items-center px-4 py-2"
                                  >
                                    <Cancel
                                      fontSize="small"
                                      sx={{ color: "red" }}
                                    />
                                    <span className="ml-2">Delete</span>
                                  </li>
                                </>
                              ) : (
                                <>
                                  {/* Restore Option */}
                                  <li
                                    onClick={() => {
                                      handleRestore(item._id);
                                      setOption(0);
                                    }}
                                    className="hover:bg-gray-100 flex items-center px-4 py-2"
                                  >
                                    <ReplayCircleFilled
                                      fontSize="small"
                                      sx={{ color: "green" }}
                                    />
                                    <span className="ml-2">Restore</span>
                                  </li>
                                </>
                              )

                              }
                              {/* <li
                                onClick={() => { */}
                              {/* // router.push("/coursemodules?id=" + item._id);
                                  // setEditData(item);
                                //   showModulesModal();
                                //   setOption(0);
                                // }} */}
                              {/* className="hover:bg-gray-100 flex items-center px-4 py-2"
                              >
                                <BookKey fontSize="small" className="text-blue-500" />
                                <span className="ml-2">Modules</span>
                              </li> */}
                            </ul>
                          </div>
                        </ClickAwayListener>
                      )}
                    </td>

                    {/* Status */}
                    {/* <td className="px-5 py-4 text-center">
                      {item.blogstatus ? (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Active
                        </span>
                      ) : item.status === 14 ? (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Deleted
                        </span>
                      ) : (
                        "--"
                      )}
                    </td> */}
                    <td className="px-4 py-4 text-center">
                      {/* {item?.blogstatus || ""} */}
                      <button
                        onClick={() => handlePublishStatus(item._id, item.blogstatus)}
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-300 ease-in-out
                        ${item.blogstatus == "published" ? "bg-blue-600" : "bg-gray-300"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out
                          ${item.blogstatus == "draft" ? "translate-x-1" : "translate-x-4"}`}
                        />
                      </button>
                    </td>
                    {/* Columns */}
                    <td className="px-4 py-4 text-center cursor-pointer"
                    // onClick={() => { handleClick(item) }}
                    >
                      {item?.title || "--"}
                    </td>
                    <td className="px-4 py-4 text-center cursor-pointer"
                    // onClick={() => { handleClick(item) }}
                    >
                      {item?.author || "--"}
                    </td>
                    {/* <td className="px-4 py-4 text-center"> */}
                    {/* {item?.blogstatus || ""} */}
                    {/* <button */}
                    {/* onClick={() => handlePublishStatus(item._id, item.blogstatus)} */}
                    {/* className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-300 ease-in-out */}
                    {/* ${item.blogstatus == "published" ? "bg-blue-600" : "bg-gray-300"}`} */}
                    {/* > */}
                    {/* <span */}
                    {/* className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ease-in-out */}
                    {/* ${item.blogstatus == "draft" ? "translate-x-6" : "translate-x-1"}`} */}
                    {/* /> */}
                    {/* </button> */}
                    {/* </td> */}
                    <td className="px-4 py-4 text-center">
                      <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {item.publisheddate
                          ? DateTime.fromISO(item?.publisheddate).toFormat(
                            "LLL dd, yyyy"
                          )
                          : "--"}
                      </span>

                    </td>
                    <td className="px-4 py-4 text-center">
                      {item?.slug || ""}
                    </td>

                    <td className="px-4 py-4 text-center">
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {item.created_at
                          ? DateTime.fromISO(item.created_at).toFormat(
                            "LLL dd, yyyy hh:mm a"
                          )
                          : "--"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {item.updated_at
                          ? DateTime.fromISO(item.updated_at).toFormat(
                            "LLL dd, yyyy hh:mm a"
                          )
                          : "--"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* 📄 Pagination Footer */}
      <div className="p-2 bg-white flex justify-between mt-2">
        {loading ? (
          <Skeleton
            variant="text"
            sx={{ width: "100px", marginLeft: "15px" }}
          />
        ) : (
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
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              //     backIconButtonProps={{ style: { display: "none" } }}
              // nextIconButtonProps={{ style: { display: "none" } }}
           slotProps={{
    actions: {
      nextButton: { style: { display: "none" } },
      previousButton: { style: { display: "none" } }
    }
  }}
            />

            <Pagination
              count={totalPages}
              page={newPage}
              onChange={onChangePage}
              variant="outlined"
              shape="rounded"
              siblingCount={1}
            />
          </div>
        )}
      </div>



    </>
  );
};

export default BlogTable;
