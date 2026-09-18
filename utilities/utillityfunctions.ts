import axios from "axios";


async function getFileHash(file:File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

//  const uploadphoto = async (userId: string, photo:File, folderName, fileNAme) => {
//     try {
//       if (photo instanceof File) {
//         const file = photo;

//         console.log("uploading photo...........");

//         const userformData = new FormData();
//         userformData.append("file", file);
//         userformData.append("fileName", fileName);
//         userformData.append("folderName", folderName);

//         // 1️⃣ Get presigned URL
//         const res = await axios.post(
//           process.env.apiUrl + "/api/upload-file",
//           userformData,
//           { withCredentials: true }
//         );

//         console.log(res?.data, "presigned");

//         const { uploadUrl, key } = res.data;

        
//         // 2️⃣ upload to R2
//         const uploadResult = await axios.put(uploadUrl, file, {
//           withCredentials: false,
//           headers: {
//             "Content-Type":
//               file.type || "application/octet-stream",
//           },
//         });

//         return { key }; // return stored file key
//       }
//     } catch (error) {
//       console.error("Photo upload failed:", error);
//     }
//   };

export const getTimeAgoShort = (date:string | Date) => {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);

  if (isNaN(past.getTime())) return "";

  let diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 0) return "just now"; // ✅ important fix

  if (diff < 120) return "just now";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(diff / 3600);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d`;

  const months = Math.floor(diff / 2592000);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(diff / 31536000);
  return `${years}y`;
};


// export function cleanTiptapJSON(node:any) {
//   if (!node) return null;

//   // ❌ Remove empty text nodes
//   if (node.type === "text") {    
//     return node;
//   }

//   // ✅ Recursively clean content
//   if (node.content) {
//     const cleanedContent = node.content
//       .map(cleanTiptapJSON)
//       .filter(Boolean);

//     return {
//       ...node,
//       content: cleanedContent,
//     };
//   }

//   return node;
// }

export function cleanTiptapJSON(node: any): any {
  if (!node) return null;

  // Remove only truly empty text nodes
  if (node.type === "text") {
    if (node.text === "") {
      return null;
    }
    return node;
  }

  // Recursively clean content
  if (Array.isArray(node.content)) {
    const cleanedContent = node.content
      .map(cleanTiptapJSON)
      .filter(Boolean);

    return {
      ...node,
      content: cleanedContent,
    };
  }

  return node;
}

export const compressImage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<File> => {
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        reject(new Error("Failed to read image"));
      };

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        const scale = Math.min(1, maxWidth / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            resolve(
              new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
            );
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Invalid image"));
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error("Image compression failed:", error);

    // Fallback to original file
    return file;
  }
};

// export function workingDays() {

// const holidays = [
//   "2026-01-26",
//   "2026-03-14",
//   "2026-08-15",
//   "2026-10-02",
//   "2026-12-25"
// ];

// const year = 2026;

// let current = DateTime.local(year).startOf("year");

// const end = DateTime.local(year).endOf("year");

// let workingDays = 0;

// while (current <= end) {

//   const isSunday = current.weekday === 7;

//   const isHoliday = holidays.includes(
//     current.toISODate()!
//   );

//   if (!isSunday && !isHoliday) {
//     workingDays++;
//   }

//   current = current.plus({ days: 1 });
// }

// console.log("Working Days:", workingDays);
// }

// export const getTimeAgoShort = (date: string | Date) => {
//   console.log(date, "date in getTimeAgoShort");
//     if (!date) return "";
//  const now = new Date();
//   const past = new Date(date);
//   if (isNaN(past.getTime())) {
//     console.log("Invalid date:", date);
//     return "";
//   }
 

//   const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

//   if (diff < 120) return "just now";

//   const minutes = Math.floor(diff / 60);
//   if (minutes < 60) return `${minutes}m`;

//   const hours = Math.floor(diff / 3600);
//   if (hours < 24) return `${hours}h`;

//   const days = Math.floor(diff / 86400);
//   if (days < 30) return `${days}d`;

//   const months = Math.floor(diff / 2592000); // 30 days
//   if (months < 12) return `${months}mo`;

//   const years = Math.floor(diff / 31536000);
//   return `${years}y`;
// };