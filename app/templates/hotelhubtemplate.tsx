"use client";

import CityDropdown from "@/components/CityDropdown";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface Room {
  roomName: string;
  price: number;
}

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
    rooms: [] as Room[],
  });
  const [showAmenities, setShowAmenities] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showRooms, setShowRooms] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [roomPrice, setRoomPrice] = useState("");
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
    rooms: [],
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

        setFormData(getInitialFormData());
        setSelectedAmenities([]);

        // Close amenities section
        setShowAmenities(false);

        // Reset room inputs
        setRoomName("");
        setRoomPrice("");

        // Close rooms section
        setShowRooms(false);
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
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => {
      const updatedAmenities = prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity];

      // formData ke amenities mein bhi save karo
      setFormData((form) => ({
        ...form,
        amenities: updatedAmenities.join(", "),
      }));

      return updatedAmenities;
    });
  };
  const addRoom = () => {
    const name = roomName.trim();
    const price = Number(roomPrice);

    if (!name) {
      toast.error("Please enter room name");
      return;
    }

    if (!roomPrice || isNaN(price) || price <= 0) {
      toast.error("Please enter valid room price");
      return;
    }

    const newRoom: Room = {
      roomName: name,
      price: price,
    };

    setFormData((prev) => ({
      ...prev,
      rooms: [...(prev.rooms || []), newRoom],
    }));

    // Clear inputs
    setRoomName("");
    setRoomPrice("");
  };
  const removeRoom = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index),
    }));
  };

  const hotelAmenities = [
    "Free WiFi",
    "Breakfast Included",
    "Swimming Pool",
    "Free Cancellation",
    "Parking",
    "Restaurant",
    "Room Service",
    "Air Conditioning",
    "24 Hours Front Desk",
    "Gym",
    "Spa",
    "Laundry Service",
    "Airport Transfer",
    "Couple Friendly",
    "Family Friendly",
    "Pet Friendly",
    "Non-Smoking Rooms",
    "Bar",
    "Business Center",
    "Conference Room",
    "Sea View",
    "City View",
    "TV",
    "Mini Bar",
    "Electric Kettle",
    "Power Backup",
    "Elevator",
  ];
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
        <div className="">
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
          <div className="mt-6 w-full">
            <button
              type="button"
              onClick={() => setShowRooms((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-5 py-4 text-left shadow-sm transition hover:bg-stone-50"
            >
              <div>
                <h3 className="text-lg font-semibold text-stone-900">
                  Room Types & Pricing
                </h3>

                <p className="mt-1 text-sm text-stone-500">
                  Add different room types and their prices
                </p>
              </div>

              <span className="text-xl text-stone-600">
                {showRooms ? "−" : "+"}
              </span>
            </button>

            {showRooms && (
              <div className="mt-3 w-full rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
                {/* ADD ROOM */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_250px_auto]">
                  {/* ROOM NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-800">
                      Room Name
                    </label>

                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g. Deluxe Room"
                      className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-black focus:border-blue-500"
                    />
                  </div>

                  {/* ROOM PRICE */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-stone-800">
                      Price Per Night
                    </label>

                    <input
                      type="number"
                      value={roomPrice}
                      onChange={(e) => setRoomPrice(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none placeholder:text-black focus:border-blue-500"
                    />
                  </div>

                  {/* ADD BUTTON */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addRoom}
                      className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 md:w-auto"
                    >
                      + Add Room
                    </button>
                  </div>
                </div>

                {/* ROOM LIST */}
                {formData.rooms && formData.rooms.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {formData.rooms.map((room, index) => (
                      <div
                        key={`${room.roomName}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-4"
                      >
                        <div>
                          <p className="font-semibold text-stone-900">
                            {room.roomName}
                          </p>

                          <p className="text-sm text-stone-500">
                            ₹{room.price.toLocaleString()} / night
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeRoom(index)}
                          className="rounded-md px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
            <label className="mb-2 mt-2 block font-medium text-stone-700">
              Amenities
            </label>

            {/* <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, Parking, Pool, Breakfast"
              className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-blue-500"
            /> */}
          </div>

          <div className="w-full">
            {/* BUTTON */}
            <button
              type="button"
              onClick={() => setShowAmenities((prev) => !prev)}
              className="rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              {showAmenities ? "Hide Amenities ↑" : "Select Hotel Amenities ↓"}
            </button>

            {/* DROPDOWN / DIV */}
            {/* DROPDOWN / DIV */}
            {showAmenities && (
              <div className="mt-3 w-full max-w-none rounded-xl border border-stone-300 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-stone-900">
                  Select Amenities
                </h3>

                {/* AMENITIES LIST */}
                <div className="w-full max-h-[350px] overflow-y-auto">
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {hotelAmenities.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-stone-200 px-3 py-2.5 hover:bg-stone-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="h-4 w-4 shrink-0 accent-blue-600"
                        />

                        <span className="text-sm text-stone-700">
                          {amenity}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SELECTED AMENITIES */}
                {selectedAmenities.length > 0 && (
                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <p className="mb-2 text-sm font-semibold text-stone-800">
                      Selected Amenities ({selectedAmenities.length})
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {selectedAmenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
