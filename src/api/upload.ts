import api from './index';

export interface UploadResponse {
  message: string;
  imageUrl: string;
  publicId: string;
}

export const uploadAPI = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteImage: async (publicId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/upload/image/${publicId}`);
    return response.data;
  }
};
