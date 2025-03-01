import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  FileText,
  Star,
  Calendar,
  Tag,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../../../context/LanguageContext";
import useApiData from "../../../../hooks/useApiData";
import DeleteConfirmationPopup from "../../../../utils/DeleteConfirmationPopup";
import axios from "axios";

export default function ArticlesCRUD() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const baseUrl = isDeletePopupOpen
    ? `https://edu-brink-backend.vercel.app/api/blog`
    : `https://edu-brink-backend.vercel.app/api/blog?admin=true"`;

  const { data: articles, error, loading, deleteById } = useApiData(baseUrl);

  const handleDelete = (university) => {
    setArticleToDelete(university);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!articleToDelete) return;

    try {
      await deleteById(id);
      setIsDeletePopupOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error("Error deleting university:", error);
    }
  };

  const togglePublished = async (article) => {
    try {
      const response = await axios.put(
        `https://edu-brink-backend.vercel.app/api/blog/${article._id}`,
        {
          publishImmediately: !article.publishImmediately,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Article updated:", response.data);

      fetchData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating article:", error);
    }
  };
  const filteredArticles = articles.filter(
    (article) =>
      article?.blogTitle?.en
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      article?.blogCategory
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      article?.blogAuthor?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <div className="flex gap-4">
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
          </div>
        </div>

        <div className="p-0">
          {filteredArticles.length === 0 ? (
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
                    alt={article.blogTitle[language]}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">
                      {article.blogTitle[language]}
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
                      {new Date(article.blogAdded).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Tag className="w-4 h-4 mr-1" />
                      {article.blogAuthor || "N/A"}
                    </div>
                  </div>
                  {article.blogTags &&
                    article.blogTags[language].length > 0 && (
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Total Articles</h2>
          </div>
          <p className="text-3xl font-bold">{articles.length}</p>
          <p className="text-sm text-gray-500 mt-1">All articles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold">Published</h2>
          </div>
          <p className="text-3xl font-bold">
            {articles.filter((a) => a.publishImmediately).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Live articles</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Featured</h2>
          </div>
          <p className="text-3xl font-bold">
            {articles.filter((a) => a.featuredBlog).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Featured articles</p>
        </div>
      </div>
      <DeleteConfirmationPopup
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        uniName={articleToDelete?.blogTitle.en || ""}
        uniId={articleToDelete?._id || ""}
      />
    </div>
  );
}
