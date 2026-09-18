

"use client";

import { useEffect, useRef } from "react";
import axios from "axios";

export default function Editor({
  // <-- optional for edit
  onChange,
}: {

  onChange: (data: any) => void;
}) {
  const editorRef = useRef<any>(null);
  const previousDataRef = useRef<any>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    let editor: any = null;
    // if(!content) return

    const initEditor = async () => {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const ImageTool = (await import("@editorjs/image")).default;
      const Header = (await import("@editorjs/header")).default;
      const List = (await import("@editorjs/list")).default;
      const Paragraph = (await import("@editorjs/paragraph")).default;

      editor = new EditorJS({
        holder: "editorjs",
        autofocus: true,
        data: { blocks: [] }, // ✅ works for new + edit
        placeholder: "Start writing your blog…", // 👈 only in ADD mode

        tools: {
          header: {
            class: Header as any,
            inlineToolbar: ["link"],
          },

          paragraph: {
            class: Paragraph as any,
            inlineToolbar: true,
          },

          list: {
            class: List,
            inlineToolbar: true,
          },

          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("fileName", file.name);
                    formData.append("folderName", `blog/training`);

                    // Get presigned URL
                    const res = await axios.post(
                      process.env.apiUrl + "/api/upload-file",
                      formData,
                      { withCredentials: true }
                    );

                    const { uploadUrl, key } = res?.data;

                    // 2️⃣ upload to R2
                    const uploadResult = await axios.put(uploadUrl, file, {
                      withCredentials: false,
                      headers: {
                        "Content-Type":
                          file.type || "application/octet-stream",
                      },
                    });

                    return {
                      success: 1,
                      file: {
                        url: `${process.env.imageUrl}/${key}`,
                        key, // needed for delete
                      },
                    };
                  } catch (err) {
                    console.error("UPLOAD ERROR:", err);
                    return { success: 0 };
                  }
                },
              },
            },
          },
        },

        async onChange() {
          const savedData = await editor.save();

          const prevBlocks = previousDataRef.current?.blocks || [];
          const newBlocks = savedData.blocks || [];

          // detect deleted images
          const deletedImages = prevBlocks.filter(
            (block: any) =>
              block.type === "image" &&
              !newBlocks.some((b: any) => b.id === block.id)
          );

          for (const img of deletedImages) {
            const key = img?.data?.file?.key;

            if (key) {
              try {
                await axios.post(
                  `${process.env.apiUrl}/api/delete-image`,
                  { key },
                  { withCredentials: true }
                );
                // console.log("Deleted from R2:", key);
              } catch (err) {
                console.error("Delete failed:", err);
              }
            }
          }

          previousDataRef.current = savedData;
          onChange(savedData);
        },
      });

      editorRef.current = editor;
      isInitialized.current = true;
    };

    if (!isInitialized.current) {
      initEditor();
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
      }
      editorRef.current = null;
      isInitialized.current = false;
    };
  }, [onChange]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div id="editorjs" />
    </div>
  );
}
