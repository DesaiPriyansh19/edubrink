"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Calander from "../../../svg/caplogo/Logo/Calander/Index"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import GradientSpinnerLoader, { BouncingBarsLoader } from "./Results/ImprovedLoaders"

// Create a cache object outside the component to persist between route changes
const blogCache = {
  data: [],
  lastId: null,
  hasNextPage: true,
  language: null,
}

function ExploreBlogs({ language }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState(() => blogCache.data)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(blogCache.data.length === 0)
  const [lastId, setLastId] = useState(blogCache.lastId)
  const [hasNextPage, setHasNextPage] = useState(blogCache.hasNextPage)
  const [initialFetch, setInitialFetch] = useState(blogCache.data.length === 0)
  const observer = useRef(null)
  const loadingRef = useRef(null)
  const [fetchTrigger, setFetchTrigger] = useState(0)

  // Check if language has changed, if so, reset cache
  useEffect(() => {
    if (blogCache.language && blogCache.language !== language) {
      // Language changed, reset cache
      blogCache.data = []
      blogCache.lastId = null
      blogCache.hasNextPage = true

      setBlogs([])
      setLastId(null)
      setHasNextPage(true)
      setInitialFetch(true)
      setInitialLoading(true)
    }

    blogCache.language = language
  }, [language])

  const fetchBlogs = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (loading) return

    try {
      setLoading(true)
      const limit = initialFetch ? 4 : 10 // Changed from 1 to 4 for initial fetch

      console.log("Fetching blogs with lastId:", lastId, "initialFetch:", initialFetch)

      const url = `https://edu-brink-backend.vercel.app/api/blog/getAll/User/Insta?limit=${limit}${
        lastId ? `&lastId=${lastId}` : ""
      }`

      const response = await fetch(url)
      const result = await response.json()

      // Check if we received valid data
      if (!result.data || result.data.length === 0) {
        setHasNextPage(false)
        blogCache.hasNextPage = false
        setLoading(false)
        setInitialLoading(false)
        return
      }

      // Process the new data
      setBlogs((prevBlogs) => {
        let newBlogsList
        if (initialFetch) {
          setInitialFetch(false)
          newBlogsList = result.data
        } else {
          // Create a map of existing IDs for faster lookup
          const existingIds = new Map(prevBlogs.map((blog) => [blog._id, true]))
          // Filter out duplicates
          const newBlogs = result.data.filter((blog) => !existingIds.has(blog._id))
          newBlogsList = [...prevBlogs, ...newBlogs]
        }

        // Update cache
        blogCache.data = newBlogsList
        return newBlogsList
      })

      setLastId(result.meta.lastId)
      blogCache.lastId = result.meta.lastId

      setHasNextPage(result.meta.hasNextPage)
      blogCache.hasNextPage = result.meta.hasNextPage
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }, [lastId, initialFetch, loading])

  // Initial data fetch - only if cache is empty
  useEffect(() => {
    if (initialFetch && blogCache.data.length === 0) {
      setInitialLoading(true)
      fetchBlogs()
    }

    // Cleanup function
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [fetchBlogs, initialFetch])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    // Don't set up observer if we're loading, there's no more data, or we're still in initial fetch
    if (loading || !hasNextPage || initialFetch) {
      return
    }

    // Clean up previous observer
    if (observer.current) {
      observer.current.disconnect()
    }

    // Use a debounced version of fetchBlogs to prevent multiple rapid calls
    let timeoutId = null
    const debouncedFetch = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (!loading && hasNextPage && !initialFetch) {
          setFetchTrigger((prev) => prev + 1) // Trigger a fetch
        }
      }, 300) // 300ms debounce
    }

    const callback = (entries) => {
      if (entries[0].isIntersecting) {
        debouncedFetch()
      }
    }

    observer.current = new IntersectionObserver(callback, {
      rootMargin: "200px", // Increased margin to trigger earlier
      threshold: 0.1,
    })

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loading, hasNextPage, initialFetch, fetchBlogs])

  // Handle fetch trigger
  useEffect(() => {
    if (fetchTrigger > 0 && !loading && hasNextPage && !initialFetch) {
      fetchBlogs()
    }
  }, [fetchTrigger, loading, hasNextPage, initialFetch, fetchBlogs])

  const handleNavigate = (name) => {
    navigate(`/${language}/blog/${name}`)
  }

  // Show full page loader for initial loading
  if (initialLoading) {
    return <BouncingBarsLoader type="gradient" message={t("Loading Blogs...")} />
  }

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"} className="p-4">
      {/* Heading */}
      <h1 className="text-5xl text-center font-semibold mb-2">{t("blog_resources.title")} </h1>

      {/* Description */}
      <p className="text-black font-medium text-sm max-w-md mx-auto text-center mb-24">
        {t("blog_resources.description")}
      </p>

      {/* Dynamic Buttons */}
      <h3 className="text-4xl font-semibold mb-11">{t("recentBlog.title")}</h3>
      <div dir={language === "ar" ? "rtl" : "ltr"} className="grid grid-cols-1  lg:grid-cols-3 xlg:grid-cols-4 gap-20">
        {/* Blog Cards */}
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
              <img src={blog?.blogPhoto || "https://placehold.co/600x400"} alt={blog?.blogTitle?.[language]} />
            </div>

            <div className="blog-card-content">
              {/* Country name */}
              <p className="blog-card-country">
                {language === "ar"
                  ? `الدراسة في ${blog?.blogCountry?.countryName?.ar || "غير متوفر"}`
                  : `Study in ${blog?.blogCountry?.countryName?.en || "N/A"}`}
              </p>

              {/* Blog title */}
              <h4 className="blog-card-title">{language === "ar" ? blog?.blogTitle?.ar : blog?.blogTitle?.en}</h4>

              {/* Date */}
              <div className="blog-card-date">
                <Calander />
                <span>{blog.blogAdded ? new Date(blog.blogAdded).toLocaleDateString() : "Date not available"}</span>
              </div>
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
        {hasNextPage && !loading && <div ref={loadingRef} className="h-20 w-full col-span-1 lg:col-span-3" />}
      </div>

      {hasNextPage && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setFetchTrigger((prev) => prev + 1)}
            className="px-6 py-2 bg-slateBlue text-white rounded-full"
          >
            {t("loadMore")}
          </button>
        </div>
      )}

      {/* No more blogs message */}
      {!hasNextPage && blogs.length > 0 && <p className="text-center mt-8 text-gray-500">{t("No More Blogs")}</p>}
    </div>
  )
}

export default ExploreBlogs

