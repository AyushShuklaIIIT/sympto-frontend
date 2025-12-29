const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AssessmentService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/assessments`;
  }

  /**
   * Get authorization header with token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment form data
   * @returns {Promise<Object>} Created assessment with AI analysis if available
   */
  async createAssessment(assessmentData) {
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(assessmentData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw error;
    }
  }

  /**
   * Get user's assessment history
   * @param {Object} options - Query options (page, limit, sortBy, sortOrder)
   * @returns {Promise<Object>} Assessment history with pagination
   */
  async getAssessments(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (options.page) queryParams.append('page', options.page);
      if (options.limit) queryParams.append('limit', options.limit);
      if (options.sortBy) queryParams.append('sortBy', options.sortBy);
      if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);

      const url = queryParams.toString() 
        ? `${this.baseURL}?${queryParams.toString()}`
        : this.baseURL;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      throw error;
    }
  }

  /**
   * Get a specific assessment by ID
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object>} Assessment details
   */
  async getAssessment(assessmentId) {
    try {
      const response = await fetch(`${this.baseURL}/${assessmentId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to fetch assessment:', error);
      throw error;
    }
  }

  /**
   * Trigger AI analysis for an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object>} Updated assessment with AI analysis
   */
  async analyzeAssessment(assessmentId) {
    try {
      const response = await fetch(`${this.baseURL}/${assessmentId}/analyze`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to analyze assessment:', error);
      throw error;
    }
  }

  /**
   * Delete an assessment
   * @param {string} assessmentId - Assessment ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteAssessment(assessmentId) {
    try {
      const response = await fetch(`${this.baseURL}/${assessmentId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      throw error;
    }
  }

  /**
   * Delete all user assessments
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteAllAssessments() {
    try {
      const response = await fetch(this.baseURL, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete all assessments:', error);
      throw error;
    }
  }

  /**
   * Check AI service health
   * @returns {Promise<Object>} AI service health status
   */
  async checkAIHealth() {
    try {
      const response = await fetch(`${this.baseURL}/ai/health`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to check AI health:', error);
      throw error;
    }
  }
}

// Create singleton instance
const assessmentService = new AssessmentService();

export default assessmentService;