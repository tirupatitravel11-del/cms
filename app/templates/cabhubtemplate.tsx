"use client";

import { useState } from "react";

export default function CabHubTemplateForm() {
  const [pageData, setPageData] = useState({
    // Hero
    Title: "",

    heroDescription: "",

    // City Introduction
    sectionHeading: "",
    sectionDescription: "",

    //fleet
    vehicleHeading: "",

    vehicleDescription: "",
  });

  const [vehicles, setVehicles] = useState([
    {
      category: "",
      brand: "",
      name: "",
      seats: "",
      luggage: "",
      acType: "AC",
      fuelType: " ",
      localFare: "",
      oneWayFare: "",
      roundTripFare: "",
      slug: "",
      features: "",
    },
  ]);

  const [fareDetails, setFareDetails] = useState([
    {
      vehicle_id: "",
      localFare: "",
      roundTripFare: "",
      oneWayFare: "",
      displayOrder: "",
      status: "true",
    },
  ]);

  const [faqs, setFaqs] = useState([
    {
      question: "",
      answer: "",
      displayOrder: "",
      status: "true",
    },
  ]);

  const [routes, setRoutes] = useState([
    {
      fromCity: "",
      toCity: "",
      startingFare: "",
      slug: "",
      displayOrder: "",
      status: "true",
    },
  ]);
  const [formData, setFormData] = useState({
//    title="",
// cityName="",
// startingFare="",
// overview=" ",
// FamousFor=[],
// localCuisine=[],
// bestToVisit="",
// idealFor=[],
// nearestAirport="",
// nearestRailway="",
// popularPlaces=[],
// hotels=[],
// restaurants=[],
// //  seo: {
//     metaTitle: "",
//     metaDescription: "",
//     metaKeywords: [],

//     canonicalUrl: "",

//     ogTitle: "",
//     ogDescription: "",
//     ogImage: "",

//     robots: "index,follow",

//     schemaMarkup: "",
//   },
// fareDetails: [
//   {
//     vehicle: "",
//     localFare: "",
//     roundTripFare: "",
//     oneWayFare: "",
//   },
// ]
// faqs: [
//   {
//     question: "",
//     answer: "",
//     displayOrder: 1,
//     status: true,
//   },
// ]
// routes: [
//   {
//     fromCity: "",
//     toCity: "",
//     startingFare: "",
//     slug: "",

   
//   },
// ]


});

 const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


  const handleVehicleChange = (index: number, field: string, value: string) => {
    const updated = [...vehicles];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setVehicles(updated);
  };

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        category: "",
        brand: "",
        name: "",
        seats: "",
        luggage: "",
        acType: "AC",
        fuelType: "Petrol",
        localFare: "",
        oneWayFare: "",
        roundTripFare: "",
        slug: "",
        features: "",
      },
    ]);
  };

  const removeVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };
  const addFare = () => {
    setFareDetails([
      ...fareDetails,
      {
        vehicle_id: "",
        localFare: "",
        roundTripFare: "",
        oneWayFare: "",
        displayOrder: "",
        status: "true",
      },
    ]);
  };

  const removeFare = (index: number) => {
    setFareDetails(fareDetails.filter((_, i) => i !== index));
  };

  const handleFareChange = (index: number, field: string, value: string) => {
    const updated = [...fareDetails];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFareDetails(updated);
  };

  const addFaq = () => {
    setFaqs([
      ...faqs,
      {
        question: "",
        answer: "",
        displayOrder: "",
        status: "true",
      },
    ]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: string, value: string) => {
    const updated = [...faqs];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setFaqs(updated);
  };

  const addRoute = () => {
    setRoutes([
      ...routes,
      {
        fromCity: "",
        toCity: "",
        startingFare: "",
        slug: "",
        displayOrder: "",
        status: "true",
      },
    ]);
  };

  const removeRoute = (index: number) => {
    setRoutes(routes.filter((_, i) => i !== index));
  };

  const handleRouteChange = (index: number, field: string, value: string) => {
    const updated = [...routes];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setRoutes(updated);
  };

  const handleSubmit = () => {
    console.log({
      ...pageData,
      vehicles,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 text-black">
      {/* HERO SECTION */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">Main Heading</h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Title</label>

            <input
              type="text"
              name="Title"
              value={pageData.Title}
              onChange={handleChange}
              placeholder="Cabs You Can Trust."
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      </div>

      {/* CITY INTRODUCTION */}
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
               value={pageData.city}
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
              placeholder="9"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      </div>

      {/* Fare Details */}
      <div className="mt-8 rounded-lg border bg-stone-50 p-5">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Vehicle Fare Details</h3>

          <button
            type="button"
            onClick={addFare}
            className="rounded-lg bg-gold px-5 py-2 font-semibold text-black border-2 border-black hover:opacity-90"
          >
            + Add Fare
          </button>
        </div>

        {fareDetails.map((fare, index) => (
          <div
            key={index}
            className="mb-8 rounded-lg border bg-white p-5 shadow-sm"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-lg font-semibold">Fare {index + 1}</h4>

              {fareDetails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFare(index)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Vehicle */}
              <div>
                <label className="mb-2 block font-medium">Vehicle</label>

                <select
                  value={fare.vehicle_id}
                  onChange={(e) =>
                    handleFareChange(index, "vehicle_id", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Select Vehicle</option>
                  <option value="1">Swift</option>
                  <option value="2">Dzire</option>
                  <option value="3">Ertiga</option>
                  <option value="4">Innova</option>
                  <option value="5">Innova Crysta</option>
                  <option value="6">Scorpio</option>
                </select>
              </div>

              {/* Local Fare */}
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
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Round Trip */}
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
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* One Way */}
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
                  className="w-full rounded-lg border p-3"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* City Details */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          About Location Section
        </h2>

        <div className="grid gap-5">
          {/* City */}
          <div>
            <label className="mb-2 block font-medium">City Name</label>
            <input
              type="text"
              name="city"
              placeholder="Lucknow"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Overview */}
          <div>
            <label className="mb-2 block font-medium">Overview</label>
            <textarea
              rows={5}
              name="overview"
              placeholder="Write about the city..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Famous For */}
          <div>
            <label className="mb-2 block font-medium">Famous For</label>

            <textarea
              rows={3}
              name="famousFor"
              placeholder="Nawabi Heritage, Bara Imambara, Chikankari..."
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate values using commas (,)
            </p>
          </div>

          {/* Local Cuisine */}
          <div>
            <label className="mb-2 block font-medium">Local Cuisine</label>

            <textarea
              rows={3}
              name="localCuisine"
              placeholder="Tunday Kebab, Lucknowi Biryani..."
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate values using commas (,)
            </p>
          </div>

          {/* Best Time */}
          <div>
            <label className="mb-2 block font-medium">Best Time to Visit</label>

            <input
              type="text"
              name="bestTimeToVisit"
              placeholder="October to March"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Ideal For */}
          <div>
            <label className="mb-2 block font-medium">Ideal For</label>

            <textarea
              rows={3}
              name="idealFor"
              placeholder="Bara Imambara, Hazratganj, Rumi Darwaza..."
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate values using commas (,)
            </p>
          </div>

          {/* Airport */}
          <div>
            <label className="mb-2 block font-medium">Nearest Airport</label>

            <input
              type="text"
              name="nearestAirport"
              placeholder="Chaudhary Charan Singh International Airport"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Railway */}
          <div>
            <label className="mb-2 block font-medium">
              Nearest Railway Station
            </label>

            <input
              type="text"
              name="nearestRailwayStation"
              placeholder="Lucknow Charbagh Railway Station"
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>
      </div>

      {/* FAQ Details */}
      <div className="mt-8 rounded-lg border bg-stone-50 p-5">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">FAQ Details</h3>

          <button
            type="button"
            onClick={addFaq}
            className="rounded-lg bg-gold px-5 py-2 font-semibold text-black border-2 border-black hover:opacity-90"
          >
            + Add FAQ
          </button>
        </div>

        {faqs.map((faq, index) => (
          <div
            key={index}
            className="mb-8 rounded-lg border bg-white p-5 shadow-sm"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-lg font-semibold">FAQ {index + 1}</h4>

              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid gap-5">
              {/* Question */}
              <div>
                <label className="mb-2 block font-medium">Question</label>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) =>
                    handleFaqChange(index, "question", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="mb-2 block font-medium">Answer</label>

                <textarea
                  rows={5}
                  value={faq.answer}
                  onChange={(e) =>
                    handleFaqChange(index, "answer", e.target.value)
                  }
                  className="w-full rounded-lg border p-3"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* City near by */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          Outstation Routes Section
        </h2>

        {/* ROUTE INFO SECTION */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-6 border-b pb-3 text-2xl font-bold">Route Info</h2>

          {/* Basic Route Information */}
          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-medium">Route Title</label>

              <input
                type="text"
                name="routeTitle"
                placeholder="Lucknow to Ayodhya Cab"
                className="w-full rounded-lg border p-3"
              />
            </div>
          </div>

          {/* Distance / Time / Road Condition */}
          <div className="mt-8 rounded-lg border bg-stone-50 p-5">
            <h3 className="mb-5 text-lg font-semibold">Route Details</h3>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Distance */}
              <div>
                <label className="mb-2 block font-medium">Distance</label>

                <input
                  type="text"
                  name="distance"
                  placeholder="135 km"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Travel Time */}
              <div>
                <label className="mb-2 block font-medium">
                  Approx. Travel Time
                </label>

                <input
                  type="text"
                  name="travelTime"
                  placeholder="3 - 4 hours"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Road Condition */}
              <div>
                <label className="mb-2 block font-medium">Road Condition</label>

                <select
                  name="roadCondition"
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Select Road Condition</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              {/* Toll */}
              <div>
                <label className="mb-2 block font-medium">
                  Toll Information
                </label>

                <input
                  type="text"
                  name="tollInfo"
                  placeholder="Approx. ₹150 - ₹250"
                  className="w-full rounded-lg border p-3"
                />
              </div>

              {/* Route Type */}
              <div>
                <label className="mb-2 block font-medium">Route Type</label>

                <select
                  name="routeType"
                  className="w-full rounded-lg border p-3"
                >
                  <option value="">Select Route Type</option>
                  <option value="Highway">Highway</option>
                  <option value="Expressway">Expressway</option>
                  <option value="State Highway">State Highway</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Popular Places  */}
          <div className="mt-8 rounded-lg border bg-stone-50 p-5">
            <h3 className="mb-5 text-lg font-semibold">Popular Places</h3>

            <textarea
              rows={4}
              name="popularStops"
              placeholder="Barabanki, Dewa Sharif, Faizabad..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Hotels */}
          <div className="mt-8 rounded-lg border bg-stone-50 p-5">
            <h3 className="mb-5 text-lg font-semibold">Hotels</h3>

            <textarea
              rows={4}
              name="hotels"
              placeholder="List hotels or accommodation options available along the route..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Restaurants */}
          <div className="mt-8 rounded-lg border bg-stone-50 p-5">
            <h3 className="mb-5 text-lg font-semibold">Restaurants</h3>

            <textarea
              rows={4}
              name="restaurants"
              placeholder="Popular restaurants, dhabas and food stops along the route..."
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Save */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="rounded-lg bg-gold px-6 py-3 font-semibold text-white"
            >
              Save Route Information
            </button>
          </div>
        </div>

        {/* Route Details */}
        <div className="mt-8 rounded-lg border bg-stone-50 p-5">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold">Route Details</h3>

            <button
              type="button"
              
              onClick={addRoute}
              className="rounded-lg bg-gold px-5 py-2 font-semibold text-black border-black border-2 hover:opacity-90"
            >
              + Add Route
            </button>
          </div>

          {routes.map((route, index) => (
            <div
              key={index}
              className="mb-8 rounded-lg border bg-white p-5 shadow-sm"
            >
              {/* Route Header */}
              <div className="mb-5 flex items-center justify-between">
                <h4 className="text-lg font-semibold">Route {index + 1}</h4>

                {routes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoute(index)}
                    className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {/* From City */}
                <div>
                  <label className="mb-2 block font-medium">From City</label>

                  <select
                    value={route.fromCity}
                    onChange={(e) =>
                      handleRouteChange(index, "fromCity", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select From City</option>
                    <option>Lucknow</option>
                    <option>Varanasi</option>
                    <option>Kanpur</option>
                  </select>
                </div>

                {/* To City */}
                <div>
                  <label className="mb-2 block font-medium">To City</label>

                  <select
                    value={route.toCity}
                    onChange={(e) =>
                      handleRouteChange(index, "toCity", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  >
                    <option value="">Select Destination</option>
                    <option>Ayodhya</option>
                    <option>Prayagraj</option>
                    <option>Agra</option>
                    <option>Gorakhpur</option>
                  </select>
                </div>

                {/* Starting Fare */}
                <div>
                  <label className="mb-2 block font-medium">
                    Starting Fare
                  </label>

                  <input
                    type="number"
                    value={route.startingFare}
                    onChange={(e) =>
                      handleRouteChange(index, "startingFare", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-2 block font-medium">Route Slug</label>

                  <input
                    type="text"
                    value={route.slug}
                    onChange={(e) =>
                      handleRouteChange(index, "slug", e.target.value)
                    }
                    className="w-full rounded-lg border p-3"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO SECTION */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 border-b pb-3 text-2xl font-bold">
          SEO Information
        </h2>

        <div className="space-y-5">
          {/* Meta Title */}
          <div>
            <label className="mb-2 block font-medium">Meta Title</label>

            <input
              type="text"
              name="metaTitle"
              placeholder="Lucknow to Ayodhya Taxi Service"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Meta Description */}
          <div>
            <label className="mb-2 block font-medium">Meta Description</label>

            <textarea
              rows={4}
              name="metaDescription"
              placeholder="Book Lucknow to Ayodhya taxi with professional drivers at affordable fares."
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="mb-2 block font-medium">Meta Keywords</label>

            <input
              type="text"
              name="metaKeywords"
              placeholder="Lucknow Taxi, Ayodhya Cab, Outstation Taxi"
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-1 text-sm text-gray-500">
              Separate keywords with commas.
            </p>
          </div>

          {/* Canonical URL */}
          <div>
            <label className="mb-2 block font-medium">Canonical URL</label>

            <input
              type="text"
              name="canonicalUrl"
              placeholder="https://example.com/taxi/lucknow-to-ayodhya"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* OG Image */}
          <div>
            <label className="mb-2 block font-medium">
              Social Share Image (OG Image)
            </label>

            <input
              type="file"
              accept="image/*"
              name="ogImage"
              className="w-full rounded-lg border p-3"
            />
          </div>

          {/* Robots */}
          <div>
            <label className="mb-2 block font-medium">Robots</label>

            <select name="robots" className="w-full rounded-lg border p-3">
              <option value="index,follow">Index, Follow</option>
              <option value="noindex,nofollow">No Index, No Follow</option>
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Save Cab Hub Template
      </button>
    </div>
  );
}
