"use client";

import { useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CityDropdown from "@/components/CityDropdown";
import { compressAndConvertToBase64 } from "@/util/utility";



interface Itinerary {
  day: number;
  title: string;
  activities: string[];
}
const inclusionList = [
  "Hotel Stay",

  "Breakfast",

  "Lunch",

  "Dinner",

  "Pickup",

  "Drop",

  "Sightseeing",

  "Fuel Charges",

  "Driver Allowance",

  "Parking",

  "Toll Tax",

  "Guide",

  "VIP Darshan",

  "Welcome Drink",
];

const exclusionList = [
  "Flight Ticket",
  "Train Ticket",
  "Entry Ticket",
  "Personal Expenses",
  "Laundry",
  "Camera Charges",
  "GST",
  "Travel Insurance",
  "Extra Meals",
  "Anything Not Mentioned",
];
export default function AddPackage() {
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState<any>(null);

  const featuredImageRef = useRef<HTMLInputElement>(null);

  const galleryRef = useRef<HTMLInputElement>(null);
  // const [vehicleType, setVehicleType] = useState("");
  const [tag, setTag] = useState("");

  const [highlight, setHighlight] = useState("");
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [activity, setActivity] = useState("");
  const [formData, setFormData] = useState({
    city: "",
    cab_page_id: "",

    title: "",

    shortDescription: "",
    description: "",

    featuredImage: "",

    gallery: [] as string[],

    days: 0,

    nights: 0,

    startingPrice: "",


    tags: [] as string[],

    highlights: [] as string[],

    inclusions: [] as string[],

    exclusions: [] as string[],

    itinerary: [] as Itinerary[],

    isFeatured: false,

    isPopular: false,

    status: true,
  });

  const handleCityChange = (selectedCity: any) => {
    setCity(selectedCity);

    setFormData((prev) => ({
      ...prev,
      city: selectedCity.cityName,
      cab_page_id: selectedCity._id,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFeaturedImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.length) return;

    const base64 = await compressAndConvertToBase64(e.target.files[0]);

    setFormData((prev) => ({
      ...prev,
      featuredImage: base64,
    }));
  };
  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    const images = await Promise.all(
      files.map((file) => compressAndConvertToBase64(file)),
    );

    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...images],
    }));
  };
  // const addVehicle = () => {
  //   if (!vehicleType.trim()) {
  //     toast.error("Vehicle Type Required");

  //     return;
  //   }

  //   if (!vehiclePrice) {
  //     toast.error("Price Required");

  //     return;
  //   }

  //   setFormData((prev) => ({
  //     ...prev,

  //     vehiclePricing: [
  //       ...prev.vehiclePricing,

  //       {
  //         vehicleType,

  //         price: Number(vehiclePrice),
  //       },
  //     ],
  //   }));

  //   setVehicleType("");

  //   setVehiclePrice("");
  // };
  // const removeVehicle = (index: number) => {
  //   setFormData((prev) => ({
  //     ...prev,

  //     vehiclePricing: prev.vehiclePricing.filter((_, i) => i !== index),
  //   }));
  // };
  const addTag = () => {
    if (!tag.trim()) return;

    setFormData((prev) => ({
      ...prev,

      tags: [...prev.tags, tag.trim()],
    }));

    setTag("");
  };
  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,

      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };
  const addHighlight = () => {
    if (!highlight.trim()) return;

    setFormData((prev) => ({
      ...prev,

      highlights: [...prev.highlights, highlight.trim()],
    }));

    setHighlight("");
  };
  const removeHighlight = (index: number) => {
    setFormData((prev) => ({
      ...prev,

      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const toggleArrayValue = (
    field: "inclusions" | "exclusions",

    value: string,
  ) => {
    setFormData((prev) => {
      const exist = prev[field].includes(value);

      return {
        ...prev,

        [field]: exist
          ? prev[field].filter((v) => v !== value)
          : [...prev[field], value],
      };
    });
  };
  const handleDaysChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const value = Math.max(1, Number(e.target.value) || 1);

  setFormData((prev) => {
    const newItinerary: Itinerary[] = [];

    for (let i = 1; i <= value; i++) {
      const existingDay = prev.itinerary.find(
        (item) => item.day === i
      );

      newItinerary.push(
        existingDay || {
          day: i,
          title: "",
          activities: [],
        }
      );
    }

    return {
      ...prev,
      days: value,
      itinerary: newItinerary,
    };
  });
};
  const changeDayTitle = (index: number, value: string) => {
    const itinerary = [...formData.itinerary];

    itinerary[index].title = value;

    setFormData((prev) => ({
      ...prev,
      itinerary,
    }));
  };
  const addActivity = (dayIndex: number, value: string) => {
    if (!value.trim()) return;

    const itinerary = [...formData.itinerary];

    itinerary[dayIndex].activities.push(value);

    setFormData((prev) => ({
      ...prev,
      itinerary,
    }));
  };
  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const itinerary = [...formData.itinerary];

    itinerary[dayIndex].activities = itinerary[dayIndex].activities.filter(
      (_, i) => i !== activityIndex,
    );

    setFormData((prev) => ({
      ...prev,
      itinerary,
    }));
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // =========================
  // CITY
  // =========================

  if (!formData.cab_page_id) {
    toast.error("Please select a city.");
    return;
  }

  // =========================
  // TITLE
  // =========================

  if (!formData.title.trim()) {
    toast.error("Please enter package title.");
    return;
  }

  // =========================
  // SHORT DESCRIPTION
  // =========================

  if (!formData.shortDescription.trim()) {
    toast.error("Please enter short description.");
    return;
  }

  // =========================
  // DESCRIPTION
  // =========================

  if (!formData.description.trim()) {
    toast.error("Please enter package description.");
    return;
  }

  // =========================
  // DAYS
  // =========================

  if (!formData.days || formData.days < 1) {
    toast.error("Please enter valid days.");
    return;
  }

  // =========================
  // NIGHTS
  // =========================

  if (
    formData.nights < 0 ||
    isNaN(Number(formData.nights))
  ) {
    toast.error("Please enter valid nights.");
    return;
  }

  // =========================
  // STARTING PRICE
  // =========================

  if (
    formData.startingPrice === "" ||
    isNaN(Number(formData.startingPrice)) ||
    Number(formData.startingPrice) < 0
  ) {
    toast.error("Please enter valid starting price.");
    return;
  }

  // =========================
  // FEATURED IMAGE
  // =========================

  if (!formData.featuredImage) {
    toast.error("Please select featured image.");
    return;
  }

  // =========================
  // ITINERARY
  // =========================

  if (formData.itinerary.length !== formData.days) {
    toast.error(
      `Please add itinerary for all ${formData.days} days.`,
    );
    return;
  }

  for (const item of formData.itinerary) {
    // Day title
    if (!item.title.trim()) {
      toast.error(
        `Please enter title for Day ${item.day}.`,
      );
      return;
    }

    // Activities
    if (
      !item.activities ||
      item.activities.length === 0
    ) {
      toast.error(
        `Please add at least one activity for Day ${item.day}.`,
      );
      return;
    }

    // Empty activity
    const hasEmptyActivity = item.activities.some(
      (activity) => !activity.trim(),
    );

    if (hasEmptyActivity) {
      toast.error(
        `Please fill all activities for Day ${item.day}.`,
      );
      return;
    }
  }

 
  // =========================
  // SUBMIT API
  // =========================

  try {
    setLoading(true);

    const payload = {
      ...formData,

      // Convert values to numbers
      days: Number(formData.days),

      nights: Number(formData.nights),

      startingPrice: Number(
        formData.startingPrice,
      ),

      // Vehicle pricing
   
      // Clean arrays
      tags: formData.tags
        .map((item) => item.trim())
        .filter(Boolean),

      highlights: formData.highlights
        .map((item) => item.trim())
        .filter(Boolean),

      inclusions: formData.inclusions
        .map((item) => item.trim())
        .filter(Boolean),

      exclusions: formData.exclusions
        .map((item) => item.trim())
        .filter(Boolean),

      // Clean itinerary
      itinerary:
        formData.itinerary.map(
          (item) => ({
            day: Number(item.day),

            title: item.title.trim(),

            activities:
              item.activities
                .map((activity) =>
                  activity.trim(),
                )
                .filter(Boolean),
          }),
        ),
    };

    console.log(
      "PACKAGE PAYLOAD:",
      payload,
    );

    const response = await axios.post(
      `${process.env.apiUrl}/api/create-update-package`,
      payload,
      {
        withCredentials: true,
      },
    );
console.log(formData,"e")
    // =========================
    // SUCCESS
    // =========================

    if (response.data.success) {
      toast.success(
        response.data.message ||
          "Package created successfully.",
      );

      // =========================
      // RESET FORM
      // =========================

      setFormData({
        city: "",
        cab_page_id: "",

        title: "",
        shortDescription: "",
        description: "",

        featuredImage: "",
        gallery: [],

        days: 0,
        nights: 0,

        startingPrice: "",



        tags: [],
        highlights: [],

        inclusions: [],
        exclusions: [],

        itinerary: [],

        isFeatured: false,
        isPopular: false,

        status: true,
      });
// =========================
  // CLEAR FEATURED IMAGE INPUT
  // =========================

  if (featuredImageRef.current) {
    featuredImageRef.current.value = "";
  }

  // =========================
  // CLEAR GALLERY INPUT
  // =========================

  if (galleryRef.current) {
    galleryRef.current.value = "";
  }

      // City dropdown reset
      setCity(null);
    }
  } catch (error: any) {
    console.error(
      "Create Package Error:",
      error,
    );

    toast.error(
      error?.response?.data?.message ||
        "Something went wrong. Please try again.",
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="rounded-xl bg-white p-6 shadow text-black">
      <h2 className="mb-6 text-2xl font-bold">Add Package</h2>

      <form>
        <CityDropdown value={city} onChange={handleCityChange} />

        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <label className="mb-2 block font-medium">Package Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Package Title"
              className="w-full rounded-lg border border-stone-300 px-4 py-3"
            />
          </div>

          {/* <div>
            <label className="mb-2 block font-medium">Slug</label>

            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Slug"
              className="w-full rounded-lg border border-stone-300 px-4 py-3"
            />
          </div> */}
        </div>
        <div className="mt-5">
          <label className="mb-2 block font-medium">Short Description</label>

          <textarea
            rows={3}
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-3"
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-medium">Description</label>

          <textarea
            rows={6}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-lg border border-stone-300 px-4 py-3"
          />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-5">
          <div>
            <label className="mb-2 block">Days</label>

            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={(e)=>{handleChange(e);handleDaysChange(e)}}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block">Nights</label>

            <input
              type="number"
              name="nights"
              value={formData.nights}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block">Starting Price</label>

            <input
              type="number"
              name="startingPrice"
              value={formData.startingPrice}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>
        </div>
         <div className="mt-8">
          <label className="mb-2 block font-medium">Featured Image</label>

          <input type="file" accept="image/*" onChange={handleFeaturedImage} ref={featuredImageRef} />

          {formData.featuredImage && (
            <div className="relative mt-3 w-60">
              <img
                src={formData.featuredImage}
                className="h-40 w-full rounded-lg border object-cover"
              />

              <button
                type="button"
                className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-white"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,

                    featuredImage: "",
                  }));
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>
          <div className="mt-8">
          <label className="mb-2 block font-medium">Gallery Images</label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleGallery}
              ref={galleryRef}
          />

          <div className="mt-4 grid grid-cols-5 gap-3">
            {formData.gallery.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  className="h-28 w-full rounded border object-cover"
                />

                <button
                  type="button"
                  className="absolute right-1 top-1 rounded bg-red-600 px-2 py-1 text-white"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,

                      gallery: prev.gallery.filter((_, i) => i !== index),
                    }));
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
         <div className="mt-10 rounded-xl border p-6">
          <h2 className="mb-6 text-2xl font-bold">Day Wise Itinerary</h2>

          {formData.itinerary.map((day, index) => (
            <div key={day.day} className="mb-8 rounded-lg border p-5">
              <h3 className="mb-4 text-xl font-semibold">Day {day.day}</h3>

              <input
                type="text"
                placeholder="Day Title"
                value={day.title}
                onChange={(e) => changeDayTitle(index, e.target.value)}
                className="mb-4 w-full rounded-lg border px-4 py-3"
              />

              <div className="flex gap-3">
                <input
                  id={`activity-${index}`}
                  type="text"
                  placeholder="Add Activity"
                  className="flex-1 rounded-lg border px-4 py-3"
                />

                <button
                  type="button"
                  className="rounded-lg bg-blue-600 px-6 text-white"
                  onClick={() => {
                    const input = document.getElementById(
                      `activity-${index}`,
                    ) as HTMLInputElement;

                    addActivity(index, input.value);

                    input.value = "";
                  }}
                >
                  + Add
                </button>
              </div>

              {day.activities.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div
                      key={activityIndex}
                      className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2"
                    >
                      {activity}

                      <button
                        type="button"
                        onClick={() =>
                          removeActivity(
                            index,

                            activityIndex,
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
       
      
        {/* <div className="mt-10 rounded-xl border p-5">
          <h3 className="mb-5 text-xl font-semibold">Vehicle Pricing</h3>

          <div className="grid grid-cols-3 gap-5">
            <div>
              <label>Vehicle</label>

              <input
                type="text"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label>Price</label>

              <input
                type="number"
                value={vehiclePrice}
                onChange={(e) => setVehiclePrice(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={addVehicle}
                className="rounded-lg bg-blue-600 px-6 py-3 text-white"
              >
                + Add Vehicle
              </button>
            </div>
          </div>
          {formData.vehiclePricing.length > 0 && (
            <div className="mt-5 space-y-3">
              {formData.vehiclePricing.map((vehicle, index) => (
                <div
                  key={index}
                  className="relative flex items-center rounded-lg border p-4"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold">{vehicle.vehicleType}</h4>

                    <p>₹{vehicle.price}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeVehicle(index)}
                    className="rounded-full bg-red-600 px-2 py-1 text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div> */}
        <div className="mt-10 rounded-xl border p-6">
          <h3 className="text-xl font-semibold mb-5">Tags</h3>

          <div className="flex gap-3">
            <input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add Tag"
              className="flex-1 rounded-lg border px-4 py-3"
            />

            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-blue-600 px-6 text-white"
            >
              Add
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {formData.tags.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2"
              >
                {item}

                <button type="button" onClick={() => removeTag(index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 rounded-xl border p-6">
          <h3 className="text-xl font-semibold mb-5">Highlights</h3>

          <div className="flex gap-3">
            <input
              value={highlight}
              onChange={(e) => setHighlight(e.target.value)}
              placeholder="Add Highlight"
              className="flex-1 rounded-lg border px-4 py-3"
            />

            <button
              type="button"
              onClick={addHighlight}
              className="rounded-lg bg-blue-600 px-6 text-white"
            >
              Add
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {formData.highlights.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2"
              >
                {item}

                <button type="button" onClick={() => removeHighlight(index)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 rounded-xl border p-6">
          <h3 className="mb-5 text-xl font-semibold">Inclusions</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {inclusionList.map((item) => (
              <label key={item} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.inclusions.includes(item)}
                  onChange={() => toggleArrayValue("inclusions", item)}
                />

                {item}
              </label>
            ))}
          </div>
        </div>
        <div className="mt-10 rounded-xl border p-6">
          <h3 className="mb-5 text-xl font-semibold">Exclusions</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exclusionList.map((item:any) => (
              <label key={item} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.exclusions.includes(item)}
                  onChange={() => toggleArrayValue("exclusions", item)}
                />

                {item}
              </label>
            ))}
          </div>
        </div>

       
        <div className="mt-10 rounded-xl border p-6">
          <h2 className="mb-6 text-2xl font-bold">Package Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              Featured Package
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={handleChange}
              />
              Popular Package
            </label>

            <div>
              <label className="mb-2 block">Status</label>

              <select
                name="status"
                value={String(formData.status)}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,

                    status: e.target.value === "true",
                  }));
                }}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="true">Active</option>

                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-end gap-4">
          <button type="button" className="rounded-lg border px-8 py-3">
            Cancel
          </button>

          <button
            disabled={loading}
            type="submit"
            className="rounded-lg bg-blue-600 px-8 py-3 text-white"
            onClick={handleSubmit}
          >
            {loading ? "Saving..." : "Save Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
