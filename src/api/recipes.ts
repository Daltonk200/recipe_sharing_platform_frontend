import api from './index';

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  stepNumber: number;
  instruction: string;
}

export interface Rating {
  user: {
    _id: string;
    username: string;
  };
  score: number;
}

export interface Recipe {
  _id: string;
  title: string;
  image?: string;
  ingredients: Ingredient[];
  steps: Step[];
  cookingTime: number;
  calories?: number;
  cuisine: string;
  diet: string;
  difficulty: string;
  createdBy: {
    _id: string;
    username: string;
  };
  ratings: Rating[];
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFilters {
  page?: number;
  limit?: number;
  search?: string;
  ingredients?: string;
  maxTime?: number;
  maxCalories?: number;
  cuisine?: string;
  diet?: string;
  difficulty?: string;
  createdBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RecipesResponse {
  recipes: Recipe[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecipes: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateRecipeData {
  title: string;
  image?: string;
  ingredients: Ingredient[];
  steps: Step[];
  cookingTime: number;
  calories?: number;
  cuisine: string;
  diet: string;
  difficulty: string;
}

export const recipeAPI = {
  getRecipes: async (filters: RecipeFilters = {}): Promise<RecipesResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/recipes?${params.toString()}`);
    return response.data;
  },

  getRecipe: async (id: string): Promise<Recipe> => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  createRecipe: async (data: CreateRecipeData): Promise<{ message: string; recipe: Recipe }> => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  updateRecipe: async (id: string, data: Partial<CreateRecipeData>): Promise<{ message: string; recipe: Recipe }> => {
    const response = await api.put(`/recipes/${id}`, data);
    return response.data;
  },

  deleteRecipe: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  rateRecipe: async (id: string, score: number): Promise<{ message: string; averageRating: number }> => {
    const response = await api.post(`/recipes/${id}/rate`, { score });
    return response.data;
  },

  toggleFavorite: async (id: string): Promise<{ message: string; isFavorited: boolean }> => {
    const response = await api.post(`/recipes/${id}/favorite`);
    return response.data;
  }
};
