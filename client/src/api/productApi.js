import apiClient from './apiClient';

export const productApi = {
  getAllProducts: (params) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  createProduct: (data) => {
    const formData = new FormData();
    
    // Append text fields
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('stock_quantity', data.stock_quantity);
    formData.append('category_id', data.category_id);
    formData.append('description', data.description);
    formData.append('included', data.included);
    formData.append('specification', data.specification);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active);
    
    // Append image files (max 4)
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    return apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateProduct: (id, data) => {
    const formData = new FormData();
    
    // Append text fields (only if provided)
    if (data.name !== undefined) formData.append('name', data.name);
    if (data.price !== undefined) formData.append('price', data.price);
    if (data.stock_quantity !== undefined) formData.append('stock_quantity', data.stock_quantity);
    if (data.category_id !== undefined) formData.append('category_id', data.category_id);
    if (data.description !== undefined) formData.append('description', data.description);
    if (data.included !== undefined) formData.append('included', data.included);
    if (data.specification !== undefined) formData.append('specification', data.specification);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active);
    
    // Separate existing URLs from new Files
    const existingImages = [];
    const newFiles = [];
    
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        if (image instanceof File) {
          newFiles.push(image);
        } else if (typeof image === 'string') {
          existingImages.push(image);
        }
      });
    }
    
    // Send existing images as JSON string
    if (existingImages.length > 0) {
      formData.append('existing_images', JSON.stringify(existingImages));
    }
    
    // Send new files via multer
    newFiles.forEach((file) => {
      formData.append('images', file);
    });
    
    return apiClient.patch(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};
