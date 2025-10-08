import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import MapPicker from "../../../Components/MapPicker"; 
import { useEvent } from "../../../contexts/EventContext";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateEvent() {
  const { createEvent, loading } = useEvent();

  const initialForm = {
    event_name: "",
    event_description: "",
    event_images: [],
    event_date: "",
    event_time: "",
    event_venue: "",
    event_geolocation: "",
    need_count: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);
  const [location, setLocation] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, event_images: files });
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages(previews);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      Swal.fire({
        icon: "warning",
        title: "No location selected",
        text: "Please select a location on the map",
      });
      return;
    }

    const data = new FormData();
    Object.entries({
      ...formData,
      event_geolocation: JSON.stringify(location),
    }).forEach(([key, value]) => {
      if (key === "event_images" && value.length > 0) {
        Array.from(value).forEach((file) => data.append("event_images", file));
      } else {
        data.append(key, value);
      }
    });

    try {
      await createEvent(data);

      toast.success("✅ Event created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset
      setFormData(initialForm);
      setPreviewImages([]);
      setLocation(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to create event. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-blue-50 to-amber-50 py-8 px-4">
      <ToastContainer />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 text-gray-800"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center tracking-wide text-gray-900">
            Create <span className="text-blue-500">Event</span>
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              placeholder="Event Name"
              className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
              required
            />

            <textarea
              name="event_description"
              value={formData.event_description}
              onChange={handleChange}
              placeholder="Event Description"
              rows={4}
              className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
                required
              />
              <input
                type="time"
                name="event_time"
                value={formData.event_time}
                onChange={handleChange}
                className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="event_venue"
                value={formData.event_venue}
                onChange={handleChange}
                placeholder="Event Venue"
                className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
                required
              />

              <input
                type="number"
                name="need_count"
                value={formData.need_count}
                onChange={handleChange}
                placeholder="Volunteers Needed"
                min="1"
                className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-blue-900 focus:bg-white outline-none transition"
                required
              />
            </div>

            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
              <MapPicker onLocationSelect={setLocation} />
            </div>
          {location && (
            <p className="text-sm text-gray-600 mt-2">
              📍 Selected: {location.lat}, {location.lng}
            </p>
          )}

            <div>
              <label className="flex flex-col items-center justify-center w-44 h-36 bg-gray-50 rounded-2xl cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-900/50 overflow-hidden transition-colors">
              {previewImages.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-2 max-h-32 overflow-y-auto">
                  {previewImages.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`preview-${i}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                  </div>
              ) : (
                <span className="text-gray-500 text-center">Upload Images</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                name="event_images"
                accept="image/*"
                onChange={handleChange}
                multiple
                className="hidden"
              />
              </label>
              <p className="text-gray-500 text-sm mt-2">
                Upload one or more images for the event.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="mt-2 bg-blue-900 hover:bg-blue-900 text-white p-4 rounded-2xl font-bold text-lg transition shadow-md"
            >
              {loading ? "Creating..." : "Create Event"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
