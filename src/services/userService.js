const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class UserService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/users`;
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
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Export user data (GDPR compliance)
   * @returns {Promise<Blob>} Data export file
   */
  async exportUserData() {
    try {
      const response = await fetch(`${this.baseURL}/export`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Get the response as blob for file download
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Delete user account and all associated data
   * @param {string} confirmPassword - Password confirmation
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteAccount(confirmPassword) {
    try {
      const response = await fetch(`${this.baseURL}/account`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ confirmPassword }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to delete user account:', error);
      throw error;
    }
  }

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Password change confirmation
   */
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/change-password`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  }

  /**
   * Download exported data as file
   * @param {Blob} blob - Data blob from export
   * @param {string} filename - Optional filename
   */
  downloadExportedData(blob, filename = null) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `sympto-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Create singleton instance
const userService = new UserService();

export default userService;