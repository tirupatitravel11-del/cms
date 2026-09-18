"use client";

import React from "react";

import {
  NodeViewWrapper,
  NodeViewProps,
} from "@tiptap/react";

import axios from "axios";

import toast from "react-hot-toast";

export const ImageComponent: React.FC<
  NodeViewProps
> = ({
  node,
  editor,
  getPos,
}) => {
  const imageUrl =
    node.attrs.src;

  const imageId =
    node.attrs.imageId;

console.log("========== IMAGE DEBUG ic==========");
console.log("FULL NODE:ic", node);
console.log("IMAGE SRC:", imageUrl);
console.log("IMAGE ID:", imageId);
console.log("=================================");
  const isSelected =
    editor.isActive("image");

  const deleteImage = async (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!imageId) {
      toast.error(
        "Image ID not found"
      );
      return;
    }

    if (
      typeof getPos !==
      "function"
    ) {
      return;
    }

    const pos = getPos();

    if (pos == null) {
      return;
    }

    try {
      await axios.delete(
        `${process.env.apiUrl}/api/delete-blog-image/${imageId}`,
        {
          withCredentials: true,
        }
      );

      editor
        .chain()
        .focus()
        .deleteRange({
          from: pos,
          to:
            pos +
            node.nodeSize,
        })
        .run();

      toast.success(
        "Image deleted successfully"
      );

    } catch (error: any) {
      console.error(
        "DELETE IMAGE ERROR:",
        error
      );

      toast.error(
        error?.response?.data
          ?.error ||
          "Failed to delete image"
      );
    }
  };

  return (
    <NodeViewWrapper
      className="relative inline-block group my-3"
    >
      <div
        className={`relative inline-block ${
          isSelected
            ? "ring-2 ring-blue-500"
            : ""
        }`}
      >
        <img
          src={imageUrl}
          alt="Blog image"
          contentEditable={false}
          style={{
            width:
              node.attrs.width ||
              "300px",

            maxWidth: "100%",

            height: "auto",

            display: "block",
          }}
          onClick={(e) => {
            e.stopPropagation();

            if (
              typeof getPos !==
              "function"
            ) {
              return;
            }

            const pos =
              getPos();

            if (pos == null) {
              return;
            }

            editor
              .chain()
              .focus()
              .setNodeSelection(
                pos
              )
              .run();
          }}
        />

        {isSelected && (
          <button
            type="button"
            onClick={deleteImage}
            className="
              absolute
              top-2
              right-2
              z-50
              bg-red-600
              text-white
              rounded-full
              w-8
              h-8
              flex
              items-center
              justify-center
              font-bold
              hover:bg-red-700
            "
          >
            ✕
          </button>
        )}
      </div>
    </NodeViewWrapper>
  );
};