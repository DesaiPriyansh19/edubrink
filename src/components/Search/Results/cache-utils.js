/**
 * Utility functions for managing session storage cache
 */

// Set a cache item with optional expiration time (in minutes)
export const setCacheItem = (key, data, expirationMinutes = 30) => {
    const item = {
      data,
      expiry: expirationMinutes ? Date.now() + expirationMinutes * 60 * 1000 : null,
    }
  
    try {
      sessionStorage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      // Handle storage quota exceeded
      console.error("Session storage error:", error)
  
      // If storage is full, clear older items
      if (error.name === "QuotaExceededError") {
        clearOldCache()
        try {
          sessionStorage.setItem(key, JSON.stringify(item))
          return true
        } catch (retryError) {
          console.error("Failed to store data after clearing cache:", retryError)
        }
      }
      return false
    }
  }
  
  // Get a cache item, returns null if expired or not found
  export const getCacheItem = (key) => {
    const itemStr = sessionStorage.getItem(key)
  
    if (!itemStr) {
      return null
    }
  
    try {
      const item = JSON.parse(itemStr)
  
      // Check if the item has expired
      if (item.expiry && Date.now() > item.expiry) {
        sessionStorage.removeItem(key)
        return null
      }
  
      return item.data
    } catch (error) {
      console.error("Error parsing cached item:", error)
      sessionStorage.removeItem(key)
      return null
    }
  }
  
  // Clear cache items that match a prefix
  export const clearCacheByPrefix = (prefix) => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        sessionStorage.removeItem(key)
      }
    })
  }
  
  // Clear all cache items
  export const clearAllCache = () => {
    sessionStorage.clear()
  }
  
  // Clear old cache items to free up space
  export const clearOldCache = () => {
    const cacheItems = []
  
    // Collect all cache items with their keys and expiry times
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      try {
        const itemStr = sessionStorage.getItem(key)
        const item = JSON.parse(itemStr)
  
        cacheItems.push({
          key,
          expiry: item.expiry || Number.POSITIVE_INFINITY,
          timestamp: item.timestamp || 0,
        })
      } catch (error) {
        // Skip invalid items
      }
    }
  
    // Sort by expiry (oldest first) or timestamp if no expiry
    cacheItems.sort((a, b) => {
      if (a.expiry !== Number.POSITIVE_INFINITY && b.expiry !== Number.POSITIVE_INFINITY) {
        return a.expiry - b.expiry
      }
      return a.timestamp - b.timestamp
    })
  
    // Remove the oldest 20% of items
    const itemsToRemove = Math.ceil(cacheItems.length * 0.2)
    cacheItems.slice(0, itemsToRemove).forEach((item) => {
      sessionStorage.removeItem(item.key)
    })
  }
  
  