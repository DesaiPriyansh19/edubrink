import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  BookOpenCheck,
  Users,
  Clock,
  Bookmark,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";

export default function CourseCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          university:universities(
            name,
            country:countries(name)
          )
        `
        )
        .order("name");

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.university?.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-bold">Courses Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/courses/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Course
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
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-0">
          {filteredCourses.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No courses found matching your search.
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{course.name}</h3>
                    {course.most_popular && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    {course.scholarships_available && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Scholarships
                      </span>
                    )}
                    {course.discount_available && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Discount
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpenCheck className="w-4 h-4 mr-1" />
                      {course.university?.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.study_levels?.map((level) => (
                      <span
                        key={level}
                        className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded-full"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
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
            <BookOpenCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Courses</h2>
          </div>
          <p className="text-3xl font-bold">{courses.length}</p>
          <p className="text-sm text-gray-500 mt-1">Across all universities</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">With Scholarships</h2>
          </div>
          <p className="text-3xl font-bold">
            {courses.filter((c) => c.scholarships_available).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Courses offering scholarships
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bookmark className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Most Popular</h2>
          </div>
          <p className="text-3xl font-bold">
            {courses.filter((c) => c.most_popular).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Popular courses</p>
        </div>
      </div>
    </div>
  );
}
