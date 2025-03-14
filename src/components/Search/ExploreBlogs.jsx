import React, { useCallback, useEffect, useRef, useState } from "react";
import Calander from "../../../svg/caplogo/Logo/Calander/Index";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ExploreBlogs({ language }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [blogs, setblogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [initialFetch, setInitialFetch] = useState(true);
  const observer = useRef(null);
  const loadingRef = useRef(null);

  const fetchblogs = useCallback(async () => {
    // Don't fetch if we're already loading or there's no more data (except for initial fetch)
    if (loading || (!hasNextPage && !initialFetch)) return;

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
      console.log(response);

      const result = await response.json();

      if (initialFetch) {
        setblogs(result.data);
        setInitialFetch(false);
      } else {
        setblogs((prev) => [...prev, ...result.data]);
      }

      setLastId(result.meta.lastId);
      setHasNextPage(result.meta.hasNextPage);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [lastId, hasNextPage, initialFetch, loading]);

  useEffect(() => {
    // Only fetch initial data once when component mounts
    if (initialFetch) {
      fetchblogs();
    }
  }, [initialFetch]);

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're already loading or there's no more data
    if (loading || !hasNextPage) return;

    // Disconnect previous observer if it exists
    if (observer.current) observer.current.disconnect();

    const callback = (entries) => {
      // Only fetch more if we're not already loading, there's more data, and the element is intersecting
      if (
        entries[0].isIntersecting &&
        hasNextPage &&
        !loading &&
        !initialFetch
      ) {
        fetchblogs();
      }
    };

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "100px",
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasNextPage, fetchblogs, initialFetch]);

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
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4  py-6 "
      >
        {/* First Slide */}
        {blogs?.map((blog, idx) => (
          <div
            key={idx}
            className="min-w-[300px] bg-white p-5 pb-0 h-auto rounded-3xl shadow-md"
          >
            {/* SVG and Image */}
            <div className="h-[55%] w-[100%]">
              <img
                src={"https://placehold.co/260x220" || blog?.blogPhoto}
                alt={`Slide ${idx + 1}`}
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
        {/* Loading skeletons */}
        {loading &&
          Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="relative mt-6 border rounded-xl shadow-md bg-white max-w-full animate-pulse"
            >
              <div className="p-4 sm:p-6">
                <div
                  className={`absolute top-0 right-0 rounded-bl-[4px] rounded-tr-xl bg-gray-300 h-6 w-24`}
                ></div>

                <div className="flex gap-3 sm:gap-4 items-center mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-300 rounded-md w-40 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-32 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-md w-36"></div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-5 items-center sm:gap-3 justify-start sm:justify-center mr-10">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 justify-center"
                    >
                      <div className="rounded-full w-10 h-10 bg-gray-300"></div>
                      <div>
                        <div className="h-3 bg-gray-300 rounded-md w-16 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded-md w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-300"></div>

              <div className="grid gap-6 px-3 grid-cols-2 mb-6 mt-4">
                <div className="h-10 bg-gray-300 rounded-full"></div>
                <div className="h-10 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}

        {/* Loading reference element - this is what the IntersectionObserver watches */}
        {hasNextPage && <div ref={loadingRef} className="h-10 w-full" />}
      </div>

      {hasNextPage && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={fetchblogs}
            className="px-6 py-2 bg-gradient-to-r from-[#380C95] to-[#E15754] text-white rounded-full"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* No more universities message */}
      {!hasNextPage && blogs.length > 0 && (
        <p className="text-center mt-8 text-gray-500">{t("No More Blogs")}</p>
      )}
    </div>
  );
}

export default ExploreBlogs;
