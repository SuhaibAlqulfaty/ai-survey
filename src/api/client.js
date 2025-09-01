// API Client for Laravel Backend Integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Get authentication token
  getToken() {
    return this.token || localStorage.getItem('auth_token');
  }

  // Make HTTP request with proper headers
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        this.setToken(null);
        window.location.href = '/login';
        throw new Error('Authentication required');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Survey methods
  async getSurveys(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/surveys${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async getSurvey(id) {
    return this.request(`/surveys/${id}`);
  }

  async createSurvey(surveyData) {
    return this.request('/surveys', {
      method: 'POST',
      body: JSON.stringify(surveyData),
    });
  }

  async updateSurvey(id, surveyData) {
    return this.request(`/surveys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(surveyData),
    });
  }

  async deleteSurvey(id) {
    return this.request(`/surveys/${id}`, {
      method: 'DELETE',
    });
  }

  async publishSurvey(id) {
    return this.request(`/surveys/${id}/publish`, {
      method: 'POST',
    });
  }

  async closeSurvey(id) {
    return this.request(`/surveys/${id}/close`, {
      method: 'POST',
    });
  }

  async duplicateSurvey(id) {
    return this.request(`/surveys/${id}/duplicate`, {
      method: 'POST',
    });
  }

  // Response methods
  async getResponses(surveyId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/surveys/${surveyId}/responses${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async submitResponse(surveyId, responseData) {
    return this.request(`/surveys/${surveyId}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  // Public survey methods (no authentication required)
  async getPublicSurvey(id) {
    return this.request(`/surveys/${id}/public`);
  }

  async submitPublicResponse(surveyId, responseData) {
    return this.request(`/surveys/${surveyId}/public/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData),
    });
  }

  // Analytics methods
  async getSurveyAnalytics(id) {
    return this.request(`/surveys/${id}/analytics`);
  }

  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // AI methods
  async generateQuestions(prompt) {
    return this.request('/ai/generate-questions', {
      method: 'POST',
      body: JSON.stringify(prompt),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual methods for convenience
export const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  getSurveys,
  getSurvey,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  publishSurvey,
  closeSurvey,
  duplicateSurvey,
  getResponses,
  submitResponse,
  getPublicSurvey,
  submitPublicResponse,
  getSurveyAnalytics,
  getDashboardStats,
  generateQuestions,
  healthCheck,
} = apiClient;

