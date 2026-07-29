"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type Vehicle = {
  category: string;
  brand: string;
  name: string;
  seats: string;
  luggage: string;
  acType: string;
  fuelType: string;
  image: string;
  features: string;
  slug: string;
};

type FareDetail = {
  // vehicle: string;
  localFare: string;
  roundTripFare: string;
  oneWayFare: string;
};

type FAQ = {
  question: string;
  answer: string;
  displayOrder: number;
  status: boolean;
};

type Route = {
  fromCity: string;
  toCity: string;
  startingFare: string;
  slug: string;
  displayOrder: number;
  status: boolean;
};

export default function CabHubTemplateForm() {
  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    // Basic
    title: "",
    cityName: "",
    startingFare: "",

    // Hero
    badgeText: "",
    heroHeading: "",
    heroDescription: "",

    // City Introduction
    sectionHeading: "",
    sectionDescription: "",

    // About Location
    overview: "",
    famousFor: [] as string[],
    localCuisine: [] as string[],
    bestToVisit: "",
    idealFor: [] as string[],
    nearestAirport: "",
    nearestRailway: "",

    // Route Information
    fromCity: "",
    toCity: "",

    localFareDetail: "",
    startingFareDetail: "",
    oneWayFare: "",

    routeCondition: "",
    distance: "",
    travelTime: "",
    popularPlaces: [] as string[],
    hotels: [] as string[],
    restaurants: [] as string[],

    // Fare Section
    fareHeading: "",

    // FAQ Section
    faqHeading: "",
    faqDescription: "",

    // Outstation Section
    routeHeading: "",
    routeDescription: "",

    // SEO
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [] as string[],
      canonicalUrl: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      robots: "index,follow",
      schemaMarkup: "",
    },

    // Multiple Data
    vehicles: [] as Vehicle[],
    fareDetails: [] as FareDetail[],
    faqs: [] as FAQ[],
    routes: [] as Route[],
  });
const [metaKeywordsInput, setMetaKeywordsInput] = useState("");
  // =====================================================
  // BASIC INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SEO CHANGE
  // =====================================================

  const handleSeoChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [name]: value,
      },
    }));
  };

  // =====================================================
  // VEHICLE
  // =====================================================

  const emptyVehicle: Vehicle = {
    category: "",
    brand: "",
    name: "",
    seats: "",
    luggage: "",
    acType: "AC",
    fuelType: "Petrol",
    image: "",
    features: "",
    slug: "",
  };

  const addVehicle = () => {
    setFormData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, { ...emptyVehicle }],
    }));
  };

  const removeVehicle = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      vehicles: prev.vehicles.filter((_, i) => i !== index),
    }));
  };

  const handleVehicleChange = (
    index: number,
    field: keyof Vehicle,
    value: string,
  ) => {
    setFormData((prev) => {
      const vehicles = [...prev.vehicles];

      vehicles[index] = {
        ...vehicles[index],
        [field]: value,
      };

      return {
        ...prev,
        vehicles,
      };
    });
  };

  // =====================================================
  // FARE DETAILS
  // =====================================================

  const emptyFare: FareDetail = {
    // vehicle: "",
    localFare: "",
    roundTripFare: "",
    oneWayFare: "",
  };

  const addFare = () => {
    setFormData((prev) => ({
      ...prev,
      fareDetails: [...prev.fareDetails, { ...emptyFare }],
    }));
  };

  const removeFare = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fareDetails: prev.fareDetails.filter((_, i) => i !== index),
    }));
  };

  const handleFareChange = (
    index: number,
    field: keyof FareDetail,
    value: string,
  ) => {
    setFormData((prev) => {
      const fareDetails = [...prev.fareDetails];

      fareDetails[index] = {
        ...fareDetails[index],
        [field]: value,
      };

      return {
        ...prev,
        fareDetails,
      };
    });
  };

  // =====================================================
  // FAQ
  // =====================================================

  const emptyFaq: FAQ = {
    question: "",
    answer: "",
    displayOrder: 1,
    status: true,
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        {
          ...emptyFaq,
          displayOrder: prev.faqs.length + 1,
        },
      ],
    }));
  };

  const removeFaq = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (
    index: number,
    field: keyof FAQ,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => {
      const faqs = [...prev.faqs];

      faqs[index] = {
        ...faqs[index],
        [field]: value,
      };

      return {
        ...prev,
        faqs,
      };
    });
  };

  // =====================================================
  // ROUTES
  // =====================================================

  const emptyRoute: Route = {
    fromCity: "",
    toCity: "",
    startingFare: "",
    slug: "",
    displayOrder: 1,
    status: true,
  };

  const addRoute = () => {
    setFormData((prev) => ({
      ...prev,
      routes: [
        ...prev.routes,
        {
          ...emptyRoute,
          displayOrder: prev.routes.length + 1,
        },
      ],
    }));
  };

  const removeRoute = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      routes: prev.routes.filter((_, i) => i !== index),
    }));
  };

  const handleRouteChange = (
    index: number,
    field: keyof Route,
    value: string | boolean | number,
  ) => {
    setFormData((prev) => {
      const routes = [...prev.routes];

      routes[index] = {
        ...routes[index],
        [field]: value,
      };

      return {
        ...prev,
        routes,
      };
    });
  };

  // =====================================================
  // ARRAY TEXT INPUT
  // =====================================================

  const handleArrayChange = (
    field:
      | "famousFor"
      | "localCuisine"
      | "idealFor"
      | "popularPlaces"
      | "hotels"
      | "restaurants",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value.split(","),
    }));
  };

  // =====================================================
  // SEO KEYWORDS
  // =====================================================

const handleSeoKeywordsChange = (value: string) => {
  setMetaKeywordsInput(value);

  setFormData((prev) => ({
    ...prev,
    seo: {
      ...prev.seo,
      metaKeywords: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    },
  }));
};
  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();



    try {
      const response = await axios.post(
        process.env.apiUrl + "/api/create-update-cab-hub-page",
        formData,
        {
          withCredentials: true,
        },
      );
   if (response.data.success) {
      toast.success(response.data.message || "Data created successfully.");

      // Reset form only after successful API response
      setFormData(getInitialFormData());
        setMetaKeywordsInput("");
    }
    } catch (error: unknown) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  }
  };

  // =====================================================
  // JSX
  // =====================================================
const getInitialFormData = () => ({
  // Basic
  title: "",
  cityName: "",
  startingFare: "",

  // Hero
  badgeText: "",
  heroHeading: "",
  heroDescription: "",

  // City Introduction
  sectionHeading: "",
  sectionDescription: "",

  // About Location
  overview: "",
  famousFor: [] as string[],
  localCuisine: [] as string[],
  bestToVisit: "",
  idealFor: [] as string[],
  nearestAirport: "",
  nearestRailway: "",

  // Route Information
  fromCity: "",
  toCity: "",

  localFareDetail: "",
  startingFareDetail: "",
  oneWayFare: "",

  routeCondition: "",
  distance: "",
  travelTime: "",
  popularPlaces: [] as string[],
  hotels: [] as string[],
  restaurants: [] as string[],

  // Fare Section
  fareHeading: "",

  // FAQ Section
  faqHeading: "",
  faqDescription: "",

  // Outstation Section
  routeHeading: "",
  routeDescription: "",

  // SEO
  seo: {
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [] as string[],
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    robots: "index,follow",
    schemaMarkup: "",
  },

  // Multiple Data
  vehicles: [] as Vehicle[],
  fareDetails: [] as FareDetail[],
  faqs: [] as FAQ[],
  routes: [] as Route[],
});
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-6xl space-y-8 text-black"
    >
      {/* =====================================================
          SEO
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">SEO Settings</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">Meta Title</label>

            <input
              type="text"
              name="metaTitle"
              value={formData.seo.metaTitle}
              onChange={handleSeoChange}
              placeholder="Lucknow Taxi Service | Book Cabs"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Canonical URL</label>

            <input
              type="text"
              name="canonicalUrl"
              value={formData.seo.canonicalUrl}
              onChange={handleSeoChange}
              placeholder="https://example.com/cabs/lucknow"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">Meta Description</label>

            <textarea
              rows={3}
              name="metaDescription"
              value={formData.seo.metaDescription}
              onChange={handleSeoChange}
              placeholder="Book affordable and reliable Lucknow taxi services..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">Meta Keywords</label>

            <input
  type="text"
  value={metaKeywordsInput}
  onChange={(e) => handleSeoKeywordsChange(e.target.value)}
  placeholder="Lucknow Taxi, Lucknow Cab, Lucknow Cab Service"
  className="w-full rounded-lg border p-3"
/>

            <p className="mt-1 text-sm text-gray-500">
              Separate keywords with commas.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
    ROUTE INFORMATION
===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          Route Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* From City */}
          <div>
            <label className="mb-2 block font-medium">From City</label>

            <input
              type="text"
              name="fromCity"
              value={formData.fromCity}
              onChange={handleChange}
              placeholder="Lucknow"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* To City */}
          <div>
            <label className="mb-2 block font-medium">To City</label>

            <input
              type="text"
              name="toCity"
              value={formData.toCity}
              onChange={handleChange}
              placeholder="Ayodhya"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
    CITY INTRODUCTION
===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          City Introduction
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {/* City Name */}
          <div>
            <label className="mb-2 block font-medium">City Name</label>

            <input
              type="text"
              name="cityName"
              value={formData.cityName}
              onChange={handleChange}
              placeholder="Lucknow"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Starting Fare */}
          <div>
            <label className="mb-2 block font-medium">
              Starting Fare (₹/km)
            </label>

            <input
              type="number"
              name="startingFare"
              value={formData.startingFare}
              onChange={handleChange}
              placeholder="9"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          FARE TABLE
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold">Fare Table Section</h2>

          <button
            type="button"
            onClick={addFare}
            className="rounded-lg bg-gold px-5 py-2 font-semibold text-black"
          >
            + Add Fare
          </button>
        </div>

        <div>
          <label className="mb-2 block font-medium">Fare Table Heading</label>

          <input
            type="text"
            name="fareHeading"
            value={formData.fareHeading}
            onChange={handleChange}
            placeholder="Lucknow Cab Fare & Vehicle Details"
            className="w-full rounded-lg border p-3"
          />
        </div>

        {formData.fareDetails.map((fare, index) => (
          <div key={index} className="mt-8 rounded-lg border bg-stone-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Fare {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeFare(index)}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">
                  Local Fare (₹/km)
                </label>

                <input
                  type="number"
                  value={fare.localFare}
                  onChange={(e) =>
                    handleFareChange(index, "localFare", e.target.value)
                  }
                  placeholder="10"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Round Trip Fare (₹/km)
                </label>

                <input
                  type="number"
                  value={fare.roundTripFare}
                  onChange={(e) =>
                    handleFareChange(index, "roundTripFare", e.target.value)
                  }
                  placeholder="9"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  One Way Fare (₹/km)
                </label>

                <input
                  type="number"
                  value={fare.oneWayFare}
                  onChange={(e) =>
                    handleFareChange(index, "oneWayFare", e.target.value)
                  }
                  placeholder="11"
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
    VEHICLE FARE DETAILS
===================================================== */}

      {/* =====================================================
          ABOUT LOCATION
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          About Location
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Overview</label>

            <textarea
              rows={5}
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              placeholder="Write overview..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Famous For</label>

            <input
              type="text"
              value={formData.famousFor.join(",")}
              onChange={(e) => handleArrayChange("famousFor", e.target.value)}
              placeholder="Bara Imambara, Chikankari, Awadhi Culture"
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate items with commas.
            </p>
          </div>

          <div>
            <label className="mb-2 block font-medium">Local Cuisine</label>

            <input
              type="text"
              value={formData.localCuisine.join(",")}
              onChange={(e) =>
                handleArrayChange("localCuisine", e.target.value)
              }
              placeholder="Tunday Kababi, Biryani, Basket Chaat"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Best Time to Visit</label>

            <input
              type="text"
              name="bestToVisit"
              value={formData.bestToVisit}
              onChange={handleChange}
              placeholder="October to March"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Ideal For</label>

            <input
              type="text"
              value={formData.idealFor.join(",")}
              onChange={(e) => handleArrayChange("idealFor", e.target.value)}
              placeholder="Family Trips, Business Travel, Airport Transfers"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Nearest Airport</label>

              <input
                type="text"
                name="nearestAirport"
                value={formData.nearestAirport}
                onChange={handleChange}
                placeholder="Chaudhary Charan Singh International Airport"
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Nearest Railway Station
              </label>

              <input
                type="text"
                name="nearestRailway"
                value={formData.nearestRailway}
                onChange={handleChange}
                placeholder="Lucknow Charbagh Railway Station"
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold">FAQ Section</h2>

          <button
            type="button"
            onClick={addFaq}
            className="rounded-lg bg-gold px-5 py-2 font-semibold text-black"
          >
            + Add FAQ
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Question</label>

            <input
              type="text"
              name="faqHeading"
              value={formData.faqHeading}
              onChange={handleChange}
              placeholder="Lucknow Cab Service FAQs"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Answer</label>

            <textarea
              rows={3}
              name="faqDescription"
              value={formData.faqDescription}
              onChange={handleChange}
              placeholder="..."
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        {formData.faqs.map((faq, index) => (
          <div key={index} className="mt-8 rounded-lg border bg-stone-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">FAQ {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Remove
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block font-medium">Question</label>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  placeholder="What is the taxi fare?"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Answer</label>

                <textarea
                  rows={5}
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  placeholder="Taxi fares start from..."
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium">
                    Display Order
                  </label>

                  <input
                    type="number"
                    value={faq.displayOrder}
                    onChange={(e) =>
                      handleFaqChange(
                        index,
                        "displayOrder",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium">Status</label>

                  <select
                    value={faq.status ? "true" : "false"}
                    onChange={(e) =>
                      handleFaqChange(
                        index,
                        "status",
                        e.target.value === "true",
                      )
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          ROUTE INFORMATION DETAILS
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          Route Information Details
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">From City</label>

            <input
              type="text"
              name="fromCity"
              value={formData.fromCity}
              onChange={handleChange}
              placeholder="Lucknow"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">To City</label>

            <input
              type="text"
              name="toCity"
              value={formData.toCity}
              onChange={handleChange}
              placeholder="Ayodhya"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Distance</label>

            <input
              type="text"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              placeholder="135 km"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Travel Time</label>

            <input
              type="text"
              name="travelTime"
              value={formData.travelTime}
              onChange={handleChange}
              placeholder="3-4 hours"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">Route Condition</label>

            <textarea
              rows={3}
              name="routeCondition"
              value={formData.routeCondition}
              onChange={handleChange}
              placeholder="Describe road and route condition..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Popular Places</label>

            <input
              type="text"
              value={formData.popularPlaces.join(",")}
              onChange={(e) =>
                handleArrayChange("popularPlaces", e.target.value)
              }
              placeholder="Ayodhya Dham, Ram Mandir"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Hotels</label>

            <input
              type="text"
              value={formData.hotels.join(",")}
              onChange={(e) => handleArrayChange("hotels", e.target.value)}
              placeholder="Hotel 1, Hotel 2"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Restaurants</label>

            <input
              type="text"
              value={formData.restaurants.join(",")}
              onChange={(e) => handleArrayChange("restaurants", e.target.value)}
              placeholder="Restaurant 1, Restaurant 2"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          OUTSTATION ROUTES
      ===================================================== */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-2xl font-bold">Popular Outstation Routes</h2>

          <button
            type="button"
            onClick={addRoute}
            className="rounded-lg bg-gold px-5 py-2 font-semibold text-black"
          >
            + Add Route
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Section Heading</label>

            <input
              type="text"
              name="routeHeading"
              value={formData.routeHeading}
              onChange={handleChange}
              placeholder="Outstation Cab from Lucknow"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Section Description
            </label>

            <textarea
              rows={3}
              name="routeDescription"
              value={formData.routeDescription}
              onChange={handleChange}
              placeholder="Book reliable outstation cabs..."
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        {formData.routes.map((route, index) => (
          <div key={index} className="mt-8 rounded-lg border bg-stone-50 p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Route {index + 1}</h3>

              <button
                type="button"
                onClick={() => removeRoute(index)}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Remove
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">From City</label>

                <input
                  type="text"
                  value={route.fromCity}
                  onChange={(e) =>
                    handleRouteChange(index, "fromCity", e.target.value)
                  }
                  placeholder="Lucknow"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">To City</label>

                <input
                  type="text"
                  value={route.toCity}
                  onChange={(e) =>
                    handleRouteChange(index, "toCity", e.target.value)
                  }
                  placeholder="Ayodhya"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Starting Fare</label>

                <input
                  type="number"
                  value={route.startingFare}
                  onChange={(e) =>
                    handleRouteChange(index, "startingFare", e.target.value)
                  }
                  placeholder="2500"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Route Slug</label>

                <input
                  type="text"
                  value={route.slug}
                  onChange={(e) =>
                    handleRouteChange(index, "slug", e.target.value)
                  }
                  placeholder="lucknow-to-ayodhya-cab"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Display Order</label>

                <input
                  type="number"
                  value={route.displayOrder}
                  onChange={(e) =>
                    handleRouteChange(
                      index,
                      "displayOrder",
                      Number(e.target.value),
                    )
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Status</label>

                <select
                  value={route.status ? "true" : "false"}
                  onChange={(e) =>
                    handleRouteChange(
                      index,
                      "status",
                      e.target.value === "true",
                    )
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          FINAL SUBMIT
      ===================================================== */}

      <div className="flex justify-end gap-4 pb-10">
        {/* <button
          type="button"
          onClick={() => console.log(formData)}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100"
        >
          Preview Data
        </button> */}

        <button
          type="submit"
          className="rounded-lg bg-gold px-8 py-3 font-semibold text-black border-2 border-black hover:opacity-90"
        >
          Save Cab Hub
        </button>
      </div>
    </form>
  );
}
