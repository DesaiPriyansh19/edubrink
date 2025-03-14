"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import GradientSpinnerLoader, {
  BouncingBarsLoader,
} from "./Results/ImprovedLoaders";

function ExploreBlogs({ language }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // New state for initial loading
  const [lastId, setLastId] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialFetch, setInitialFetch] = useState(true);
  const observer = useRef(null);
  const loadingRef = useRef(null);
  const [fetchTrigger, setFetchTrigger] = useState(0); // Used to trigger fetches

  const fetchBlogs = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading) return;

    try {
      setLoading(true);
      const limit = initialFetch ? 1 : 5;

      console.log(
        "Fetching blogs with lastId:",
        lastId,
        "initialFetch:",
        initialFetch
      );

      const url = `https://edu-brink-backend.vercel.app/api/blog/getAll/User/Insta?limit=${limit}${
        lastId ? `&lastId=${lastId}` : ""
      }`;

      const response = await fetch(url);
      const result = await response.json();

      // Check if we received valid data
      if (!result.data || result.data.length === 0) {
        setHasNextPage(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      // Process the new data
      setBlogs((prevBlogs) => {
        if (initialFetch) {
          setInitialFetch(false);
          return result.data;
        } else {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(
            prevBlogs.map((blog) => [blog._id, true])
          );
          // Filter out duplicates
          const newBlogs = result.data.filter(
            (blog) => !existingIds.has(blog._id)
          );
          return [...prevBlogs, ...newBlogs];
        }
      });

      setLastId(result.meta.lastId);
      setHasNextPage(result.meta.hasNextPage);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [lastId, initialFetch, loading]);

  // Initial data fetch
  useEffect(() => {
    // Only fetch initial data once when component mounts
    if (initialFetch) {
      setInitialLoading(true);
      fetchBlogs();
    }

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [fetchBlogs, initialFetch]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're loading, there's no more data, or we're still in initial fetch
    if (loading || !hasNextPage || initialFetch) {
      return;
    }

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect();
    }

    // Use a debounced version of fetchBlogs to prevent multiple rapid calls
    let timeoutId = null;
    const debouncedFetch = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!loading && hasNextPage && !initialFetch) {
          setFetchTrigger((prev) => prev + 1); // Trigger a fetch
        }
      }, 300); // 300ms debounce
    };

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        debouncedFetch();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "200px", // Increased margin to trigger earlier
      threshold: 0.1,
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasNextPage, initialFetch, fetchBlogs]);

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loading && hasNextPage && !initialFetch) {
      fetchBlogs();
    }
  }, [fetchTrigger, loading, hasNextPage, initialFetch, fetchBlogs]);

  // Reset component state when unmounting
  useEffect(() => {
    return () => {
      // Clean up everything when component unmounts
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Show full page loader for initial loading
  if (initialLoading) {
    return (
      <BouncingBarsLoader type="gradient" message={t("Loading Blogs...")} />
    );
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center font-semibold mb-2">
        {t("blog_resources.title")}{" "}
      </h1>

      {/* Description */}
      <p className="text-black font-medium text-sm max-w-md mx-auto text-center mb-24">
        {t("blog_resources.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">{t("recentBlog.title")}</h3>
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 py-6"
      >
        {/* Blog Cards */}
        {blogs?.map((blog, idx) => (
          <div
            key={idx}
            className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={"https://placehold.co/260x220" || blog?.blogPhoto}
                alt={`Blog ${idx + 1}`}
                className="w-[100%] h-[100%] rounded-2xl object-cover"
              />
            </div>

            <p className="text-[#E82448] text-sm font-semibold mt-4 ">
              {language === "ar"
                ? `الدراسة في ${
                    blog?.blogCountry?.countryName?.ar || "غير متوفر"
                  }`
                : `Study in ${blog?.blogCountry?.countryName?.en || "N/A"}`}
            </p>

            <h4 className="font-semibold text-lg text-black mt-2 mb-1">
              {language === "ar" ? blog?.blogTitle?.ar : blog?.blogTitle?.en}
            </h4>
            <div className="text-[.9rem] gap-2 pb-8 em:pb-0 font-normal flex items-center justify-start ">
              <Calander />
              {blog.blogAdded
                ? new Date(blog.blogAdded).toLocaleDateString()
                : "Date not available"}
            </div>
          </div>
        ))}

        {/* Loading indicator for more content */}
        {loading && (
          <div className="col-span-1 lg:col-span-3">
            <GradientSpinnerLoader message={t("Loading more blogs...")} />
          </div>
        )}

        {/* Loading reference element - this is what the IntersectionObserver watches */}
        {hasNextPage && !loading && (
          <div
            ref={loadingRef}
            className="h-20 w-full col-span-1 lg:col-span-3"
          />
        )}
      </div>

      {hasNextPage && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setFetchTrigger((prev) => prev + 1)}
            className="px-6 py-2 bg-gradient-to-r from-[#380C95] to-[#E15754] text-white rounded-full"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* No more blogs message */}
      {!hasNextPage && blogs.length > 0 && (
        <p className="text-center mt-8 text-gray-500">{t("No More Blogs")}</p>
      )}
    </div>
  );
}

export default ExploreBlogs;
