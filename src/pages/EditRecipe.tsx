import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeAPI } from '../api/recipes'
import type { Ingredient } from '../api/recipes'
import { uploadAPI } from '../api/upload'
import { Layout } from '../components/layout'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, ImageUploader, useToast } from '../components/ui'
import { authAPI } from '../api/auth'

interface RecipeFormData {
  title: string
  ingredients: string
  steps: string
  cookingTime: number
  calories: number
  cuisine: string
  diet: string
  difficulty: string
  image: string
}

const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const user = authAPI.getCurrentUser()

  // Form state
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    ingredients: '',
    steps: '',
    cookingTime: 0,
    calories: 0,
    cuisine: '',
    diet: '',
    difficulty: 'Easy',
    image: '',
  })

  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [currentImage, setCurrentImage] = useState<string>('')

  // Loading and error states
  const [loading, setLoading] = useState(false)
  const [fetchingRecipe, setFetchingRecipe] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')

  // Fetch recipe data on component mount
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('Recipe ID not provided');
        setFetchingRecipe(false);
        return;
      }

      try {
        setFetchingRecipe(true);
        const recipe = await recipeAPI.getRecipe(id);
        
        // Pre-fill form with existing recipe data
        setFormData({
          title: recipe.title,
          ingredients: recipe.ingredients.map((ing: Ingredient) => `${ing.amount} ${ing.unit} ${ing.name}`).join('\n'),
          steps: recipe.steps.join('\n'),
          cookingTime: recipe.cookingTime,
          calories: recipe.calories || 0,
          cuisine: recipe.cuisine,
          diet: recipe.diet,
          difficulty: recipe.difficulty,
          image: recipe.image || '',
        });

        setCurrentImage(recipe.image || '');
        setError('');
      } catch (err: any) {
        console.error('Error fetching recipe:', err);
        setError(err.response?.data?.message || 'Failed to fetch recipe');
      } finally {
        setFetchingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cookingTime' || name === 'calories' ? Number(value) : value
    }));
  };

  // Handle image file selection
  const handleImageChange = (file: File | null) => {
    setSelectedImage(file)
    if (!file) {
      setFormData(prev => ({ ...prev, image: currentImage }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id) {
      setError('Recipe ID not provided')
      toast.error('Error', 'Recipe ID not provided')
      return
    }

    // Validate required fields
    if (!formData.title.trim() || !formData.ingredients.trim() || !formData.steps.trim()) {
      setError('Please fill in all required fields')
      toast.error('Missing required fields', 'Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      let imageUrl = formData.image // Keep existing image URL by default

      // Upload new image if selected
      if (selectedImage) {
        setUploadingImage(true)
        try {
          const uploadResponse = await uploadAPI.uploadImage(selectedImage)
          imageUrl = uploadResponse.imageUrl
        } catch (uploadError: any) {
          console.error('Image upload failed:', uploadError)
          setError(uploadError.response?.data?.message || 'Failed to upload image')
          toast.error('Image upload failed', uploadError.response?.data?.message || 'Failed to upload image')
          setUploadingImage(false)
          setLoading(false)
          return
        } finally {
          setUploadingImage(false)
        }
      }

      // Parse ingredients and steps
      const ingredientsArray = formData.ingredients
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.trim().split(' ')
          const amount = parts[0]
          const unit = parts[1] || ''
          const name = parts.slice(2).join(' ')
          return { amount, unit, name }
        })

      const stepsArray = formData.steps
        .split('\n')
        .filter(step => step.trim())
        .map((step, index) => ({
          stepNumber: index + 1,
          instruction: step.trim()
        }))

      // Prepare recipe data
      const recipeData = {
        title: formData.title.trim(),
        ingredients: ingredientsArray,
        steps: stepsArray,
        cookingTime: formData.cookingTime,
        calories: formData.calories,
        cuisine: formData.cuisine,
        diet: formData.diet,
        difficulty: formData.difficulty,
        image: imageUrl,
      }

      // Update recipe
      await recipeAPI.updateRecipe(id, recipeData)

      toast.success('Recipe updated!', 'Your recipe has been successfully updated.')
      // Redirect to recipe detail page
      navigate(`/recipe/${id}`)

    } catch (err: any) {
      console.error('Error updating recipe:', err)
      setError(err.response?.data?.message || 'Failed to update recipe')
      toast.error('Failed to update recipe', err.response?.data?.message || 'Failed to update recipe')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  // Show loading state while fetching recipe
  if (fetchingRecipe) {
    return (
      <Layout user={user || undefined}>
        <div className="max-w-2xl mx-auto py-10">
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-2 text-neutral-600">Loading recipe...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user || undefined}>
      <div className="max-w-2xl mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Edit Recipe</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
              <Input
                label="Recipe Title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter recipe title"
              />

              <Textarea
                label="Ingredients"
                name="ingredients"
                required
                value={formData.ingredients}
                onChange={handleInputChange}
                rows={8}
                placeholder="Enter ingredients (one per line)&#10;Example:&#10;2 cups flour&#10;1 tsp salt&#10;3 eggs"
                helperText="Enter each ingredient on a new line (amount, unit, ingredient name)"
              />

              <Textarea
                label="Preparation Steps"
                name="steps"
                required
                value={formData.steps}
                onChange={handleInputChange}
                rows={8}
                placeholder="Enter preparation steps (one per line)&#10;Example:&#10;Preheat oven to 350°F&#10;Mix dry ingredients in a bowl&#10;Add wet ingredients and mix until combined"
                helperText="Enter each step on a new line"
              />

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Recipe Image</label>
                {currentImage && !selectedImage && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-neutral-700 mb-2">Current Image:</p>
                    <img
                      src={currentImage}
                      alt="Current recipe"
                      className="w-full max-w-xs h-48 object-cover rounded-md border"
                    />
                  </div>
                )}
                <ImageUploader
                  value={selectedImage ? '' : currentImage}
                  onChange={handleImageChange}
                  loading={uploadingImage}
                  disabled={loading}
                />
                <div className="mt-2">
                  <Input
                    label="Or update image URL"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedImage}
                    helperText={selectedImage ? 'URL input disabled while new file is selected' : ''}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Cooking Time (minutes)"
                  name="cookingTime"
                  type="number"
                  required
                  min={1}
                  value={formData.cookingTime || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 30"
                />
                <Input
                  label="Calories per serving"
                  name="calories"
                  type="number"
                  required
                  min={1}
                  value={formData.calories || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 250"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Cuisine</label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 mt-2"
                  >
                    <option value="">Select cuisine</option>
                    <option value="Italian">Italian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Indian">Indian</option>
                    <option value="Mexican">Mexican</option>
                    <option value="American">American</option>
                    <option value="French">French</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Mediterranean">Mediterranean</option>
                    <option value="Thai">Thai</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-neutral-700">Diet Type</label>
                  <select
                    name="diet"
                    value={formData.diet}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 mt-2"
                  >
                    <option value="">Select diet type</option>
                    <option value="None">None</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Keto">Keto</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Low-Carb">Low-Carb</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-neutral-700">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 mt-2"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-4 pt-6">
                <Button type="button" variant="ghost" onClick={() => navigate(`/recipe/${id}`)}>Cancel</Button>
                <Button type="submit" loading={loading || uploadingImage}>
                  {uploadingImage ? 'Uploading Image...' : (loading ? 'Updating...' : 'Update Recipe')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
};

export default EditRecipe;
