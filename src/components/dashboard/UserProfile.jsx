import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Alert } from '../ui';
import userService from '../../services/userService';

const UserProfile = ({ onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [deleteForm, setDeleteForm] = useState({
    confirmPassword: '',
    confirmText: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getProfile();
      
      if (response.success) {
        const userData = response.data.user;
        setProfile(userData);
        setProfileForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : ''
        });
      } else {
        throw new Error(response.error?.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await userService.updateProfile(profileForm);
      
      if (response.success) {
        setProfile(response.data.user);
        setSuccess('Profile updated successfully');
      } else {
        throw new Error(response.error?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await userService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (response.success) {
        setSuccess('Password changed successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(response.error?.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDataExport = async () => {
    try {
      setExporting(true);
      setError(null);
      setSuccess(null);
      
      const blob = await userService.exportUserData();
      userService.downloadExportedData(blob);
      setSuccess('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      setError(error.message);
    } finally {
      setExporting(false);
    }
  };

  const handleAccountDeletion = async (e) => {
    e.preventDefault();
    
    if (deleteForm.confirmText !== 'DELETE MY ACCOUNT') {
      setError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }
    
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      return;
    }
    
    try {
      setDeleting(true);
      setError(null);
      
      const response = await userService.deleteAccount(deleteForm.confirmPassword);
      
      if (response.success) {
        // Clear local storage and redirect
        localStorage.removeItem('authToken');
        globalThis.location.href = '/';
      } else {
        throw new Error(response.error?.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      setError(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
            aria-label="Loading profile"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">User Profile</h2>
          <p className="text-gray-600 mt-1">
            Manage your account settings and data
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>
          Back to Dashboard
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="error">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', label: 'Profile Information' },
            { id: 'password', label: 'Change Password' },
            { id: 'data', label: 'Data Management' },
            { id: 'danger', label: 'Danger Zone' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <Card>
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Profile Information</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">First Name</label>
                    <Input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Last Name</label>
                    <Input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <Input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                  />
                  <p className="form-help">
                    Changing your email will require re-verification
                  </p>
                </div>

                <div>
                  <label className="form-label">Date of Birth</label>
                  <Input
                    type="date"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                  <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Account Created:</span>
                      <span className="ml-2 text-gray-600">{formatDate(profile?.createdAt)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Updated:</span>
                      <span className="ml-2 text-gray-600">{formatDate(profile?.updatedAt)}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email Verified:</span>
                      <span className={`ml-2 ${profile?.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {profile?.emailVerified ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Login:</span>
                      <span className="ml-2 text-gray-600">{formatDate(profile?.lastLogin)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <Card>
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Change Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="form-label">Current Password</label>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                    required
                  />
                  <p className="form-help">
                    Password must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label className="form-label">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                    disabled={saving}
                  >
                    {saving ? 'Changing Password...' : 'Change Password'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}

        {/* Data Management Tab */}
        {activeTab === 'data' && (
          <Card>
            <div className="card-header">
              <h3 className="text-xl font-semibold text-gray-900">Data Management</h3>
            </div>
            <div className="card-body space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Export Your Data</h4>
                <p className="text-gray-600 mb-4">
                  Download a complete copy of your account data including profile information and all assessment history. 
                  This export complies with GDPR data portability requirements.
                </p>
                <Button
                  variant="secondary"
                  onClick={handleDataExport}
                  loading={exporting}
                  disabled={exporting}
                >
                  {exporting ? 'Exporting...' : 'Export My Data'}
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Data Usage Information</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Your profile information is used to personalize your experience</p>
                  <p>• Assessment data is processed by AI models to provide health insights</p>
                  <p>• All data is encrypted in transit and at rest</p>
                  <p>• We do not share your personal data with third parties</p>
                  <p>• You can delete your account and all data at any time</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Danger Zone Tab */}
        {activeTab === 'danger' && (
          <Card>
            <div className="card-header">
              <h3 className="text-xl font-semibold text-red-600">Danger Zone</h3>
            </div>
            <div className="card-body">
              <Alert variant="warning">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Warning: Account Deletion
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Deleting your account will permanently remove all your data including profile information, 
                        assessment history, and AI analysis results. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </Alert>

              <form onSubmit={handleAccountDeletion} className="mt-6 space-y-6">
                <div>
                  <label className="form-label">Confirm Your Password</label>
                  <Input
                    type="password"
                    value={deleteForm.confirmPassword}
                    onChange={(e) => setDeleteForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Enter your password to confirm"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Type "DELETE MY ACCOUNT" to confirm</label>
                  <Input
                    type="text"
                    value={deleteForm.confirmText}
                    onChange={(e) => setDeleteForm(prev => ({ ...prev, confirmText: e.target.value }))}
                    placeholder="DELETE MY ACCOUNT"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="danger"
                    loading={deleting}
                    disabled={deleting || deleteForm.confirmText !== 'DELETE MY ACCOUNT'}
                  >
                    {deleting ? 'Deleting Account...' : 'Delete My Account'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserProfile;