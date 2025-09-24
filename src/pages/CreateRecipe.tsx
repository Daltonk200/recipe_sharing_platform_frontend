
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { recipeAPI, type CreateRecipeData, type Ingredient } from '../api/recipes'
import { uploadAPI } from '../api/upload'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea, ImageUploader, useToast } from '../components/ui'


const CreateRecipe = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [formData, setFormData] = useState<CreateRecipeData>({
    title: '',
    image: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    steps: [{ stepNumber: 1, instruction: '' }],
    cookingTime: 0,
    calories: 0,
    cuisine: 'Other',
    diet: 'None',
    difficulty: 'Medium',
  })
  const [error, setError] = useState<string | null>(null)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'cookingTime' || name === 'calories' ? parseInt(value) || 0 : value,
    })
  }


  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const updatedIngredients = [...formData.ingredients]
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value }
    setFormData({ ...formData, ingredients: updatedIngredients })
  }


  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', amount: '', unit: '' }],
    })
  }


  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index)
      setFormData({ ...formData, ingredients: updatedIngredients })
    }
  }


  const handleImageChange = (file: File | null) => {
    setSelectedImage(file)
    if (!file) {
      setFormData({ ...formData, image: '' })
    }
  }


  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...formData.steps]
    updatedSteps[index] = { ...updatedSteps[index], instruction: value }
    setFormData({ ...formData, steps: updatedSteps })
  }


  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { stepNumber: formData.steps.length + 1, instruction: '' }],
    })
  }


  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({ ...step, stepNumber: i + 1 }))
      setFormData({ ...formData, steps: updatedSteps })
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!formData.title || formData.cookingTime <= 0) {
        setError('Please fill in all required fields')
        toast.error('Missing required fields', 'Please fill in all required fields')
        setLoading(false)
        return
      }

      // Validate ingredients
      const validIngredients = formData.ingredients.filter(ing => ing.name && ing.amount)
      if (validIngredients.length === 0) {
        setError('Please add at least one ingredient')
        toast.error('No ingredients', 'Please add at least one ingredient')
        setLoading(false)
        return
      }

      // Validate steps
      const validSteps = formData.steps.filter(step => step.instruction.trim())
      if (validSteps.length === 0) {
        setError('Please add at least one instruction step')
        toast.error('No instructions', 'Please add at least one instruction step')
        setLoading(false)
        return
      }

      let imageUrl = formData.image

      // Upload image if file is selected
      if (selectedImage) {
        setUploadingImage(true)
        try {
          const uploadResponse = await uploadAPI.uploadImage(selectedImage)
          imageUrl = uploadResponse.imageUrl
        } catch (uploadError: any) {
          setError(`Failed to upload image: ${uploadError.response?.data?.message || uploadError.message}`)
          toast.error('Image upload failed', uploadError.response?.data?.message || uploadError.message)
          setUploadingImage(false)
          setLoading(false)
          return
        } finally {
          setUploadingImage(false)
        }
      }

      const recipeData = {
        ...formData,
        image: imageUrl,
        ingredients: validIngredients,
        steps: validSteps,
        calories: formData.calories || undefined,
      }

      const response = await recipeAPI.createRecipe(recipeData)
      toast.success('Recipe created!', 'Your recipe has been published.')
      navigate(`/recipe/${response.recipe._id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create recipe')
      toast.error('Failed to create recipe', err.response?.data?.message || 'Failed to create recipe')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Recipe</CardTitle>
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
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Recipe Image</label>
              <ImageUploader
                value={formData.image}
                onChange={(file) => handleImageChange(file)}
                loading={uploadingImage}
                disabled={loading}
              />
              <div className="mt-2">
                <Input
                  label="Or paste image URL"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  disabled={!!selectedImage}
                  helperText={selectedImage ? 'URL input disabled while file is selected' : ''}
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
                label="Calories (optional)"
                name="calories"
                type="number"
                min={0}
                value={formData.calories || ''}
                onChange={handleInputChange}
                placeholder="e.g. 250"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-neutral-700">Cuisine</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="American">American</option>
                  <option value="French">French</option>
                  <option value="Thai">Thai</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Diet</label>
                <select
                  name="diet"
                  value={formData.diet}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="None">None</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Keto">Keto</option>
                  <option value="Paleo">Paleo</option>
                  <option value="Low-Carb">Low-Carb</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-700">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Ingredients *</h3>
                <Button type="button" size="sm" variant="secondary" onClick={addIngredient}>
                  Add Ingredient
                </Button>
              </div>
              <div className="space-y-3">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <Input
                        placeholder="Amount"
                        value={ingredient.amount}
                        onChange={e => handleIngredientChange(index, 'amount', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Unit"
                        value={ingredient.unit}
                        onChange={e => handleIngredientChange(index, 'unit', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-6">
                      <Input
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={e => handleIngredientChange(index, 'name', e.target.value)}
                        size="sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        disabled={formData.ingredients.length === 1}
                        className="h-9 w-9"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Instructions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium">Instructions *</h3>
                <Button type="button" size="sm" variant="secondary" onClick={addStep}>
                  Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-2">
                      {step.stepNumber}
                    </span>
                    <Textarea
                      value={step.instruction}
                      onChange={e => handleStepChange(index, e.target.value)}
                      placeholder="Describe this step..."
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeStep(index)}
                      disabled={formData.steps.length === 1}
                      className="h-9 w-9 mt-2"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <Button type="button" variant="ghost" onClick={() => navigate('/')}>Cancel</Button>
              <Button type="submit" loading={loading || uploadingImage}>
                {uploadingImage ? 'Uploading Image...' : (loading ? 'Creating...' : 'Create Recipe')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateRecipe
