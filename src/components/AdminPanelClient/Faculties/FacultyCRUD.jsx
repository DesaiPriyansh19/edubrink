import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  MapPin,
  Users,
  BookOpen,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function FacultyCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const baseUrl = `https://edu-brink-backend.vercel.app/api/faculty`;
  const { data: faculties, loading, deleteById } = useApiData(baseUrl);

  const handleDelete = (university) => {
    setFacultyToDelete(university);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!facultyToDelete) return;

    try {
      await deleteById(id);
      setIsDeletePopupOpen(false);
      setFacultyToDelete(null);
    } catch (error) {
      console.error("Error deleting university:", error);
    }
  };

  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.facultyName.en.toLowerCase().includes(searchQuery.toLowerCase())
    // faculty.university?.name
    //   .toLowerCase()
    //   .includes(searchQuery.toLowerCase()) ||
    // faculty.university?.country?.name
    //   .toLowerCase()
    //   .includes(searchQuery.toLowerCase())
  );

  console.log(filteredFaculties);
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
        <h1 className="text-2xl font-bold">Faculties Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/faculties/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Faculty
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
                placeholder="Search faculties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-0">
          {filteredFaculties.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No faculties found matching your search.
            </div>
          ) : (
            filteredFaculties.map((faculty) => (
              <div
                key={faculty._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{faculty.facultyName.en}</h3>
                    {faculty.facultyFeatured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="w-4 h-4 mr-1" />
                      {faculty.university?.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {faculty.university?.country?.name}
                    </div>
                    {faculty.study_programs && (
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {faculty.study_programs.length} Programs
                      </div>
                    )}
                    {faculty.study_levels && (
                      <div className="flex items-center text-sm text-gray-500">
                        <GraduationCap className="w-4 h-4 mr-1" />
                        {faculty.study_levels.length} Study Levels
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/faculties/${faculty._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faculty)}
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
            <h2 className="text-lg font-semibold">Total Faculties</h2>
          </div>
          <p className="text-3xl font-bold">{faculties.length}</p>
          <p className="text-sm text-gray-500 mt-1">Across all universities</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Total Programs</h2>
          </div>
          <p className="text-3xl font-bold">
            {faculties.reduce(
              (total, faculty) => total + (faculty.study_programs?.length || 0),
              0
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1">Across all faculties</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured Faculties</h2>
          </div>
          <p className="text-3xl font-bold">
            {faculties.filter((f) => f.featured).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Highlighted faculties</p>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={facultyToDelete?.facultyName.en || ""}
        uniId={facultyToDelete?._id || ""}
      />
    </div>
  );
}
