import React, { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import AOS from "aos";

const DeleteConfirmationPopup = ({
  isOpen,
  onClose,
  onConfirm,
  uniName,
  uniId,
}) => {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full transform transition-all duration-300"
        data-aos="zoom-in"
        data-aos-duration="400"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Are you sure you want to delete this:
          </p>
          <p className="font-bold text-xl text-red-600 break-words">
            {uniName || "Unknown University"}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          This action cannot be undone. All data associated with this university
          will be permanently removed.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(uniId);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationPopup;
