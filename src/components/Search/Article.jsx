import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const navigate = useNavigate();

  // State for infinite scrolling
  const [blogs, setBlogs] = useState(initialData || []);
  const [loading, setLoading] = useState(initialLoading);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialFetch, setInitialFetch] = useState(true);
  const observer = useRef(null);
  const loaderRef = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  // Keep track of previous filter state to detect changes
  const filterPropRef = useRef(filterProp);
  const initialDataRef = useRef(null);

  // API base URL
  const API_BASE_URL = "https://edu-brink-backend.vercel.app/api/search";

  // Reset pagination and blogs when filters change or initialData updates
  useEffect(() => {
    const isFilterChanged =
      JSON.stringify(filterPropRef.current) !== JSON.stringify(filterProp);

    // Always update blogs when initialData changes, even if it's empty
    if (initialData !== initialDataRef.current) {
      initialDataRef.current = initialData;
      setBlogs(initialData || []);
      setPage(1);
      setHasMore((initialData || []).length > 0);
      setInitialFetch(false); // Mark initial fetch as complete when we get data
    }

    if (isFilterChanged) {
      filterPropRef.current = filterProp;
      setPage(1);
      setHasMore(true);
      setInitialFetch(true); // Reset initial fetch when filters change
    }
  }, [filterProp, initialData]);

  // Update loading state when initialLoading changes
  useEffect(() => {
    setLoading(initialLoading);
  }, [initialLoading]);

  // Function to fetch more blogs - use useCallback to maintain reference
  const fetchMoreBlog = useCallback(async () => {
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
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevBlogs.map((blog) => [blog._id, true])
          );
          // Filter out duplicates
          const newBlogs = response.data.data.filter(
            (blog) => !existingIds.has(blog._id)
          );
          return [...prevBlogs, ...newBlogs];
        });

        setPage(page + 1);
        setHasMore(response.data.pagination.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more blogs:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, countryIds, page]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if loading, there's no more data, or we're still in initial fetch
    if (!hasMore || initialFetch) {
      return;
    }

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Use a debounced version of fetchMoreBlog to prevent multiple rapid calls
    let timeoutId = null;
    const debouncedFetch = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!loadingMore && hasMore) {
          setFetchTrigger((prev) => prev + 1);
        }
      }, 300);
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        debouncedFetch();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "200px",
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, initialFetch]);

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loadingMore && hasMore && !initialFetch) {
      fetchMoreBlog();
    }
  }, [fetchTrigger, loadingMore, hasMore, initialFetch, fetchMoreBlog]);

  // Force check for scroll position after initial data load
  useEffect(() => {
    if (!initialFetch && hasMore && !loadingMore) {
      const timeoutId = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // If the content doesn't fill the viewport, trigger a fetch
        if (scrollHeight <= clientHeight) {
          setFetchTrigger((prev) => prev + 1);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [initialFetch, hasMore, loadingMore]);

  // Reset component state when unmounting
  useEffect(() => {
    return () => {
      // Clean up everything when component unmounts
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  const SkeletonLoader = () => {
    return (
      <div className="flex gap-2 ">
        <div className="min-w-[300px] h-[50vh] sm:v-[40vh] md:h-[30vh] lg:h-[70vh] bg-white p-5 pb-0  rounded-3xl shadow-md ">
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 ">
            {/* First Slide */}
            {blogs?.map((blog, idx) => (
               <div
               key={blog._id}
               onClick={() => handleNavigate(blog.customURLSlug[language])}
               className="blog-card"
               data-aos="fade-up"
               data-aos-delay={100}
             >
               {/* Image container */}
               <div className="blog-card-image">
                 <img
                   src={"https://placehold.co/600x400" || blog?.blogPhoto}
                   alt={blog?.blogTitle?.[language]}
                 />
               </div>

               <div className="blog-card-content">
                 {/* Country name */}
                 <p className="blog-card-country">
                   {language === "ar"
                     ? `الدراسة في ${
                         blog?.blogCountry?.countryName?.ar || "غير متوفر"
                       }`
                     : `Study in ${
                         blog?.blogCountry?.countryName?.en || "N/A"
                       }`}
                 </p>

                 {/* Blog title */}
                 <h4 className="blog-card-title">
                   {language === "ar"
                     ? blog?.blogTitle?.ar
                     : blog?.blogTitle?.en}
                 </h4>

                 {/* Date */}
                 <div className="blog-card-date">
                   <Calander />
                   <span>
                     {blog.blogAdded
                       ? new Date(blog.blogAdded).toLocaleDateString()
                       : "Date not available"}
                   </span>
                 </div>
               </div>
             </div>
            ))}
          </div>
        )}
      </div>
      {/* Loading indicator at the bottom */}
      {hasMore && blogs?.length > 0 && (
        <div
          ref={loaderRef}
          className="w-full flex justify-center py-4 mt-2"
          style={{ minHeight: "80px" }}
        >
          <div
            className={`animate-spin rounded-full h-8 w-8 border-b-2 border-primary ${
              loadingMore ? "opacity-100" : "opacity-50"
            }`}
          ></div>
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
