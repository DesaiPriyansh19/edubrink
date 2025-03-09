import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  GraduationCap,
  Clock,
  Award,
  Loader2,
  Languages,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function MajorCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [majorToDelete, setMajorToDelete] = useState(null);

  const baseUrl = `https://edu-brink-backend.vercel.app/api/majors`;
  const { data: majors, loading, error, deleteById } = useApiData(baseUrl);

  const handleDelete = (major) => {
    setMajorToDelete(major);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!majorToDelete) return;

    try {
      await deleteById(id);
      setIsDeletePopupOpen(false);
      setMajorToDelete(null);
    } catch (error) {
      console.error("Error deleting university:", error);
    }
  };

  const filteredMajors = majors.filter(
    (major) =>
      major.majorName.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      major.majorName.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      major.faculty?.universities?.some(
        (item) => item.uniName.en.toLowerCase() === searchQuery.toLowerCase()
      ) ||
      major.faculty.facultyName.en.toLowerCase() === searchQuery.toLowerCase()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Majors Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/majors/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Major
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Majors, Faculty, and Universities name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-0">
          {filteredMajors.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No majors found matching your search.
            </div>
          ) : (
            filteredMajors.map((major) => (
              <div
                key={major._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{major.majorName[language]}</h3>
                    {major.majorCheckBox.featuredMajor && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {major.majorCheckBox.scholarshipsAvailable && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Scholarships
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="w-4 h-4 mr-1" />
                      {major?.faculty?.facultyName[language]}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {major.faculty?.universities[0]?.uniName[language]}
                    </div>
                    {major.duration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {major.duration} {major.durationUnits}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {major.studyLevel?.map((level) => (
                      <span
                        key={level}
                        className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {level}
                      </span>
                    ))}
                    {major.majorLanguages?.map((language) => (
                      <span
                        key={language}
                        className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Languages className="w-3 h-3 mr-1" />
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/majors/${major._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(major)}
                    className="text-red-600 hover:text-red-800 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Majors</h2>
          </div>
          <p className="text-3xl font-bold">{majors.length}</p>
          <p className="text-sm text-gray-500 mt-1">Across all faculties</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">With Scholarships</h2>
          </div>
          <p className="text-3xl font-bold">
            {majors.filter((m) => m.majorCheckBox.scholarshipsAvailable).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Majors offering scholarships
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured Majors</h2>
          </div>
          <p className="text-3xl font-bold">
            {majors.filter((m) => m.majorCheckBox.featuredMajor).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Highlighted majors</p>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={majorToDelete?.majorName.en || ""}
        uniId={majorToDelete?._id || ""}
      />
    </div>
  );
}
