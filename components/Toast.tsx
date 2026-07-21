
import { Toaster } from "react-hot-toast";

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // default (info / normal)
        duration: 3500,
        style: {
          background: "#111827",   // very dark blue‑gray
          color: "#F9FAFB",        // almost white
          borderRadius: "10px",
          boxShadow: "0 8px 20px rgba(15,23,42,0.45)",
        },

        // success (green but soft, not neon)
        success: {
          duration: 3000,
          style: {
            background: "#065F46", // emerald‑dark green
            color: "#ECFDF5",
          },
          iconTheme: {
            primary: "#34D399",
            secondary: "#064E3B",
          },
        },

        // error (match red in your UI but a bit darker)
        error: {
          duration: 3500,
          style: {
            background: "#B91C1C", // deep red
            color: "#FEF2F2",
          },
          iconTheme: {
            primary: "#F97373",
            secondary: "#7F1D1D",
          },
        },
      }}
    />
  );
}
