import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Clock,
  ChefHat,
  Star,
  Heart,
  Edit,
  Trash2,
  User,
  Calendar,
  Flame,
  Award,
  ArrowLeft
} from 'lucide-react'
import { recipeAPI, type Recipe } from '../api/recipes'
import { commentAPI, type Comment } from '../api/comments'
import type { User as UserType } from '../api/auth'
import { Layout } from '../components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, useToast } from '../components/ui'
import { RecipeDetailSkeleton } from '../components/ui/SkeletonLoader'
import CommentList from '../components/CommentList'
import CommentForm from '../components/CommentForm'

interface RecipeDetailProps {
  user: UserType | null
}

const RecipeDetail = ({ user }: RecipeDetailProps) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittingRating, setSubmittingRating] = useState(false)
  const [favoriting, setFavoriting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
      fetchComments(id);
    }
  }, [id]);

  const fetchRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const recipeData = await recipeAPI.getRecipe(recipeId);
      setRecipe(recipeData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch recipe');
      console.error('Error fetching recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (recipeId: string) => {
    try {
      setCommentsLoading(true);
      const response = await commentAPI.getComments(recipeId);
      setComments(response.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
  };

  const handleRating = async (score: number) => {
    if (!user || !recipe) return

    try {
      setSubmittingRating(true)
      await recipeAPI.rateRecipe(recipe._id, score)
      // Refresh recipe to get updated rating
      await fetchRecipe(recipe._id)
      toast.success('Rating submitted!', 'Thank you for rating this recipe.')
    } catch (err) {
      console.error('Error rating recipe:', err)
      toast.error('Failed to submit rating', 'Please try again.')
    } finally {
      setSubmittingRating(false)
    }
  }

  const handleFavorite = async () => {
    if (!user || !recipe) return

    try {
      setFavoriting(true)
      const response = await recipeAPI.toggleFavorite(recipe._id)
      toast.success(
        response.isFavorited ? 'Added to favorites!' : 'Removed from favorites',
        response.isFavorited ? 'Recipe added to your favorites.' : 'Recipe removed from your favorites.'
      )
    } catch (err) {
      console.error('Error toggling favorite:', err)
      toast.error('Failed to update favorite', 'Please try again.')
    } finally {
      setFavoriting(false)
    }
  }

  const handleDelete = async () => {
    if (!recipe || !user) return

    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeAPI.deleteRecipe(recipe._id)
        toast.success('Recipe deleted', 'The recipe has been successfully deleted.')
        navigate('/')
      } catch (err) {
        console.error('Error deleting recipe:', err)
        toast.error('Failed to delete recipe', 'Please try again.')
      }
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const renderStars = (currentRating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        disabled={!interactive || submittingRating}
        onClick={() => interactive && handleRating(i + 1)}
        className={`${
          interactive ? 'hover:scale-110 transition-transform cursor-pointer' : ''
        } ${!interactive ? 'pointer-events-none' : ''}`}
      >
        <Star
          className={`h-6 w-6 ${
            i < Math.floor(currentRating)
              ? 'text-amber-400 fill-current'
              : 'text-neutral-300'
          }`}
        />
      </button>
    ))
  }

  if (loading) {
    return (
      <Layout user={user || undefined}>
        <div className="max-w-4xl mx-auto py-10">
          <RecipeDetailSkeleton />
        </div>
      </Layout>
    )
  }

  if (error || !recipe) {
    return (
      <Layout user={user || undefined}>
        <div className="max-w-4xl mx-auto py-10">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="text-6xl mb-4">😞</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {error || 'Recipe not found'}
                </h3>
                <p className="text-neutral-600 mb-6">
                  The recipe you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Recipes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  const isOwner = user && recipe.createdBy._id === user.id
  const userRating = user ? recipe.ratings.find(r => r.user._id === user.id)?.score || 0 : 0

  return (
    <Layout user={user || undefined}>
      <div className="max-w-4xl mx-auto py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden">
            {/* Recipe Image Header */}
            <div className="relative">
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-64 md:h-80 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-amber-400" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                {user && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleFavorite}
                    loading={favoriting}
                    className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                )}

                {isOwner && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={handleDelete}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Recipe Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{recipe.title}</h1>
                <div className="flex items-center text-white/90 text-sm">
                  <User className="h-4 w-4 mr-1" />
                  <span>by {recipe.createdBy.username}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-6 md:p-8">
              {/* Recipe Meta Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-sm text-neutral-600">Cooking Time</div>
                  <div className="font-semibold text-neutral-900">{formatTime(recipe.cookingTime)}</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-sm text-neutral-600">Difficulty</div>
                  <div className="font-semibold text-neutral-900">{recipe.difficulty}</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl">
                  <ChefHat className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-sm text-neutral-600">Cuisine</div>
                  <div className="font-semibold text-neutral-900">{recipe.cuisine}</div>
                </div>
                {recipe.calories && (
                  <div className="text-center p-4 bg-neutral-50 rounded-xl">
                    <Flame className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-sm text-neutral-600">Calories</div>
                    <div className="font-semibold text-neutral-900">{recipe.calories}</div>
                  </div>
                )}
              </div>

              {/* Diet Badge */}
              {recipe.diet !== 'None' && (
                <div className="mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {recipe.diet}
                  </span>
                </div>
              )}

              {/* Rating Section */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {renderStars(recipe.averageRating)}
                        </div>
                        <span className="text-xl font-semibold text-neutral-900">
                          {recipe.averageRating.toFixed(1)}
                        </span>
                        <span className="text-neutral-600">
                          ({recipe.ratings.length} {recipe.ratings.length === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>

                      {user && !isOwner && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-neutral-700 mb-2">Rate this recipe:</p>
                          <div className="flex items-center space-x-1">
                            {renderStars(userRating, true)}
                            {userRating > 0 && (
                              <span className="text-sm text-neutral-600 ml-2">
                                Your rating: {userRating} star{userRating !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              </Card>

              {/* Ingredients and Instructions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ChefHat className="mr-2 h-5 w-5 text-amber-600" />
                      Ingredients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {recipe.ingredients.map((ingredient, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <div>
                            <span className="font-medium text-neutral-900">
                              {ingredient.amount} {ingredient.unit}
                            </span>
                            <span className="text-neutral-700 ml-2">{ingredient.name}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Instructions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-amber-600" />
                      Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4">
                      {recipe.steps.map((step, index) => (
                        <motion.li
                          key={step.stepNumber}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 mt-0.5">
                            {step.stepNumber}
                          </div>
                          <p className="text-neutral-700 leading-relaxed">{step.instruction}</p>
                        </motion.li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Comments & Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <CommentForm
                    recipeId={recipe._id}
                    user={user}
                    onCommentAdded={handleCommentAdded}
                  />

                  {commentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
                      <span className="ml-2 text-neutral-600">Loading comments...</span>
                    </div>
                  ) : (
                    <CommentList
                      comments={comments}
                      recipeId={recipe._id}
                      user={user}
                      recipeOwnerId={recipe.createdBy._id}
                      onCommentDeleted={handleCommentDeleted}
                    />
                  )}
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}

export default RecipeDetail
