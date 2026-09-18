import { NodeViewWrapper } from "@tiptap/react";
import { NodeViewProps } from "@tiptap/react";
import axios from "axios";
import toast from "react-hot-toast";

export const ImageComponent: React.FC<NodeViewProps> = ({
  node,
  editor,
  getPos,
}) => {
  const imageUrl = node.attrs.src;
  

  const imageId = node.attrs.imageId;

console.log("========== IMAGE DEBUG ==========");
console.log("FULL NODE:", node);
console.log("IMAGE SRC:", imageUrl);
console.log("IMAGE ID:", imageId);
console.log("=================================");
  const isSelected = editor.isActive("image");

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!imageId) {
      toast.error("Image ID not found");
      return;
    }

    try {
      await axios.delete(
        `${process.env.apiUrl}/api/delete-blog-image/${imageId}`,
        {
          withCredentials: true,
        }
      );

      if (typeof getPos === "function") {
        const pos = getPos();

        if (pos == null) return;

        editor
          .chain()
          .focus()
          .deleteRange({
            from: pos,
            to: pos + node.nodeSize,
          })
          .run();
      }

      toast.success("Image deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <NodeViewWrapper className="relative inline-block group">
      <img
        src={imageUrl}
        contentEditable={false}
        style={{
          width: node.attrs.width || "300px",
        }}
        onClick={(e) => {
          e.stopPropagation();

          if (typeof getPos !== "function") return;

          const pos = getPos();

          if (pos == null) return;

          editor
            .chain()
            .focus()
            .setNodeSelection(pos)
            .run();
        }}
      />

      {isSelected && (
        <button
          type="button"
          className="absolute top-1 right-1 z-50 bg-red-500 text-white px-2 py-1 rounded"
          onClick={handleDelete}
        >
          ✕
        </button>
      )}
    </NodeViewWrapper>
  );
};