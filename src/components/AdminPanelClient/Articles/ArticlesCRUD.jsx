"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Star,
  Calendar,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import axios from "axios";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";

export default function ArticlesCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Articles data state
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    featuredArticles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles with pagination
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://edu-brink-backend.vercel.app/api/blog/?admin=true&limit=${itemsPerPage}&page=${currentPage}&fields=blogTitle,blogSubtitle,blogPhoto,blogAuthor,blogCategory,featuredBlog,blogCountry.countryName,blogAdded,publishImmediately,blogTags`
      );

      setArticles(response.data.data || []);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalBlogs);

      if (response.data.stats) {
        setStats({
          totalArticles: response.data.stats.totalArticles || 0,
          publishedArticles: response.data.stats.publishedArticles || 0,
          featuredArticles: response.data.stats.featuredArticles || 0,
        });
      }

      setError(null);
    } catch (err) {
      setError("Failed to fetch articles. Please try again.");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch when pagination params change
  useEffect(() => {
    fetchArticles();
  }, [currentPage, itemsPerPage]);

  const handleDelete = (article) => {
    setArticleToDelete(article);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!articleToDelete) return;

    try {
      await axios.delete(`https://edu-brink-backend.vercel.app/api/blog/${id}`);
      setIsDeletePopupOpen(false);
      setArticleToDelete(null);
      fetchArticles(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const togglePublished = async (article) => {
    try {
      await axios.put(
        `https://edu-brink-backend.vercel.app/api/blog/${article._id}`,
        {
          publishImmediately: !article.publishImmediately,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      fetchArticles(); // Refresh data after update
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };

  // Handle search - we'll implement client-side filtering for the current page
  const filteredArticles =
    searchQuery.trim() === ""
      ? articles
      : articles.filter(
          (article) =>
            article?.blogTitle?.en
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            article?.blogTitle?.ar
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            article?.blogCategory
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            article?.blogAuthor
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        );

  // Pagination controls
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Articles Management</h1>
        <button
          onClick={() => navigate(`/${language}/admin/articles/add`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Items per page:
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
                className="border rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              >
                {[10, 20, 30, 40, 50].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-0">
          {loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}

          {!loading && filteredArticles.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No articles found matching your search.
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article._id}
                className="flex items-center p-4 hover:bg-gray-50 border-b last:border-b-0"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                  <img
                    src={article.blogPhoto || "https://placehold.co/20x20"}
                    alt={article.blogTitle?.[language] || "Article"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {article.blogTitle?.[language] || "Untitled"}
                    </h3>
                    {article.featuredBlog && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    <span
                      className={`${
                        article.publishImmediately
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      } text-xs px-2 py-1 rounded-full`}
                    >
                      {article.publishImmediately ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-1" />
                      {article.blogCategory || "Uncategorized"}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {article.blogAdded}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="w-4 h-4 mr-1" />
                      {article.blogAuthor || "N/A"}
                    </div>
                  </div>
                  {article.blogTags &&
                    article.blogTags[language]?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {article.blogTags[language].map((tag) => (
                          <span
                            key={tag}
                            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublished(article)}
                    className={`${
                      article.publishImmediately
                        ? "text-green-600 hover:text-green-800"
                        : "text-gray-600 hover:text-gray-800"
                    } px-3 py-1`}
                  >
                    {article.publishImmediately ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/${language}/admin/articles/${article._id}`)
                    }
                    className="text-blue-600 hover:text-blue-800 px-3 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    className="text-red-600 hover:text-red-800 px-3 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
              articles
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : page === "..."
                      ? "text-gray-500 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Articles</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalArticles}</p>
          <p className="text-sm text-gray-500 mt-1">All articles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Published</h2>
          </div>
          <p className="text-3xl font-bold">{stats.publishedArticles}</p>
          <p className="text-sm text-gray-500 mt-1">Live articles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured</h2>
          </div>
          <p className="text-3xl font-bold">{stats.featuredArticles}</p>
          <p className="text-sm text-gray-500 mt-1">Featured articles</p>
        </div>
      </div>

      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={articleToDelete?.blogTitle?.en || ""}
        uniId={articleToDelete?._id || ""}
      />
    </div>
  );
}
