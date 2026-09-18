"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import BlogForm from "@/components/BlogComponent/BlogForm";


export default function EditBlogPage() {
  const { slug } = useParams() as { slug: string };
  const [blog, setBlog] = useState(null);

  // console.log(slug, "slug from useParams")

  const getBlog = async () => {
    try {
      // console.log("getting blog", slug)
      const res = await axios.post(
        `${process.env.apiUrl}/api/get-blog-admin`,
        { slug },
        { withCredentials: true }
      )
      // console.log("Fetched blog:", res.data);
       setBlog(res.data?.blog);

    } catch (error) {
      console.log("Error fetching blog:", error);
    } 
  } 
    
  useEffect(() => {
    if (!slug) return;
    getBlog();

  }, [slug]);

  if (!blog) return <div>Loading...</div>;
  

  return <BlogForm isEdit={true} initialData={blog} />;
}



