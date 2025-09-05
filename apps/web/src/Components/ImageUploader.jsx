// src/components/ImageUploader.jsx
import React, { useState } from 'react';

const ImageUploader = ({ onFilesSelect }) => {
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
    onFilesSelect(files);
  };

  return (
    <div>
      <label className="flex flex-col items-center justify-center w-40 h-32 bg-gray-100 rounded-xl cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden">
        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-2 p-2">
            {previews.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} className="w-16 h-16 object-cover rounded" />
            ))}
          </div>
        ) : (
          <span className="text-gray-500 text-center">Upload Images</span>
        )}
        <input type="file" accept="image/*" onChange={handleChange} multiple className="hidden" />
      </label>
      <p className="text-gray-500 text-sm mt-2">Upload one or more images for the event.</p>
    </div>
  );
};

export default ImageUploader;
