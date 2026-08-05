import imageCompression from "browser-image-compression";

export const compressAndConvertToBase64 = async (
  file: File
): Promise<string> => {
  const options = {
 maxSizeMB: 0.15,
  maxWidthOrHeight: 800,
  useWebWorker: true,
  };

  const compressedFile = await imageCompression(file, options);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(compressedFile);

    reader.onload = () => resolve(reader.result as string);

    reader.onerror = (error) => reject(error);
  });
};