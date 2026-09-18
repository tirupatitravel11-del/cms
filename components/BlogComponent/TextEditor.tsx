"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  Heading1Icon,
  Highlighter,
  ImageIcon,
  Link2,
  List,
  ListOrdered,
  Bold,
  Italic,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading2,
  Heading3,
} from "lucide-react";

import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import { TextStyle, FontSize, FontFamily } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";

import { ImageComponent } from "./ImageComponent";

import {
  cleanTiptapJSON,
  compressImage,
} from "@/utilities/utillityfunctions";


// ======================================================
// CUSTOM IMAGE EXTENSION
// ======================================================

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      imageId: {
        default: null,
      },

      width: {
        default: 300,
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(
      ImageComponent
    );
  },
});


// ======================================================
// MENU BAR
// ======================================================

const MenuBar = ({
  editor,
  selectedImage,
  setSelectedImage,
  setSelectedImagePos,
  selectedImagePos,
}: {
  editor: any;
  selectedImage: any;
  setSelectedImage: any;
  setSelectedImagePos: any;
  selectedImagePos: number | null;
}) => {
  if (!editor) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const btn =
    "p-2 rounded hover:bg-gray-100 border flex items-center justify-center";

  const [isFontOpen, setIsFontOpen] = useState(false);

  const SAFE_FONTS = [
    "Arial",
    "Calibri",
    "Courier New",
    "Georgia",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
  ];

  const fontSizes = Array.from(
    { length: 93 },
    (_, index) => `${index + 8}px`
  );


  // ====================================================
  // COLOR PICKER
  // ====================================================

  const triggerColorPicker = () => {
    const input = document.createElement("input");

    input.type = "color";

    input.click();

    input.onchange = (e: any) => {
      editor
        .chain()
        .focus()
        .setColor(e.target.value)
        .run();
    };
  };


  // ====================================================
  // LINK
  // ====================================================

  const toggleLink = () => {
    if (!editor) return;

    const isLinkActive =
      editor.isActive("link");

    if (isLinkActive) {
      editor
        .chain()
        .focus()
        .unsetLink()
        .run();

      return;
    }

    const url = window.prompt(
      "Enter URL",
      "https://"
    );

    if (!url) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
      })
      .run();
  };


  // ====================================================
  // UPLOAD IMAGE TO MONGODB
  // ====================================================

  const uploadImage = async (file: File) => {
  try {
    if (!file) {
      return null;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      return null;
    }

    const compressedFile =
      await compressImage(file);

    const formData = new FormData();

    formData.append(
      "file",
      compressedFile
    );

    console.log(
      "Uploading image:",
      compressedFile.name,
      compressedFile.type,
      compressedFile.size
    );

    const response = await axios.post(
      `${process.env.apiUrl}/api/upload-blog-image`,
      formData,
      {
        withCredentials: true,
      }
    );

    console.log(
      "UPLOAD RESPONSE:",
      response.data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.error ||
          "Image upload failed"
      );
    }

  const uploadedFile = response.data.file;


return {
  ...uploadedFile,
  url: `${process.env.apiUrl}${uploadedFile.url}`,
};

  } catch (error: any) {
    console.error(
      "IMAGE UPLOAD ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "DATA:",
      error?.response?.data
    );

    toast.error(
      error?.response?.data?.error ||
        "Image upload failed"
    );

    return null;
  }
};


  // ====================================================
  // UPLOAD + INSERT IMAGE
  // ====================================================

const uploadAndInsertImage = async (
  file: File
) => {
  const image =
    await uploadImage(file);

  if (!image) {
    return;
  }

  console.log(
    "Uploaded MongoDB image:",
    image
  );

  editor
    .chain()
    .focus()
    .setImage({
      src: image.url,

      // MongoDB _id
      imageId: image.id,

      width: 300,
    })
    .run();
};


  // ====================================================
  // DELETE IMAGE
  // ====================================================

  const deleteImage = async () => {
  if (
    !selectedImage ||
    selectedImagePos == null
  ) {
    return;
  }

  const imageId =
    selectedImage.imageId;

  if (!imageId) {
    toast.error("Image ID not found");
    return;
  }

  try {
    console.log(
      "Deleting MongoDB image:",
      imageId
    );

    // 1. Delete image from MongoDB
    await axios.delete(
      `${process.env.apiUrl}/api/delete-blog-image/${imageId}`,
      {
        withCredentials: true,
      }
    );

    // 2. Delete image from Tiptap
    editor
      .chain()
      .focus()
      .deleteRange({
        from: selectedImagePos,
        to:
          selectedImagePos +
          selectedImage.nodeSize,
      })
      .run();

    // 3. Clear selection
    setSelectedImage(null);
    setSelectedImagePos(null);

    toast.success(
      "Image deleted successfully"
    );

  } catch (error: any) {
    console.error(
      "DELETE IMAGE ERROR:",
      error
    );

    toast.error(
      error?.response?.data?.error ||
        "Failed to delete image"
    );
  }
};


  return (
    <div className="border border-gray-300 pb-2 mb-3 flex gap-2 flex-wrap shadow-md">


      {/* ==========================================
          HEADINGS
      ========================================== */}

      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 1,
            })
            .run()
        }
      >
        <Heading1Icon size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run()
        }
      >
        <Heading2 size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({
              level: 3,
            })
            .run()
        }
      >
        <Heading3 size={18} />
      </button>


      {/* ==========================================
          TEXT STYLE
      ========================================== */}

      <button
        type="button"
        className={btn}
        onMouseDown={(e) =>
          e.preventDefault()
        }
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        <Bold size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        <Italic size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
      >
        <Strikethrough size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHighlight()
            .run()
        }
      >
        <Highlighter size={18} />
      </button>


      {/* ==========================================
          COLOR
      ========================================== */}

      <button
        type="button"
        className={btn}
        onClick={
          triggerColorPicker
        }
      >
        <span className="text-lg">
          A
        </span>
      </button>


      {/* ==========================================
          ALIGNMENT
      ========================================== */}

      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign("left")
            .run()
        }
      >
        <AlignLeft size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign("center")
            .run()
        }
      >
        <AlignCenter size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign("right")
            .run()
        }
      >
        <AlignRight size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .setTextAlign("justify")
            .run()
        }
      >
        <AlignJustify size={18} />
      </button>


      {/* ==========================================
          LIST
      ========================================== */}

      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        <List size={18} />
      </button>


      <button
        type="button"
        className={btn}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        <ListOrdered size={18} />
      </button>


      {/* ==========================================
          IMAGE FILE INPUT
      ========================================== */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={async (e) => {

          const file =
            e.target.files?.[0];

          if (!file) return;

          await uploadAndInsertImage(
            file
          );

          e.target.value = "";
        }}
      />


      {/* ==========================================
          IMAGE UPLOAD BUTTON
      ========================================== */}

      <button
        type="button"
        className={btn}
        onClick={() =>
          fileInputRef.current?.click()
        }
      >
        <ImageIcon size={18} />
      </button>


      {/* ==========================================
          DELETE IMAGE BUTTON
      ========================================== */}

      {selectedImage && (
        <button
          type="button"
          className="
            border
            px-3
            py-2
            rounded
            text-red-500
            hover:bg-red-50
          "
          onClick={deleteImage}
        >
          Delete Image
        </button>
      )}


      {/* ==========================================
          FONT SIZE
      ========================================== */}

      <div className="relative">

        <button
          type="button"
          onClick={() =>
            setIsFontOpen(
              !isFontOpen
            )
          }
          className="border rounded px-2 py-2 font-semibold"
        >
          Font Size
        </button>


        {isFontOpen && (
          <div
            className="
              absolute
              top-full
              mt-1
              w-24
              max-h-60
              overflow-y-auto
              border
              bg-white
              shadow-lg
              z-50
            "
          >

            {fontSizes.map(
              (size) => (
                <button
                  key={size}
                  type="button"
                  className="
                    block
                    w-full
                    text-left
                    px-2
                    py-1
                    hover:bg-gray-100
                  "
                  onClick={() => {

                    editor
                      .chain()
                      .focus()
                      .setFontSize(
                        size
                      )
                      .run();

                    setIsFontOpen(
                      false
                    );
                  }}
                >
                  {size}
                </button>
              )
            )}

          </div>
        )}

      </div>


      {/* ==========================================
          FONT FAMILY
      ========================================== */}

      <select
        className="
          border
          rounded
          px-2
          py-1
          font-semibold
        "
        onChange={(e) => {

          if (!e.target.value)
            return;

          editor
            .chain()
            .focus()
            .setFontFamily(
              e.target.value
            )
            .run();
        }}
        defaultValue=""
      >

        <option
          value=""
          disabled
        >
          Font Family
        </option>

        {SAFE_FONTS.map(
          (font) => (
            <option
              key={font}
              value={font}
              style={{
                fontFamily: font,
              }}
            >
              {font}
            </option>
          )
        )}

      </select>


      {/* ==========================================
          LINK
      ========================================== */}

      <button
        type="button"
        onClick={toggleLink}
        className={`
          ${btn}
          ${
            editor.isActive(
              "link"
            )
              ? "bg-gray-200"
              : ""
          }
        `}
      >
        <Link2 size={18} />
      </button>

    </div>
  );
};


// ======================================================
// MAIN TEXT EDITOR
// ======================================================

function TextEditor({
  content,
  setContent,
}: {
  content?: any;
  setContent: any;
}) {

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<any>(null);

  const [
    selectedImagePos,
    setSelectedImagePos,
  ] = useState<number | null>(null);


  // ====================================================
  // TIPTAP EDITOR
  // ====================================================

  const editor = useEditor({

    immediatelyRender: false,

    extensions: [

      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class:
              "ml-5 list-disc",
          },
        },

        orderedList: {
          HTMLAttributes: {
            class:
              "ml-5 list-decimal",
          },
        },
      }),


      Link.configure({
        autolink: true,
        linkOnPaste: true,
        openOnClick: true,

        HTMLAttributes: {
          class:
            "editor-link",
        },
      }),


      // ==========================================
      // CUSTOM MONGODB IMAGE
      // ==========================================

      CustomImage.configure({
        allowBase64: false,
      }),


      ImageResize,

      TextStyle,

      FontSize,

      Color,

      Highlight,

      FontFamily,

      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
        ],
      }),
    ],


    content:
      content || {
        type: "doc",
        content: [],
      },


    onUpdate: ({
      editor,
    }) => {

      const json =
        editor.getJSON();

      const cleanedContent =
        cleanTiptapJSON(json);

      setContent(
        cleanedContent
      );

    },
  });


  // ====================================================
  // SET EDIT CONTENT
  // ====================================================

  useEffect(() => {

    if (
      !editor ||
      !content
    ) {
      return;
    }


    const newContent =
      cleanTiptapJSON(
        content
      );


    const currentContent =
      editor.getJSON();


    if (
      JSON.stringify(
        currentContent
      ) !==
      JSON.stringify(
        newContent
      )
    ) {

      editor.commands.setContent(
        newContent
      );

    }

  }, [editor]);


  // ====================================================
  // IMAGE CLICK / SELECTION
  // ====================================================

  useEffect(() => {

    if (!editor) return;


    const handleClick = (
      event: MouseEvent
    ) => {

      const target =
        event.target as HTMLElement;


      if (
        target.tagName !==
        "IMG"
      ) {

        setSelectedImage(
          null
        );

        setSelectedImagePos(
          null
        );

        return;
      }


      try {

        const pos =
          editor.view.posAtDOM(
            target,
            0
          );


        if (pos == null) {
          return;
        }


        const node =
          editor.state.doc.nodeAt(
            pos
          );


        if (
          !node ||
          node.type.name !==
            "image"
        ) {
          return;
        }


        setSelectedImage({
          imageId:
            node.attrs.imageId,

          src:
            node.attrs.src,

          nodeSize:
            node.nodeSize,
        });


        setSelectedImagePos(
          pos
        );

      } catch (error) {

        console.error(
          "Image selection error:",
          error
        );

      }

    };


    editor.view.dom.addEventListener(
      "click",
      handleClick
    );


    return () => {

      editor.view.dom.removeEventListener(
        "click",
        handleClick
      );

    };

  }, [editor]);


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div>

      <MenuBar
        editor={editor}

        selectedImage={
          selectedImage
        }

        setSelectedImage={
          setSelectedImage
        }

        setSelectedImagePos={
          setSelectedImagePos
        }

        selectedImagePos={
          selectedImagePos
        }
      />


      <EditorContent
        editor={editor}
        className="
          h-[30rem]
          p-3
          mt-10
          overflow-y-auto
          border
          border-gray-300
          w-full
        "
      />

    </div>

  );
}


// ======================================================
// IMPORTANT: DEFAULT EXPORT
// ======================================================

export default TextEditor;