// API Service - Central API communication
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    console.error('VITE_API_URL is not set');
}

export const getApiOrigin = () => {
    if (!API_BASE_URL) return '';
    return API_BASE_URL.replace(/\/api\/?$/, '');
};

export const normalizeAssetUrl = (value) => {
    if (!value || typeof value !== 'string') return value;

    const apiOrigin = getApiOrigin() || window.location.origin;

    if (value.startsWith('http://localhost:3333')) {
        return value.replace('http://localhost:3333', apiOrigin);
    }

    if (value.startsWith('/uploads/')) {
        return `${apiOrigin}${value}`;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }

    return value;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('adroit_token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
export const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    
    logout: () => apiCall('/auth/logout', { method: 'POST' }),
    
    getCurrentUser: () => apiCall('/auth/me'),
};

// Projects API
export const projectsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return apiCall(`/projects?${params}`);
    },
    
    getFeatured: (limit = 8) => apiCall(`/projects/featured/list?limit=${limit}`),
    
    getBySlug: (slug) => apiCall(`/projects/${slug}`),
    
    create: (projectData) => apiCall('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
    }),
    
    update: (id, projectData) => apiCall(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData),
    }),
    
    toggleFeatured: (id, is_featured, featured_order = 0) => apiCall(`/projects/${id}/featured`, {
        method: 'PATCH',
        body: JSON.stringify({ is_featured, featured_order }),
    }),
    
    delete: (id) => apiCall(`/projects/${id}`, { method: 'DELETE' }),
};

// Blog API
export const blogAPI = {
    getAll: () => apiCall('/blog?published=true'),
    
    getBySlug: (slug) => apiCall(`/blog/${slug}`),
    
    create: (postData) => apiCall('/blog', {
        method: 'POST',
        body: JSON.stringify(postData),
    }),
    
    update: (id, postData) => apiCall(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(postData),
    }),
    
    delete: (id) => apiCall(`/blog/${id}`, { method: 'DELETE' }),
};

// Inquiries API
export const inquiriesAPI = {
    getAll: () => apiCall('/inquiries'),
    
    create: (inquiryData) => apiCall('/inquiries', {
        method: 'POST',
        body: JSON.stringify(inquiryData),
    }),
    
    updateStatus: (id, status) => apiCall(`/inquiries/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
    }),
    
    delete: (id) => apiCall(`/inquiries/${id}`, { method: 'DELETE' }),
};

// Upload API
export const uploadAPI = {
    uploadImage: async (file, folder = 'general') => {
        const token = localStorage.getItem('adroit_token');
        const formData = new FormData();
        formData.append('image', file);
        formData.append('folder', folder);
        
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        
        return data;
    },
    
    uploadMultiple: async (files, folder = 'general') => {
        const token = localStorage.getItem('adroit_token');
        const formData = new FormData();
        
        files.forEach(file => {
            formData.append('images', file);
        });
        formData.append('folder', folder);
        
        const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Upload failed');
        }
        
        return data;
    },
    
    deleteImage: (filename) => apiCall(`/upload/${filename}`, { method: 'DELETE' }),
};

export default {
    auth: authAPI,
    projects: projectsAPI,
    blog: blogAPI,
    inquiries: inquiriesAPI,
    upload: uploadAPI,
};
