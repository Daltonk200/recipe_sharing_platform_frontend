import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Filter, 
  Clock, 
  ChefHat, 
  Star, 
  Users,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react'
import { Layout } from '../components/layout'
import { Card, Button } from '../components/ui'
import { authAPI } from '../api/auth'
import { recipeAPI, type Recipe, type RecipeFilters } from '../api/recipes'

interface HomeProps {
  onLogout?: () => void
}

const Home: React.FC<HomeProps> = ({ onLogout }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<RecipeFilters>({
    page: 1,
    limit: 12
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecipes: 0,
    hasNextPage: false,
    hasPrevPage: false
  })

  const user = authAPI.getCurrentUser()

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await recipeAPI.getRecipes(filters)
      setRecipes(response.recipes)
      setPagination(response.pagination)
      setError(null)
    } catch (err) {
      setError('Failed to fetch recipes')
      console.error('Error fetching recipes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [filters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters({
      ...filters,
      search: query,
      page: 1
    })
  }

  const handleFilterChange = (key: keyof RecipeFilters, value: string | number) => {
    setFilters({ ...filters, [key]: value, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-amber-400 fill-current'
            : 'text-neutral-300'
        }`}
      />
    ))
  }

  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden group cursor-pointer">
        <Link to={`/recipe/${recipe._id}`}>
          <div className="relative overflow-hidden">
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                <ChefHat className="h-12 w-12 text-amber-400" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              {recipe.diet !== 'None' && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                  {recipe.diet}
                </span>
              )}
            </div>
          </div>
          
          <div className="p-5">
            <h3 className="font-semibold text-neutral-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors">
              {recipe.title}
            </h3>
            
            <div className="flex items-center justify-between text-sm text-neutral-600 mb-3">
              <div className="flex items-center space-x-3">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(recipe.cookingTime)}
                </span>
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {recipe.difficulty}
                </span>
              </div>
              <span className="text-amber-600 font-medium text-xs">
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
              <div className="text-right">
                <p className="text-xs text-neutral-500">
                  by {recipe.createdBy.username}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  )

  const LoadingSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-neutral-200 h-48 rounded-t-lg"></div>
          <div className="p-5 space-y-3">
            <div className="bg-neutral-200 h-4 rounded w-3/4"></div>
            <div className="bg-neutral-200 h-3 rounded w-1/2"></div>
            <div className="bg-neutral-200 h-3 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Layout 
      user={user || undefined} 
      onSearch={handleSearch} 
      searchQuery={searchQuery}
      onLogout={onLogout}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white rounded-3xl p-12 mb-8 shadow-soft">
            <h1 className="text-5xl font-bold mb-4">Discover Amazing Recipes</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Explore thousands of recipes from passionate home cooks around the world. 
              Find your next favorite dish and share your own culinary creations.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="shadow-medium">
                <TrendingUp className="mr-2 h-5 w-5" />
                Trending Recipes
              </Button>
              <Button size="lg" className="bg-white text-amber-600 hover:bg-neutral-50 shadow-medium">
                <Link to="/create-recipe" className="flex items-center">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Share Your Recipe
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-lg mb-4">
              <ChefHat className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">{pagination.totalRecipes}</h3>
            <p className="text-neutral-600">Total Recipes</p>
          </Card>
          <Card className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-lg mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">10K+</h3>
            <p className="text-neutral-600">Active Chefs</p>
          </Card>
          <Card className="text-center p-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">4.8</h3>
            <p className="text-neutral-600">Average Rating</p>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              All Filters
            </Button>
            <select
              value={filters.sortBy || 'createdAt'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="createdAt">Newest First</option>
              <option value="averageRating">Highest Rated</option>
              <option value="cookingTime">Cooking Time</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
          <p className="text-neutral-600">
            Showing {recipes.length} of {pagination.totalRecipes} recipes
          </p>
        </div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8"
          >
            {error}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && recipes.length === 0 ? (
          <LoadingSkeletons />
        ) : (
          <>
            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {recipes.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-8xl mb-6">🍽️</div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-3">No recipes found</h3>
                <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                  We couldn't find any recipes matching your criteria. Try adjusting your search or filters, or be the first to share a recipe!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc' })}
                  >
                    Clear Filters
                  </Button>
                  <Button>
                    <Link to="/create-recipe">Create Recipe</Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                  let page = i + 1
                  if (pagination.totalPages > 5) {
                    const start = Math.max(1, pagination.currentPage - 2)
                    page = start + i
                  }
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? 'default' : 'outline'}
                      onClick={() => handlePageChange(page)}
                      className="min-w-[40px]"
                    >
                      {page}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

export default Home
