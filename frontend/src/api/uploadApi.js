import api from './axios'

export const uploadApi = {
  upload: (fileType, files, onProgress) => {
    const form = new FormData() 
    form.append('file_type', fileType)
    files.forEach(f => form.append('files', f))

    return api.post('/uploads/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total))
      },
    })
  },

  list: () => api.get("/uploads/"),
  getById: (id) => api.get(`/uploads/${id}/`),
  delete: (id) => api.delete(`/uploads/${id}/`),
 
}