"use client";

import { useState } from "react";
import axios from "axios";
import slugify from "slugify";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextEditor from "./TextEditor";
import { cleanTiptapJSON } from "@/utilities/utillityfunctions";

interface BlogFormProps {
  initialData?: any;
  isEdit: boolean;
}

export default function BlogForm({
  initialData,
  isEdit,
}: BlogFormProps) {
  const router = useRouter();

  const cleanData = cleanTiptapJSON(
    initialData?.content || {
      type: "doc",
      content: [],
    }
  );

  const [title, setTitle] = useState(
    initialData?.title || ""
  );

  const [content, setContent] = useState<any>(
    cleanData
  );

  const [author, setAuthor] = useState(
    initialData?.author || ""
  );

  const [slug, setSlug] = useState(
    initialData?.slug || ""
  );

  const [blogId] = useState(
    initialData?._id || ""
  );

  const [status, setStatus] = useState(
    initialData?.blogstatus || "draft"
  );

  const [publishDate, setPublishDate] = useState(
    initialData?.publisheddate
      ? new Date(
          initialData.publisheddate
        )
          .toISOString()
          .split("T")[0]
      : ""
  );

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async () => {
    const finalSlug = slugify(
      slug.trim().toLowerCase()
    );

    if (
      !title.trim() ||
      !author.trim() ||
      !finalSlug ||
      !content
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const url = isEdit
        ? `${process.env.apiUrl}/api/edit-blog`
        : `${process.env.apiUrl}/api/create-blog`;

      const payload = {
        id: blogId,

        title: title.trim(),

        slug: finalSlug,

        author: author.trim(),

        content,

        blogstatus: status,

        publisheddate: publishDate || null,
      };

      console.log(
        "BLOG PAYLOAD:",
        payload
      );

      const result = await axios.post(
        url,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success(
        result?.data?.message ||
          "Blog saved successfully"
      );

      router.push("/blog");
    } catch (error: any) {
      console.error(
        "BLOG SAVE ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.error ||
          "Error saving blog"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 min-h-screen text-black">

      <h1 className="text-2xl font-bold">
        {isEdit
          ? "Edit Blog"
          : "Create Blog"}
      </h1>

      {/* TITLE */}

      <label className="text-lg font-semibold">
        Blog Title
      </label>

      <input
        className="w-full border-2 border-gray-300 p-3 text-lg"
        placeholder="Blog title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      {/* AUTHOR */}

      <label className="text-lg font-semibold">
        Author
      </label>

      <input
        className="w-full border-2 border-gray-300 p-3 text-lg"
        placeholder="Author"
        value={author}
        onChange={(e) =>
          setAuthor(e.target.value)
        }
      />

      {/* SLUG */}

      <label className="text-lg font-semibold">
        Slug
      </label>

      <input
        className="w-full border-2 border-gray-300 p-3 text-lg"
        placeholder="blog-url"
        value={slug}
        onChange={(e) =>
          setSlug(e.target.value)
        }
      />

      {/* EDITOR */}

      <TextEditor
        content={content}
        setContent={setContent}
      />

      {/* PUBLISH DATE */}

      <div className="grid grid-cols-2 gap-10">

        <div>
          <label className="text-lg font-semibold">
            Publish Date
          </label>

          <input
            type="date"
            className="w-full border-2 border-gray-300 p-3"
            value={publishDate}
            onChange={(e) =>
              setPublishDate(
                e.target.value
              )
            }
          />
        </div>

        {/* STATUS */}

        <div>
          <label className="text-lg font-semibold">
            Status
          </label>

          <select
            className="border-2 border-gray-300 p-3 w-full"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Publish
            </option>
          </select>
        </div>

      </div>

      {/* SAVE */}

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-500 rounded-md text-white px-6 py-2 text-xl"
      >
        {isEdit
          ? "Update Blog"
          : "Save Blog"}
      </button>

    </div>
  );
}