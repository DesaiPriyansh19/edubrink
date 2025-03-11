import React, { useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichText = ({ value, onChange, label, className = "h-64" }) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ size: ["small", false, "large", "huge"] }], // Text size options
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote"],
        [{ align: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "blockquote",
    "align",
  ];

  return (
    <div className="col-span-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="prose max-w-none">
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            className={className}
          />
        </div>
      </div>
    </div>
  );
};

export default RichText;
