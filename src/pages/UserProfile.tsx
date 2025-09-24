import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeAPI, type Recipe } from '../api/recipes';
import { authAPI, type User } from '../api/auth';

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [publishedRecipes, setPublishedRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'favorites'>('published');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchUserData(currentUser.id);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      
      // Fetch published recipes
      const publishedResponse = await recipeAPI.getRecipes({
        createdBy: userId,
        limit: 50,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setPublishedRecipes(publishedResponse.recipes);

      // Fetch favorite recipes
      const favoritesResponse = await recipeAPI.getFavorites(1, 50);
      setFavoriteRecipes(favoritesResponse.recipes);
      
      setError(null);
    } catch (err: any) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ⭐
      </span>
    ));
  };

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link
      to={`/recipe/${recipe._id}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-neutral-100 group"
    >
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
          <span className="text-amber-400 text-4xl">🍽️</span>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
          {recipe.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
          <span className="flex items-center">
            ⏱️ {formatTime(recipe.cookingTime)}
          </span>
          <span className="flex items-center">
            📊 {recipe.difficulty}
          </span>
          <span className="text-amber-600 font-medium">
            {recipe.cuisine}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {renderStars(recipe.averageRating)}
            <span className="text-sm text-neutral-600 ml-1">
              ({recipe.ratings.length})
            </span>
          </div>
          
          {recipe.diet !== 'None' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {recipe.diet}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 mb-4">Please log in to view your profile</p>
        <Link
          to="/login"
          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.username}!</h1>
            <p className="opacity-90">
              Manage your recipes and discover new favorites
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{publishedRecipes.length}</div>
            <div className="text-sm opacity-90">Recipes Created</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/create-recipe"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 text-center group"
        >
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📝</div>
          <h3 className="font-semibold text-neutral-900 mb-1">Create Recipe</h3>
          <p className="text-neutral-600 text-sm">Share your culinary creations</p>
        </Link>
        
        <button
          onClick={() => setActiveTab('published')}
          className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border text-center ${
            activeTab === 'published'
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-white border-neutral-100 text-neutral-700'
          }`}
        >
          <div className="text-3xl mb-3">👨‍🍳</div>
          <h3 className="font-semibold mb-1">My Recipes</h3>
          <p className="text-sm opacity-75">{publishedRecipes.length} published</p>
        </button>
        
        <button
          onClick={() => setActiveTab('favorites')}
          className={`p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border text-center ${
            activeTab === 'favorites'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-neutral-100 text-neutral-700'
          }`}
        >
          <div className="text-3xl mb-3">❤️</div>
          <h3 className="font-semibold mb-1">Favorites</h3>
          <p className="text-sm opacity-75">{favoriteRecipes.length} saved</p>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        {/* Tab Headers */}
        <div className="border-b border-neutral-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('published')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'published'
                  ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Published Recipes ({publishedRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Favorite Recipes ({favoriteRecipes.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="bg-neutral-100 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => user && fetchUserData(user.id)}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Published Recipes */}
              {activeTab === 'published' && (
                <>
                  {publishedRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                        No recipes yet
                      </h3>
                      <p className="text-neutral-600 mb-6">
                        Start sharing your culinary creations with the world!
                      </p>
                      <Link
                        to="/create-recipe"
                        className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                      >
                        Create Your First Recipe
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {publishedRecipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Favorite Recipes */}
              {activeTab === 'favorites' && (
                <>
                  {favoriteRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-neutral-600 mb-6">
                        Explore recipes and add your favorites here!
                      </p>
                      <Link
                        to="/"
                        className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Browse Recipes
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteRecipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
