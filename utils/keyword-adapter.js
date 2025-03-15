/**
 * This utility function helps adapt different keyword data structures
 * to a consistent format that the SearchBar component can use.
 */
export const adaptKeywordData = (rawData) => {
  if (!rawData || !Array.isArray(rawData)) {
    console.warn("Invalid keyword data provided");
    return [];
  }

  try {
    // Check if the data is already in the expected format
    if (rawData.length > 0 && rawData[0].keyword && rawData[0].type) {
      return rawData;
    }

    // Handle the nested structure where each item has a type and data array
    const adaptedData = [];

    rawData.forEach((category) => {
      if (!category || !category.type || !Array.isArray(category.data)) {
        return;
      }

      // For other types (blog, country, university, course, etc.)

      category.data.forEach((item) => {
        if (Array.isArray(item.keywords)) {
          item.keywords.forEach((keyword) => {
            adaptedData.push({
              type: category.type,
              keyword: keyword,
              _id: item._id || null,
            });
          });
        }
      });
    });

    return adaptedData;
  } catch (error) {
    console.error("Error adapting keyword data:", error);
    return [];
  }
};
