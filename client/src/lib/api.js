// Fetch menu data from TheMealDB API
export async function fetchMenuData() {
  try {
    // Fetch different categories
    const categories = ["Starter", "Beef", "Chicken", "Dessert", "Vegetarian"];
    const menuByCategory = {};

    for (const category of categories) {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      const data = await response.json();
      
      // Add price and description (since API doesn't provide these)
      const processedMeals = data.meals.slice(0, 6).map(meal => ({
        ...meal,
        price: (Math.random() * 20 + 5).toFixed(2),
        description: `Delicious ${category.toLowerCase()} prepared with fresh ingredients and advanced culinary techniques.`,
        category: category,
        rating: (4 + Math.random()).toFixed(1),
        prepTime: Math.floor(Math.random() * 20 + 10) + ' min'
      }));
      
      menuByCategory[category] = processedMeals;
    }
    
    return menuByCategory;
  } catch (error) {
    console.error("Error fetching menu data:", error);
    throw error;
  }
} 