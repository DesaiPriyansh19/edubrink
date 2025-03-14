/**
 * This utility function helps adapt different keyword data structures
 * to a consistent format that the SearchBar component can use.
 */
export const adaptKeywordData = (rawData) => {
    if (!rawData || !Array.isArray(rawData)) {
      console.warn("Invalid keyword data provided")
      return []
    }
  
    try {
      // Check if the data is already in the expected format
      if (rawData.length > 0 && rawData[0].keyword && rawData[0].type) {
        return rawData
      }
  
      // Handle the nested structure where each item has a type and data array
      const adaptedData = []
  
      rawData.forEach((category) => {
        if (!category || !category.type || !Array.isArray(category.data)) {
          return
        }
  
        // For tag type which has a special structure
        if (category.type === "tag") {
          category.data.forEach((tag) => {
            // Handle both English and Arabic keywords
            const keywords = [
              ...(Array.isArray(tag.keywords?.en) ? tag.keywords.en : []),
              ...(Array.isArray(tag.keywords?.ar) ? tag.keywords.ar : []),
            ]
  
            keywords.forEach((keyword) => {
              adaptedData.push({
                type: "tag",
                keyword: keyword,
                customURLSlug: tag.customURLSlug || null,
              })
            })
          })
        }
        // For other types (blog, country, university, course, etc.)
        else {
          category.data.forEach((item) => {
            if (Array.isArray(item.keywords)) {
              item.keywords.forEach((keyword) => {
                adaptedData.push({
                  type: category.type,
                  keyword: keyword,
                  customURLSlug: item.customURLSlug || null,
                })
              })
            }
          })
        }
      })
  
      return adaptedData
    } catch (error) {
      console.error("Error adapting keyword data:", error)
      return []
    }
  }
  
  