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

    // Relative /uploads/ path — prefix with current API origin
    if (value.startsWith('/uploads/')) {
        return `${apiOrigin}${value}`;
    }

    // Any absolute URL that contains /uploads/ → extract the relative part
    // and re-prefix with the CURRENT API origin. This fixes images that were
    // stored with an old dev-tunnel hostname or localhost:3333.
    const uploadsMatch = value.match(/(\/uploads\/.+)/);
    if (uploadsMatch) {
        return `${apiOrigin}${uploadsMatch[1]}`;
    }

    // External URLs (Unsplash, S3, CDN, etc.) — return as-is
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
        const params = new URLSearchParams({ limit: 1000, ...filters });
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

    // Accept a full /uploads/... path or just a filename — strip leading slash to avoid double-slash
    deleteImage: (filePath) => {
        const clean = String(filePath).replace(/^\/+/, '');
        return apiCall(`/upload/${clean}`, { method: 'DELETE' });
    },
};

// Jobs API
export const jobsAPI = {
    apply: async (formData) => {
        const response = await fetch(`${API_BASE_URL}/jobs/apply`, {
            method: 'POST',
            body: formData, // Browser will set correct multipart headers
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Application failed');
        return data;
    },
    deleteResume: (id) => apiCall(`/jobs/resume/${id}`, { method: 'DELETE' }),
};

// Shop Products API
export const shopAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams({ ...params }).toString();
        return apiCall(`/shop/products?${query}`);
    },
    getAdminAll: (params = {}) => {
        const query = new URLSearchParams({ ...params }).toString();
        return apiCall(`/shop/products/admin/all?${query}`);
    },
    getBySlug: (slug) => apiCall(`/shop/products/${slug}`),
    create: (data) => apiCall('/shop/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiCall(`/shop/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiCall(`/shop/products/${id}`, { method: 'DELETE' }),
    updateImages: (id, images) => apiCall(`/shop/products/${id}/images`, { method: 'PUT', body: JSON.stringify({ images }) }),
    togglePublish: (id) => apiCall(`/shop/products/${id}/publish`, { method: 'PATCH' }),
    toggleFeatured: (id) => apiCall(`/shop/products/${id}/featured`, { method: 'PATCH' }),
};

// Shop Categories API
export const categoriesAPI = {
    getAll: () => apiCall('/shop/categories'),
    create: (data) => apiCall('/shop/categories', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiCall(`/shop/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiCall(`/shop/categories/${id}`, { method: 'DELETE' }),
};

// Shop Orders API
export const orderAPI = {
    create: (data) => apiCall('/shop/orders', { method: 'POST', body: JSON.stringify(data) }),
    getMyOrders: () => apiCall('/shop/orders/my-orders'),
    getById: (id) => apiCall(`/shop/orders/${id}`),
    getByNumber: (num) => apiCall(`/shop/orders/number/${num}`),
    getAll: (params = {}) => {
        const query = new URLSearchParams({ ...params }).toString();
        return apiCall(`/shop/orders/admin/all?${query}`);
    },
    updateStatus: (id, status, notes) => apiCall(`/shop/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
    createShipment: (id) => apiCall(`/shop/orders/${id}/create-shipment`, { method: 'POST' }),
};

// Shop PayU API
export const payuAPI = {
    initiate: (orderId) => apiCall('/shop/payu/initiate', { method: 'POST', body: JSON.stringify({ order_id: orderId }) }),
    getStatus: (txnid) => apiCall(`/shop/payu/status/${txnid}`),
};


// Shop Reviews API
export const reviewAPI = {
    getByProduct: (productId, params = {}) => {
        const query = new URLSearchParams({ ...params }).toString();
        return apiCall(`/shop/reviews/product/${productId}?${query}`);
    },
    create: (data) => apiCall('/shop/reviews', { method: 'POST', body: JSON.stringify(data) }),
    getAll: (params = {}) => {
        const query = new URLSearchParams({ ...params }).toString();
        return apiCall(`/shop/reviews/admin/all?${query}`);
    },
    delete: (id) => apiCall(`/shop/reviews/${id}`, { method: 'DELETE' }),
};

export default {
    auth: authAPI,
    projects: projectsAPI,
    blog: blogAPI,
    inquiries: inquiriesAPI,
    upload: uploadAPI,
    jobs: jobsAPI,
    shop: shopAPI,
    categories: categoriesAPI,
    orders: orderAPI,
    payu: payuAPI,
    reviews: reviewAPI,
};
