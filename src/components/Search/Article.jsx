import React, { useEffect, useRef, useState } from "react";
import blogImage from "../../assets/Blog1.png";
import blogImage2 from "../../assets/Blog2.png";
import blogImage3 from "../../assets/Blog3.png";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../utils/Loader";
import useFetch from "../../../hooks/useFetch";
import { useSearch } from "../../../context/SearchContext";
import { useLanguage } from "../../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import axios from "axios";

function Article({
  loading: initialLoading,
  filteredData: initialData,
  countryIds,
}) {
  const { language } = useLanguage();
  const { filterProp } = useSearch();
  const { t } = useTranslation();
  const [blogs, setBlogs] = useState(initialData || []);
  const [loading, setLoading] = useState(initialLoading);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  // Keep track of previous filter state to detect changes
  const filterPropRef = useRef(filterProp);

  // API base URL
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";

  // Reset pagination and blogs when filters change
  useEffect(() => {
    // Check if filterProp has changed
    if (JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp)) {
      // Update the ref
      filterPropRef.current = filterProp;

      // Reset pagination and blogs state
      setBlogs([]); // Clear existing blogs
      setPage(1); // Reset to the first page
      setHasMore(true); // Assume there is more data to fetch
    }

    // If initialData is provided, update the blogs state
    if (initialData) {
      setBlogs(initialData); // Set blogs to the new initialData
      setPage(1); // Reset to the first page
      setHasMore(initialData.length > 0); // Update hasMore based on initialData
    }
  }, [filterProp, initialData]);

  const fetchMoreBlog = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);

      // Create blog filters object with all the necessary filters
      const blogFilters = {
        countryIds: countryIds?.length ? countryIds.join(",") : "",
        page: page + 1, // Next page
      };

      // Make API request with all filters
      const response = await axios.get(`${API_BASE_URL}/blog`, {
        params: blogFilters,
      });

      // Check if we got data back
      if (response.data.data && response.data.data.length > 0) {
        // Append new data to existing blogs, avoiding duplicates
        setBlogs((prevBlogs) => {
          const newBlogs = response.data.data.filter(
            (newBlog) =>
              !prevBlogs.some((prevBlog) => prevBlog._id === newBlog._id)
          );
          return [...prevBlogs, ...newBlogs];
        });

        setPage((prevPage) => prevPage + 1); // Increment page number
        setHasMore(response.data.pagination.hasMore); // Update hasMore
      } else {
        setHasMore(false); // No more data to fetch
      }
    } catch (error) {
      console.error("Error fetching more blogs:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Update loading state when initialLoading changes
  useEffect(() => {
    setLoading(initialLoading);
  }, [initialLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchMoreBlog();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoaderRef = loaderRef.current;

    if (currentLoaderRef) {
      observer.observe(currentLoaderRef);
    }

    return () => {
      if (currentLoaderRef) {
        observer.unobserve(currentLoaderRef);
      }
    };
  }, [hasMore, loadingMore, countryIds, filterProp]);

  const SkeletonLoader = () => {
    return (
      <div className="flex gap-2 ">
        <div className="min-w-[300px] h-[50vh] sm:v-[40vh] md:h-[30vh] lg:h-[70vh] bg-white p-5 pb-0  rounded-3xl shadow-md animate-pulse">
          {/* Skeleton for Image */}
          <div className="h-[55%] w-[100%] bg-gray-300 rounded-2xl"></div>

          {/* Skeleton for 'Study in <Country Name>' Text */}
          <p className="text-[#E82448] text-sm font-semibold mt-4 bg-gray-300 h-4 w-[70%] rounded"></p>

          {/* Skeleton for Blog Title */}
          <h4 className="font-semibold text-lg text-black mt-2 mb-1 bg-gray-300 h-5 w-[60%] rounded"></h4>

          {/* Skeleton for Date and Calendar */}
          <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start">
            {/* Skeleton for Calendar Icon */}
            <div className="h-5 w-5 bg-gray-300 rounded-full mr-2"></div>
            {/* Skeleton for Date */}
            <div className="bg-gray-300 h-4 w-[50%] rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div dir={language === "ar" ? "rtl" : "ltr"} className="mt-11 text-black">
        <div className="max-w-[1240px] mx-auto">
          <h1 className="text-start text-3xl sm:text-4xl mb-4 font-semibold pl-4">
            {t("recentBlog.title")}
          </h1>

          <p
            className={`${
              language === "ar"
                ? " px-0 pl-1 md:pl-[39%]"
                : " px-0 pl-4 pr-1 md:pr-[39%]"
            } text-start font-normal text-sm sm:text-[.8rem] `}
          >
            {t("recentBlog.description")}
          </p>
          <div className="w-full hidden sm:flex justify-end items-center px-4">
            <Link to={`/${language}/searchresults/AllBlogs`}>
              <button className="bg-white shadow-sm hover:shadow-lg text-black text-sm font-normal py-1 px-4  rounded-full">
                {t("viewAll")}
              </button>
            </Link>{" "}
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4  py-6 ">
            <SkeletonLoader /> <SkeletonLoader /> <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4  py-6 ">
            {/* First Slide */}
            {blogs?.map((card, idx) => (
              <div
                key={idx}
                className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
              >
                {/* SVG and Image */}
                <div className="h-[55%] w-[100%]">
                  <img
                    src={"https://placehold.co/260x220" || card?.blogPhoto}
                    alt={`Slide ${idx + 1}`}
                    className="w-[100%] h-[100%] rounded-2xl object-cover"
                  />
                </div>

                <p className="text-[#E82448] text-sm font-semibold mt-4 ">
                  {language === "ar"
                    ? `الدراسة في ${
                        card?.blogCountry?.countryName?.ar || "غير متوفر"
                      }`
                    : `Study in ${card?.blogCountry?.countryName?.en || "N/A"}`}
                </p>

                <h4 className="font-semibold text-lg text-black mt-2 mb-1">
                  {language === "ar"
                    ? card?.blogTitle?.ar
                    : card?.blogTitle?.en}
                </h4>
                <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start ">
                  <Calander />
                  {card.blogAdded
                    ? new Date(card.blogAdded).toLocaleDateString()
                    : "Date not available"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Loading indicator at the bottom */}
      {hasMore && blogs?.length > 0 && (
        <div className="flex justify-center w-full py-4">
          <div
            ref={loaderRef}
            className={`flex items-center justify-center ${
              loadingMore ? "block" : "hidden"
            }`}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      )}

      {/* No results message */}
      {!loading && blogs?.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-lg text-gray-500">
            {t("noCoursesFound") ||
              "No courses found. Try adjusting your filters."}
          </p>
        </div>
      )}
    </>
  );
}

export default Article;
