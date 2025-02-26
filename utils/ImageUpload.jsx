import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Upload, X } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageUpload = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [images, setImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const newImages = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  }, []);

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    multiple: true,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="w-full">
      {/* Hide Dropzone if images are uploaded */}
      {images.length === 0 && (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ease-in-out ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`mx-auto h-12 w-12 ${
              isDragActive ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <p
            className={`mt-2 text-sm ${
              isDragActive ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {isDragActive
              ? "Drop the image here"
              : "Drag and drop an image here, or click to select"}
          </p>
        </div>
      )}

      {/* Display uploaded images in a Swiper slider */}
      {images.length > 0 && (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          spaceBetween={10}
          slidesPerView={1}
          className="mt-4 w-full "
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full  overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 p-2 rounded-full shadow-md"
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ImageUpload;
