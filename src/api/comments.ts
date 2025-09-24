import api from './index';

export interface Comment {
  _id: string;
  text: string;
  recipeId: string;
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  text: string;
}

export interface CommentsResponse {
  message: string;
  comments: Comment[];
}

export interface CommentResponse {
  message: string;
  comment: Comment;
}

export const commentAPI = {
  getComments: async (recipeId: string): Promise<CommentsResponse> => {
    const response = await api.get(`/recipes/${recipeId}/comments`);
    return response.data;
  },

  addComment: async (recipeId: string, data: CreateCommentData): Promise<CommentResponse> => {
    const response = await api.post(`/recipes/${recipeId}/comments`, data);
    return response.data;
  },

  deleteComment: async (recipeId: string, commentId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/recipes/${recipeId}/comments/${commentId}`);
    return response.data;
  }
};
