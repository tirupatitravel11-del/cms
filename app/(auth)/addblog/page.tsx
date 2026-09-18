"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import slugify from "slugify";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";
import Editor from "@/components/BlogComponent/EditorComponent";

const Page = () => {
  const router = useRouter();
  const { slug } = useParams(); // 👈 slug from URL
  const isEditMode = !!slug; // true if editing

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [status, setStatus] = useState("draft");
  const [author, setAuthor] = useState<string>("");
  const [slugString, setSlugString] = useState<string>("");
  const [publishDate, setPublishDate] = useState<string>("");

  // ---------------- FETCH BLOG FOR EDIT ----------------
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBlog = async () => {
      try {
        const res = await axios.post(
          process.env.apiUrl + "/api/get-blog-admin",
          { slug: slug },
          { withCredentials: true }
        );

        const blog = res?.data?.blog;

        // const blog = res?.data?.blog;

setTitle(
  blog?.title || ""
);

setAuthor(
  blog?.author || ""
);

setSlugString(
  blog?.slug || ""
);

setContent(
  blog?.content || {
    type: "doc",
    content: [],
  }
);

setStatus(
  blog?.blogstatus || "draft"
);

setPublishDate(
  blog?.publisheddate
    ? blog.publisheddate
        .split("T")[0]
    : ""
);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load blog");
      }
    };

    fetchBlog();
  }, [slug]);

  // ---------------- SUBMIT HANDLER ----------------
  const handleSubmit = async () => {
    const finalSlug = slugify(slugString.toLowerCase());

    if (!title || !content || !finalSlug || !author) {
      toast.error("Please fill all the fields");
      return;
    }

    const payload = {
      title,
      slug: finalSlug,
      content,
      blogstatus: status,
      author,
      publisheddate: publishDate || null,
    };

    try {
      const url = isEditMode
        ? process.env.apiUrl + "/api/edit-blog"
        : process.env.apiUrl + "/api/create-blog";

      await axios.post(url, payload, { withCredentials: true });

      toast.success(
        isEditMode
          ? "Blog updated successfully"
          : "Blog created successfully"
      );

      router.push("/blog");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 min-h-screen">
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit Blog" : "Create Blog"}
      </h1>

      <input
        className="w-full border p-3 text-lg"
        placeholder="Blog title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <h1 className="text-2xl font-bold">Author</h1>
      <input
        className="w-full border p-3 text-lg"
        placeholder="Author name"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <h1 className="text-2xl font-bold">Url / Slug</h1>
      <input
        className="w-full border p-3 text-lg"
        placeholder="blog-url"
        value={slug}
        onChange={(e) => setSlugString(e.target.value)}
      />

      <h1 className="text-2xl font-bold">Blog Content</h1>

      <Editor onChange={setContent} />

      <div className="grid grid-cols-2 gap-10 py-3">
        <div className="w-full">
          <h1 className="text-2xl font-bold">Publish Date</h1>

          <input
            type="date"
            className="w-full border p-3 text-xl font-bold"
            value={publishDate}
            onChange={(e) => setPublishDate(e.target.value)}
          />
        </div>

        <div className="w-full">
          <h1 className="text-2xl font-bold">Status</h1>

          <select
            className="border p-2 w-full text-xl font-semibold"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Publish</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 rounded-md text-white px-6 py-2 text-xl"
      >
        {isEditMode ? "Update Blog" : "Save Blog"}
      </button>
    </div>
  );
};

export default Page;
