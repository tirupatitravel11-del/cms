"use client";

import CityDropdown from "@/components/CityDropdown";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function HotelForm() {
  const [formData, setFormData] = useState({
    city: "",
    name: "",
    address: "",
    description: "",
    categories: "",
    amenities: "",
    images: "",
    starRating: "",
    priceFrom: "",
    priceTo: "",
    contactNumber: "",
    email: "",
    website: "",
    priority: "",
    cab_page_id: "",
  });
  const [loading, setLoading] = useState(false);

  const [city, setCity] = useState<any>(null);
  const [form, setForm] = useState({
    id: "",
    cityName: "",
  });
  const handleCityChange = (selectedCity: any) => {
    setCity(selectedCity);

    setFormData((prev) => ({
      ...prev,
      city: selectedCity?.cityName || "",
      cab_page_id: selectedCity?._id || "",
    }));
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getInitialFormData = () => ({
    city: "",
    name: "",
    address: "",
    description: "",
    categories: "",
    amenities: "",
    images: "",
    starRating: "",
    priceFrom: "",
    priceTo: "",
    contactNumber: "",
    email: "",
    website: "",
    priority: "",
    cab_page_id: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post(
        process.env.apiUrl + "/api/create-update-hotel",
        formData,
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message || "Data created successfully.");
        // Reset form only after successful API response
        setFormData(getInitialFormData());
      }
    } catch (error: unknown) {
      console.error(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  console.log(city);
  return (
    <div className="rounded-xl bg-white p-6 shadow text-black">
      <h2 className="mb-6 text-2xl font-bold text-stone-900">Add Hotel</h2>

      {/* ================= BULK UPLOAD ================= */}
      {/* <div className="mb-8 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-5">
        <h3 className="mb-2 text-lg font-semibold">Bulk Upload Hotels</h3>

        <p className="mb-4 text-sm text-stone-900">
          Upload a CSV file to add multiple hotels at once.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".csv"
            className="rounded-lg border border-stone-300 bg-white p-2"
          />

          <button
            type="button"
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Upload CSV
          </button>
        </div>
      </div> */}
      <CityDropdown value={city} onChange={handleCityChange} />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* CITY DROPDOWN */}
          {/* <div>
            <label className="mb-2 block font-medium text-black">
              City
            </label>

            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="">Select City</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="pune">Pune</option>
              <option value="lucknow">Lucknow</option>
            </select>
          </div> */}

          {/* NAME */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Hotel Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter hotel name"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* ADDRESS */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-stone-700">
              Address
            </label>

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter hotel address"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-stone-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Enter hotel description"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* CATEGORIES */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Categories
            </label>

            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              placeholder="Luxury, Business, Resort"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* AMENITIES */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Amenities
            </label>

            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Parking, Pool, Breakfast"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* IMAGES */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-stone-700">
              Images
            </label>

            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="Enter image URLs separated by comma"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* STAR RATING */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Star Rating
            </label>

            <input
              type="number"
              name="starRating"
              value={formData.starRating}
              onChange={handleChange}
              min="1"
              max="5"
              placeholder="1 - 5"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* PRIORITY */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Priority
            </label>

            <input
              type="number"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              placeholder="Enter priority"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* PRICE FROM */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Price From
            </label>

            <input
              type="number"
              name="priceFrom"
              value={formData.priceFrom}
              onChange={handleChange}
              placeholder="Minimum price"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* PRICE TO */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Price To
            </label>

            <input
              type="number"
              name="priceTo"
              value={formData.priceTo}
              onChange={handleChange}
              placeholder="Maximum price"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* CONTACT NUMBER */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Contact Number
            </label>

            <input
              type="number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="Enter contact number"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block font-medium text-stone-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hotel@example.com"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {/* WEBSITE */}
          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-stone-700">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-7 flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Hotel
          </button>

          <button
            type="button"
            className="rounded-lg border border-stone-300 px-7 py-3 font-semibold text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
