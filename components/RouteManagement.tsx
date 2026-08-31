// "use client";

// import { useState } from "react";
// import { Plus, Trash2, Route, Upload, Save } from "lucide-react";

// const API_BASE_URL = "http://localhost:8000/api";

// type RouteForm = {
//   fromCity: string;
//   toCity: string;
//   distance: string;
//   duration: string;
// };

// const emptyRoute: RouteForm = {
//   fromCity: "",
//   toCity: "",
//   distance: "",
//   duration: "",
// };

// export default function RouteManagement() {
//   const [mode, setMode] = useState<"single" | "bulk">("single");

//   const [singleRoute, setSingleRoute] =
//     useState<RouteForm>(emptyRoute);

//   const [bulkRoutes, setBulkRoutes] = useState<RouteForm[]>([
//     { ...emptyRoute },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =========================
//   // SINGLE INPUT CHANGE
//   // =========================

//   const handleSingleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     setSingleRoute((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // =========================
//   // BULK INPUT CHANGE
//   // =========================

//   const handleBulkChange = (
//     index: number,
//     field: keyof RouteForm,
//     value: string
//   ) => {
//     setBulkRoutes((prev) =>
//       prev.map((route, i) =>
//         i === index
//           ? {
//               ...route,
//               [field]: value,
//             }
//           : route
//       )
//     );
//   };

//   // =========================
//   // ADD BULK ROW
//   // =========================

//   const addRouteRow = () => {
//     setBulkRoutes((prev) => [
//       ...prev,
//       { ...emptyRoute },
//     ]);
//   };

//   // =========================
//   // REMOVE BULK ROW
//   // =========================

//   const removeRouteRow = (index: number) => {
//     setBulkRoutes((prev) =>
//       prev.filter((_, i) => i !== index)
//     );
//   };

//   // =========================
//   // CREATE SINGLE ROUTE
//   // =========================

//   const createSingleRoute = async () => {
//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       if (
//         !singleRoute.fromCity ||
//         !singleRoute.toCity ||
//         !singleRoute.distance ||
//         !singleRoute.duration
//       ) {
//         setError("Please fill all fields");
//         return;
//       }

//       const response = await fetch(
//         `${API_BASE_URL}/routes-new`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             fromCity: singleRoute.fromCity,
//             toCity: singleRoute.toCity,
//             distance: Number(singleRoute.distance),
//             duration: singleRoute.duration,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Route creation failed"
//         );
//       }

//       setMessage("Route created successfully");

//       setSingleRoute({ ...emptyRoute });
//     } catch (err: any) {
//       setError(
//         err.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // CREATE BULK ROUTES
//   // =========================

//   const createBulkRoutes = async () => {
//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const invalidRoute = bulkRoutes.some(
//         (route) =>
//           !route.fromCity ||
//           !route.toCity ||
//           !route.distance ||
//           !route.duration
//       );

//       if (invalidRoute) {
//         setError(
//           "Please fill all fields for every route"
//         );
//         return;
//       }

//       const payload = {
//         routes: bulkRoutes.map((route) => ({
//           fromCity: route.fromCity,
//           toCity: route.toCity,
//           distance: Number(route.distance),
//           duration: route.duration,
//         })),
//       };

//       const response = await fetch(
//         `${API_BASE_URL}/routesbulkcreate-new`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Bulk route creation failed"
//         );
//       }

//       setMessage(
//         `${data.routes?.length || bulkRoutes.length} routes created successfully`
//       );

//       setBulkRoutes([{ ...emptyRoute }]);
//     } catch (err: any) {
//       setError(
//         err.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-7xl">

//         {/* ================= HEADER ================= */}

//         <div className="mb-6">
//           <div className="flex items-center gap-3">
//             <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold text-white">
//               <Route size={22} />
//             </div>

//             <div>
//               <h1 className="text-2xl font-bold text-slate-900">
//                 Route Management
//               </h1>

//               <p className="text-sm text-slate-500">
//                 Create and manage your travel routes
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* ================= TABS ================= */}

//         <div className="mb-6 flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
//           <button
//             onClick={() => {
//               setMode("single");
//               setMessage("");
//               setError("");
//             }}
//             className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
//               mode === "single"
//                 ? "bg-slate-900 text-white"
//                 : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             Create Single Route
//           </button>

//           <button
//             onClick={() => {
//               setMode("bulk");
//               setMessage("");
//               setError("");
//             }}
//             className={`flex-1 rounded-lg px-4 py-3 text-sm font-semibold transition ${
//               mode === "bulk"
//                 ? "bg-slate-900 text-white"
//                 : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             Bulk Create Routes
//           </button>
//         </div>

//         {/* ================= MESSAGE ================= */}

//         {message && (
//           <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//             ✓ {message}
//           </div>
//         )}

//         {error && (
//           <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             ✕ {error}
//           </div>
//         )}

//         {/* ================= SINGLE ROUTE ================= */}

//         {mode === "single" && (
//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">

//             <div className="mb-6">
//               <h2 className="text-lg font-bold text-slate-900">
//                 Create New Route
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Add one route with distance and travel duration.
//               </p>
//             </div>

//             <div className="grid gap-5 md:grid-cols-2">

//               {/* FROM */}

//               <Input
//                 label="From City"
//                 name="fromCity"
//                 placeholder="e.g. Sultanpur"
//                 value={singleRoute.fromCity}
//                 onChange={handleSingleChange}
//               />

//               {/* TO */}

//               <Input
//                 label="To City"
//                 name="toCity"
//                 placeholder="e.g. Delhi"
//                 value={singleRoute.toCity}
//                 onChange={handleSingleChange}
//               />

//               {/* DISTANCE */}

//               <Input
//                 label="Distance (KM)"
//                 name="distance"
//                 type="number"
//                 placeholder="e.g. 140"
//                 value={singleRoute.distance}
//                 onChange={handleSingleChange}
//               />

//               {/* DURATION */}

//               <Input
//                 label="Duration"
//                 name="duration"
//                 placeholder="e.g. 3 hours 30 minutes"
//                 value={singleRoute.duration}
//                 onChange={handleSingleChange}
//               />

//             </div>

//             <div className="mt-7 flex justify-end">
//               <button
//                 onClick={createSingleRoute}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <Save size={17} />

//                 {loading
//                   ? "Creating..."
//                   : "Create Route"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ================= BULK ROUTES ================= */}

//         {mode === "bulk" && (
//           <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

//             {/* BULK HEADER */}

//             <div className="border-b border-slate-200 p-5 sm:p-7">
//               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

//                 <div>
//                   <h2 className="text-lg font-bold text-slate-900">
//                     Bulk Create Routes
//                   </h2>

//                   <p className="mt-1 text-sm text-slate-500">
//                     Add multiple routes and create them together.
//                   </p>
//                 </div>

//                 <button
//                   onClick={addRouteRow}
//                   className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
//                 >
//                   <Plus size={17} />
//                   Add Route
//                 </button>

//               </div>
//             </div>

//             {/* ROUTE ROWS */}

//             <div className="space-y-4 p-5 sm:p-7">

//               {bulkRoutes.map((route, index) => (
//                 <div
//                   key={index}
//                   className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
//                 >

//                   <div className="mb-4 flex items-center justify-between">
//                     <p className="text-sm font-bold text-slate-900">
//                       Route #{index + 1}
//                     </p>

//                     {bulkRoutes.length > 1 && (
//                       <button
//                         onClick={() =>
//                           removeRouteRow(index)
//                         }
//                         className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
//                       >
//                         <Trash2 size={14} />
//                         Remove
//                       </button>
//                     )}
//                   </div>

//                   <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

//                     {/* FROM */}

//                     <Input
//                       label="From City"
//                       placeholder="Sultanpur"
//                       value={route.fromCity}
//                       onChange={(e) =>
//                         handleBulkChange(
//                           index,
//                           "fromCity",
//                           e.target.value
//                         )
//                       }
//                     />

//                     {/* TO */}

//                     <Input
//                       label="To City"
//                       placeholder="Delhi"
//                       value={route.toCity}
//                       onChange={(e) =>
//                         handleBulkChange(
//                           index,
//                           "toCity",
//                           e.target.value
//                         )
//                       }
//                     />

//                     {/* DISTANCE */}

//                     <Input
//                       label="Distance (KM)"
//                       type="number"
//                       placeholder="140"
//                       value={route.distance}
//                       onChange={(e) =>
//                         handleBulkChange(
//                           index,
//                           "distance",
//                           e.target.value
//                         )
//                       }
//                     />

//                     {/* DURATION */}

//                     <Input
//                       label="Duration"
//                       placeholder="3 hours 30 minutes"
//                       value={route.duration}
//                       onChange={(e) =>
//                         handleBulkChange(
//                           index,
//                           "duration",
//                           e.target.value
//                         )
//                       }
//                     />

//                   </div>
//                 </div>
//               ))}

//             </div>

//             {/* BULK FOOTER */}

//             <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-5 sm:flex-row sm:p-7">

//               <p className="text-sm text-slate-500">
//                 Total routes:{" "}
//                 <span className="font-bold text-slate-900">
//                   {bulkRoutes.length}
//                 </span>
//               </p>

//               <button
//                 onClick={createBulkRoutes}
//                 disabled={loading}
//                 className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
//               >
//                 <Upload size={17} />

//                 {loading
//                   ? "Creating Routes..."
//                   : `Create ${bulkRoutes.length} Routes`}
//               </button>

//             </div>

//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// /* =====================================================
//    INPUT COMPONENT
// ===================================================== */

// function Input({
//   label,
//   name,
//   type = "text",
//   placeholder,
//   value,
//   onChange,
// }: {
//   label: string;
//   name?: string;
//   type?: string;
//   placeholder?: string;
//   value: string;
//   onChange: (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => void;
// }) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
//         {label}
//       </label>

//       <input
//         name={name}
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-gold focus:ring-2 focus:ring-gold/10"
//       />
//     </div>
//   );
// }


// "use client";

// import { useState } from "react";
// import * as XLSX from "xlsx";

// type RouteRow = {
//   fromCity: string;
//   toCity: string;
//   distance: number;
//   duration: string;
// };

// const API_BASE_URL = "http://localhost:8000/api";

// export default function RouteManager() {
//   const [singleRoute, setSingleRoute] = useState<RouteRow>({
//     fromCity: "",
//     toCity: "",
//     distance: 0,
//     duration: "",
//   });

//   const [bulkRoutes, setBulkRoutes] = useState<RouteRow[]>([]);
//   const [fileName, setFileName] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   // =========================
//   // SINGLE ROUTE
//   // =========================

//   const handleSingleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const { name, value } = e.target;

//     setSingleRoute((prev) => ({
//       ...prev,
//       [name]:
//         name === "distance"
//           ? Number(value)
//           : value,
//     }));
//   };

//   const createSingleRoute = async (
//     e: React.FormEvent
//   ) => {
//     e.preventDefault();

//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/routes-new`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(singleRoute),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Route create failed"
//         );
//       }

//       setMessage("Route created successfully.");

//       setSingleRoute({
//         fromCity: "",
//         toCity: "",
//         distance: 0,
//         duration: "",
//       });
//     } catch (err: any) {
//       setError(
//         err.message || "Something went wrong"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // FILE UPLOAD
//   // =========================

//   const handleFileUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const file = e.target.files?.[0];

//     if (!file) return;

//     setFileName(file.name);
//     setMessage("");
//     setError("");

//     try {
//       const buffer = await file.arrayBuffer();

//       const workbook = XLSX.read(buffer, {
//         type: "array",
//       });

//       const sheetName =
//         workbook.SheetNames[0];

//       const worksheet =
//         workbook.Sheets[sheetName];

//       const rows = XLSX.utils.sheet_to_json<any>(
//         worksheet,
//         {
//           defval: "",
//         }
//       );

//       const formattedRoutes: RouteRow[] =
//         rows
//           .map((row) => ({
//             fromCity: String(
//               row.fromCity ??
//                 row.FromCity ??
//                 row["From City"] ??
//                 ""
//             ).trim(),

//             toCity: String(
//               row.toCity ??
//                 row.ToCity ??
//                 row["To City"] ??
//                 ""
//             ).trim(),

//             distance: Number(
//               row.distance ??
//                 row.Distance ??
//                 0
//             ),

//             duration: String(
//               row.duration ??
//                 row.Duration ??
//                 ""
//             ).trim(),
//           }))
//           .filter(
//             (route) =>
//               route.fromCity &&
//               route.toCity &&
//               route.distance > 0 &&
//               route.duration
//           );

//       if (!formattedRoutes.length) {
//         throw new Error(
//           "File me valid route data nahi mila."
//         );
//       }

//       setBulkRoutes(formattedRoutes);

//       setMessage(
//         `${formattedRoutes.length} routes file se read ho gaye.`
//       );
//     } catch (err: any) {
//       setBulkRoutes([]);

//       setError(
//         err.message ||
//           "File read nahi ho payi."
//       );
//     }

//     // Same file dobara select kar sake
//     e.target.value = "";
//   };

//   // =========================
//   // BULK API
//   // =========================

//   const createBulkRoutes = async () => {
//     if (!bulkRoutes.length) {
//       setError("Pehle routes add karo.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");
//     setError("");

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/routesbulkcreate-new`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             routes: bulkRoutes,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message ||
//             "Bulk route creation failed"
//         );
//       }

//       setMessage(
//         data.message ||
//           "Routes created successfully."
//       );

//       setBulkRoutes([]);
//       setFileName("");
//     } catch (err: any) {
//       setError(
//         err.message ||
//           "Bulk create failed."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // MANUAL BULK ROW
//   // =========================

//   const addManualRow = () => {
//     setBulkRoutes((prev) => [
//       ...prev,
//       {
//         fromCity: "",
//         toCity: "",
//         distance: 0,
//         duration: "",
//       },
//     ]);
//   };

//   const updateBulkRow = (
//     index: number,
//     field: keyof RouteRow,
//     value: string
//   ) => {
//     setBulkRoutes((prev) =>
//       prev.map((route, i) =>
//         i === index
//           ? {
//               ...route,
//               [field]:
//                 field === "distance"
//                   ? Number(value)
//                   : value,
//             }
//           : route
//       )
//     );
//   };

//   const removeBulkRow = (index: number) => {
//     setBulkRoutes((prev) =>
//       prev.filter((_, i) => i !== index)
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
//       <div className="mx-auto max-w-7xl">

//         {/* HEADER */}

//         <div className="mb-8">
//           <p className="text-sm font-semibold uppercase tracking-widest text-gold">
//             Route Management
//           </p>

//           <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
//             Manage Routes
//           </h1>

//           <p className="mt-2 text-sm text-slate-500">
//             Single route ya multiple routes ek saath
//             create karein.
//           </p>
//         </div>

//         {/* MESSAGE */}

//         {message && (
//           <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
//             {message}
//           </div>
//         )}

//         {error && (
//           <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//             {error}
//           </div>
//         )}

//         <div className="grid gap-6 lg:grid-cols-2">

//           {/* ========================= */}
//           {/* SINGLE ROUTE */}
//           {/* ========================= */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

//             <div className="mb-6">
//               <h2 className="text-xl font-bold text-slate-900">
//                 Create Single Route
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 Ek route manually create karein.
//               </p>
//             </div>

//             <form
//               onSubmit={createSingleRoute}
//               className="space-y-4"
//             >

//               {/* FROM */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                   From City
//                 </label>

//                 <input
//                   name="fromCity"
//                   value={singleRoute.fromCity}
//                   onChange={handleSingleChange}
//                   placeholder="e.g. Sultanpur"
//                   required
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold"
//                 />
//               </div>

//               {/* TO */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                   To City
//                 </label>

//                 <input
//                   name="toCity"
//                   value={singleRoute.toCity}
//                   onChange={handleSingleChange}
//                   placeholder="e.g. Delhi"
//                   required
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold"
//                 />
//               </div>

//               {/* DISTANCE */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                   Distance (KM)
//                 </label>

//                 <input
//                   type="number"
//                   name="distance"
//                   value={
//                     singleRoute.distance || ""
//                   }
//                   onChange={handleSingleChange}
//                   placeholder="e.g. 140"
//                   required
//                   min="1"
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold"
//                 />
//               </div>

//               {/* DURATION */}

//               <div>
//                 <label className="mb-1.5 block text-sm font-semibold text-slate-700">
//                   Duration
//                 </label>

//                 <input
//                   name="duration"
//                   value={singleRoute.duration}
//                   onChange={handleSingleChange}
//                   placeholder="e.g. 3 hours 30 minutes"
//                   required
//                   className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-gold"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-gold disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 {loading
//                   ? "Creating..."
//                   : "Create Route"}
//               </button>

//             </form>
//           </div>

//           {/* ========================= */}
//           {/* BULK ROUTE */}
//           {/* ========================= */}

//           <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

//             <div className="mb-6">
//               <h2 className="text-xl font-bold text-slate-900">
//                 Bulk Route Creation
//               </h2>

//               <p className="mt-1 text-sm text-slate-500">
//                 CSV, XLS/XLSX ya manually multiple
//                 routes add karein.
//               </p>
//             </div>

//             {/* FILE UPLOAD */}

//             <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center transition hover:border-gold">

//               <div className="mb-3 text-3xl">
//                 📁
//               </div>

//               <p className="text-sm font-bold text-slate-800">
//                 Upload CSV / Excel
//               </p>

//               <p className="mt-1 text-xs text-slate-500">
//                 .csv, .xls, .xlsx
//               </p>

//               <input
//                 type="file"
//                 accept=".csv,.xls,.xlsx"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//             </label>

//             {fileName && (
//               <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
//                 📄 {fileName}
//               </div>
//             )}

//             {/* MANUAL ADD */}

//             <button
//               type="button"
//               onClick={addManualRow}
//               className="mt-4 w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-gold hover:text-gold"
//             >
//               + Add Route Manually
//             </button>

//           </div>
//         </div>

//         {/* ========================= */}
//         {/* PREVIEW */}
//         {/* ========================= */}

//         {bulkRoutes.length > 0 && (
//           <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

//             <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

//               <div>
//                 <h2 className="text-xl font-bold text-slate-900">
//                   Route Preview
//                 </h2>

//                 <p className="mt-1 text-sm text-slate-500">
//                   {bulkRoutes.length} routes ready
//                   to create
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 onClick={createBulkRoutes}
//                 disabled={loading}
//                 className="rounded-xl bg-gold px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
//               >
//                 {loading
//                   ? "Creating Routes..."
//                   : `Create ${bulkRoutes.length} Routes`}
//               </button>

//             </div>

//             {/* TABLE */}

//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[750px] text-left text-sm">

//                 <thead className="bg-slate-900 text-white">
//                   <tr>
//                     <th className="px-4 py-3">
//                       #
//                     </th>

//                     <th className="px-4 py-3">
//                       From City
//                     </th>

//                     <th className="px-4 py-3">
//                       To City
//                     </th>

//                     <th className="px-4 py-3">
//                       Distance
//                     </th>

//                     <th className="px-4 py-3">
//                       Duration
//                     </th>

//                     <th className="px-4 py-3">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">

//                   {bulkRoutes.map(
//                     (route, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-slate-50"
//                       >

//                         <td className="px-4 py-3 font-semibold text-slate-500">
//                           {index + 1}
//                         </td>

//                         <td className="px-4 py-3">
//                           <input
//                             value={
//                               route.fromCity
//                             }
//                             onChange={(e) =>
//                               updateBulkRow(
//                                 index,
//                                 "fromCity",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-gold"
//                           />
//                         </td>

//                         <td className="px-4 py-3">
//                           <input
//                             value={
//                               route.toCity
//                             }
//                             onChange={(e) =>
//                               updateBulkRow(
//                                 index,
//                                 "toCity",
//                                 e.target.value
//                               )
//                             }
//                             className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-gold"
//                           />
//                         </td>

//                         <td className="px-4 py-3">
//                           <input
//                             type="number"
//                             value={
//                               route.distance ||
//                               ""
//                             }
//                             onChange={(e) =>
//                               updateBulkRow(
//                                 index,
//                                 "distance",
//                                 e.target.value
//                               )
//                             }
//                             className="w-28 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-gold"
//                           />
//                         </td>

//                         <td className="px-4 py-3">
//                           <input
//                             value={
//                               route.duration
//                             }
//                             onChange={(e) =>
//                               updateBulkRow(
//                                 index,
//                                 "duration",
//                                 e.target.value
//                               )
//                             }
//                             className="w-48 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-gold"
//                           />
//                         </td>

//                         <td className="px-4 py-3">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               removeBulkRow(
//                                 index
//                               )
//                             }
//                             className="rounded-lg px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50"
//                           >
//                             Remove
//                           </button>
//                         </td>

//                       </tr>
//                     )
//                   )}

//                 </tbody>
//               </table>
//             </div>

//           </div>
//         )}

//         {/* ========================= */}
//         {/* FILE FORMAT */}
//         {/* ========================= */}

//         <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">

//           <h3 className="font-bold text-slate-900">
//             Excel / CSV format
//           </h3>

//           <p className="mt-2 text-sm text-slate-600">
//             File ki first row me ye columns hone chahiye:
//           </p>

//           <div className="mt-3 overflow-x-auto">
//             <table className="min-w-[600px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-blue-200">
//                   <th className="px-3 py-2">
//                     fromCity
//                   </th>
//                   <th className="px-3 py-2">
//                     toCity
//                   </th>
//                   <th className="px-3 py-2">
//                     distance
//                   </th>
//                   <th className="px-3 py-2">
//                     duration
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 <tr>
//                   <td className="px-3 py-2">
//                     Sultanpur
//                   </td>
//                   <td className="px-3 py-2">
//                     Delhi
//                   </td>
//                   <td className="px-3 py-2">
//                     140
//                   </td>
//                   <td className="px-3 py-2">
//                     3 hours 30 minutes
//                   </td>
//                 </tr>

//                 <tr>
//                   <td className="px-3 py-2">
//                     Sultanpur
//                   </td>
//                   <td className="px-3 py-2">
//                     Lucknow
//                   </td>
//                   <td className="px-3 py-2">
//                     140
//                   </td>
//                   <td className="px-3 py-2">
//                     3 hours
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }


"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";

const API_URL = "http://localhost:8000/api";

type RouteForm = {
  fromCity: string;
  toCity: string;
  distance: string;
  duration: string;
};

const emptyRoute: RouteForm = {
  fromCity: "",
  toCity: "",
  distance: "",
  duration: "",
};

export default function RouteManager() {
  const [routes, setRoutes] = useState<RouteForm[]>([{ ...emptyRoute }]);
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // MANUAL INPUT CHANGE
  // ==========================================

  const handleChange = (
    index: number,
    field: keyof RouteForm,
    value: string
  ) => {
    setRoutes((prev) =>
      prev.map((route, i) =>
        i === index
          ? {
              ...route,
              [field]: value,
            }
          : route
      )
    );
  };

  // ==========================================
  // ADD NEW MANUAL ROUTE
  // ==========================================

  const addRouteRow = () => {
    setRoutes((prev) => [...prev, { ...emptyRoute }]);
  };

  // ==========================================
  // REMOVE ROUTE ROW
  // ==========================================

  const removeRouteRow = (index: number) => {
    setRoutes((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================================
  // UPLOAD ALL MANUAL ROUTES
  // ==========================================

  const uploadManualRoutes = async () => {
    setMessage("");
    setError("");

    if (routes.length === 0) {
      setError("Please add at least one route.");
      return;
    }

    // Validate
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      if (
        !route.fromCity.trim() ||
        !route.toCity.trim() ||
        !route.distance.trim() ||
        !route.duration.trim()
      ) {
        setError(`Please fill all fields in Route ${i + 1}.`);
        return;
      }

      if (Number(route.distance) <= 0) {
        setError(`Distance must be greater than 0 in Route ${i + 1}.`);
        return;
      }
    }

    try {
      setLoading(true);

      const payload = {
        routes: routes.map((route) => ({
          fromCity: route.fromCity.trim(),
          toCity: route.toCity.trim(),
          distance: Number(route.distance),
          duration: route.duration.trim(),
        })),
      };

      const response = await fetch(`${process.env.apiUrl}/api/routesbulkcreate-new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload routes");
      }

      setMessage(
        data.message || `${routes.length} routes uploaded successfully`
      );

      // Reset after successful upload
      setRoutes([{ ...emptyRoute }]);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CSV / XLSX FILE UPLOAD
  // ==========================================

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");
    setError("");
    setFileLoading(true);

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        throw new Error("No sheet found in file.");
      }

      const sheet = workbook.Sheets[sheetName];

      const rows = XLSX.utils.sheet_to_json<any>(sheet, {
        defval: "",
      });

      if (!rows.length) {
        throw new Error("File is empty.");
      }

      const formattedRoutes: RouteForm[] = rows.map((row) => ({
        fromCity: String(
          row.fromCity ?? row.FromCity ?? row["From City"] ?? ""
        ).trim(),

        toCity: String(
          row.toCity ?? row.ToCity ?? row["To City"] ?? ""
        ).trim(),

        distance: String(
          row.distance ?? row.Distance ?? ""
        ).trim(),

        duration: String(
          row.duration ?? row.Duration ?? ""
        ).trim(),
      }));

      // Validate file data
      const invalidIndex = formattedRoutes.findIndex(
        (route) =>
          !route.fromCity ||
          !route.toCity ||
          !route.distance ||
          !route.duration
      );

      if (invalidIndex !== -1) {
        throw new Error(
          `Invalid data in row ${invalidIndex + 2}. Required columns: fromCity, toCity, distance, duration`
        );
      }

      // File data ko manual list me daal do
      setRoutes(formattedRoutes);

      setMessage(
        `${formattedRoutes.length} routes loaded from ${file.name}. Click "Upload All Routes" to save them.`
      );
    } catch (err: any) {
      setError(err.message || "Failed to read file.");
    } finally {
      setFileLoading(false);

      // Same file dobara select kar sake
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ==========================================
  // SINGLE ROUTE CREATE
  // ==========================================

  const createSingleRoute = async () => {
    setMessage("");
    setError("");

    const route = routes[0];

    if (
      !route.fromCity.trim() ||
      !route.toCity.trim() ||
      !route.distance.trim() ||
      !route.duration.trim()
    ) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.apiUrl}/api/create-routes-new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromCity: route.fromCity.trim(),
          toCity: route.toCity.trim(),
          distance: Number(route.distance),
          duration: route.duration.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create route");
      }

      setMessage(data.message || "Route created successfully.");

      setRoutes([{ ...emptyRoute }]);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black sm:text-3xl">
            Route Management
          </h1>

          <p className="mt-2 text-sm text-black">
            Create single routes, add multiple routes manually, or upload
            routes using CSV / Excel.
          </p>
        </div>

        {/* ==========================================
            SUCCESS / ERROR
        ========================================== */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </div>
        )}

        {/* ==========================================
            FILE UPLOAD
        ========================================== */}

        <div className="mb-8 rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-black">
              Upload Routes from CSV / Excel
            </h2>

            <p className="mt-1 text-sm text-black">
              Upload CSV, XLS or XLSX file. The file will be read directly in
              the browser.
            </p>
          </div>

          <div
            className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-400 bg-slate-50 p-8 text-center transition hover:border-slate-600 hover:bg-slate-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              onChange={handleFileUpload}
            />

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-xl text-white">
              ↑
            </div>

            <p className="font-semibold text-black">
              {fileLoading
                ? "Reading file..."
                : "Click to upload CSV / Excel"}
            </p>

            <p className="mt-1 text-xs text-black">
              Supported: CSV, XLS, XLSX
            </p>
          </div>

          <div className="mt-5 rounded-xl bg-slate-100 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-black">
              Required columns
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {["fromCity", "toCity", "distance", "duration"].map(
                (column) => (
                  <span
                    key={column}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-black"
                  >
                    {column}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            MANUAL ROUTES
        ========================================== */}

        <div className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">

          {/* Header */}

          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-black">
                Add Routes Manually
              </h2>

              <p className="mt-1 text-sm text-black">
                Add as many routes as you want and upload them together.
              </p>
            </div>

            <button
              type="button"
              onClick={addRouteRow}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              + Add Route
            </button>
          </div>

          {/* Route rows */}

          <div className="space-y-5">
            {routes.map((route, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-300 bg-slate-50 p-4 sm:p-5"
              >
                {/* Row Header */}

                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-black">
                    Route {index + 1}
                  </h3>

                  {routes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRouteRow(index)}
                      className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Inputs */}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                  {/* From */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-black">
                      From City
                    </label>

                    <input
                      type="text"
                      value={route.fromCity}
                      onChange={(e) =>
                        handleChange(index, "fromCity", e.target.value)
                      }
                      placeholder="e.g. Noida"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-black outline-none placeholder:text-black focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* To */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-black">
                      To City
                    </label>

                    <input
                      type="text"
                      value={route.toCity}
                      onChange={(e) =>
                        handleChange(index, "toCity", e.target.value)
                      }
                      placeholder="e.g. Delhi"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-black outline-none placeholder:text-black focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* Distance */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-black">
                      Distance (KM)
                    </label>

                    <input
                      type="number"
                      value={route.distance}
                      onChange={(e) =>
                        handleChange(index, "distance", e.target.value)
                      }
                      placeholder="e.g. 200"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-black outline-none placeholder:text-black focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* Duration */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-black">
                      Duration
                    </label>

                    <input
                      type="text"
                      value={route.duration}
                      onChange={(e) =>
                        handleChange(index, "duration", e.target.value)
                      }
                      placeholder="e.g. 4 hours"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-black outline-none placeholder:text-black focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ==========================================
              BOTTOM ACTIONS
          ========================================== */}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={createSingleRoute}
              disabled={loading || routes.length !== 1}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create Single Route
            </button>

            <button
              type="button"
              onClick={uploadManualRoutes}
              disabled={loading}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : `Upload All Routes (${routes.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}