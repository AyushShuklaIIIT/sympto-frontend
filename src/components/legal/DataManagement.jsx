import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';

const DataManagement = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // API call to export user data
      const response = await fetch('/api/users/export', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sympto-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAssessments = async () => {
    setIsDeletingData(true);
    try {
      const response = await fetch('/api/assessments', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        alert('All assessment data has been deleted successfully.');
        setShowDeleteConfirm(false);
      } else {
        throw new Error('Deletion failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete assessment data. Please try again.');
    } finally {
      setIsDeletingData(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const response = await fetch('/api/users/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      } else {
        throw new Error('Account deletion failed');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const sections = [
    { id: 'overview', title: 'Data Overview', icon: '📊' },
    { id: 'export', title: 'Export Data', icon: '📥' },
    { id: 'delete', title: 'Delete Data', icon: '🗑️' },
    { id: 'consent', title: 'Consent Management', icon: '✅' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-600">
          Manage your personal data, privacy settings, and exercise your rights under GDPR and other privacy laws.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{section.icon}</span>
                  {section.title}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'overview' && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Data Overview</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-medium text-primary-900 mb-2">Personal Information</h3>
                    <ul className="text-sm text-primary-700 space-y-1">
                      <li>• Account details (name, email)</li>
                      <li>• Profile information</li>
                      <li>• Authentication data</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Health Data</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Assessment responses</li>
                      <li>• Lab results (encrypted)</li>
                      <li>• AI insights and recommendations</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-900 mb-2">Usage Data</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Login history</li>
                      <li>• Feature usage patterns</li>
                      <li>• Device and browser information</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-medium text-orange-900 mb-2">Security Data</h3>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Encrypted passwords</li>
                      <li>• Session tokens</li>
                      <li>• Security logs</li>
                    </ul>
                  </div>
                </div>
                <Alert>
                  <p className="text-sm">
                    All sensitive health data is encrypted using AES-256-GCM encryption and stored securely. 
                    We never share your personal health information without your explicit consent.
                  </p>
                </Alert>
              </div>
            </Card>
          )}

          {activeSection === 'export' && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Export Your Data</h2>
              <div className="space-y-6">
                <p className="text-gray-700">
                  You have the right to receive a copy of your personal data in a structured, 
                  commonly used, and machine-readable format. This export includes all your 
                  assessment data, profile information, and usage history.
                </p>
                
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-medium text-primary-900 mb-2">What's included in your export:</h3>
                  <ul className="text-sm text-primary-700 space-y-1">
                    <li>• Personal profile information</li>
                    <li>• All health assessments and responses</li>
                    <li>• AI-generated insights and recommendations</li>
                    <li>• Account activity and usage history</li>
                    <li>• Consent and preference settings</li>
                  </ul>
                </div>

                <Alert>
                  <p className="text-sm">
                    Your data export will be provided in JSON format. Sensitive information 
                    will be included but may be encrypted for security purposes.
                  </p>
                </Alert>

                <Button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="w-full md:w-auto"
                >
                  {isExporting ? 'Preparing Export...' : 'Download My Data'}
                </Button>
              </div>
            </Card>
          )}

          {activeSection === 'delete' && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delete Your Data</h2>
              <div className="space-y-6">
                <p className="text-gray-700">
                  You have the right to request deletion of your personal data. You can choose 
                  to delete specific data types or your entire account.
                </p>

                {/* Delete Assessment Data */}
                <div className="border border-orange-200 rounded-lg p-4">
                  <h3 className="font-medium text-orange-900 mb-2">Delete Assessment Data</h3>
                  <p className="text-sm text-orange-700 mb-4">
                    This will permanently delete all your health assessments, lab results, and AI insights. 
                    Your account will remain active.
                  </p>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    >
                      Delete Assessment Data
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Alert variant="warning">
                        <p className="text-sm font-medium">
                          Are you sure? This action cannot be undone.
                        </p>
                      </Alert>
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleDeleteAssessments}
                          disabled={isDeletingData}
                          variant="destructive"
                          size="sm"
                        >
                          {isDeletingData ? 'Deleting...' : 'Yes, Delete Data'}
                        </Button>
                        <Button
                          onClick={() => setShowDeleteConfirm(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delete Entire Account */}
                <div className="border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">Delete Entire Account</h3>
                  <p className="text-sm text-red-700 mb-4">
                    This will permanently delete your account and all associated data. 
                    You will be logged out and unable to recover your information.
                  </p>
                  {!showAccountDeleteConfirm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowAccountDeleteConfirm(true)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Delete My Account
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Alert variant="destructive">
                        <p className="text-sm font-medium">
                          This will permanently delete your account and all data. This action cannot be undone.
                        </p>
                      </Alert>
                      <div className="flex space-x-3">
                        <Button
                          onClick={handleDeleteAccount}
                          disabled={isDeletingAccount}
                          variant="destructive"
                          size="sm"
                        >
                          {isDeletingAccount ? 'Deleting Account...' : 'Yes, Delete My Account'}
                        </Button>
                        <Button
                          onClick={() => setShowAccountDeleteConfirm(false)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'consent' && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Consent Management</h2>
              <div className="space-y-6">
                <p className="text-gray-700">
                  Manage your consent preferences for how we use your data. You can withdraw 
                  consent at any time without affecting the lawfulness of processing based on 
                  consent before its withdrawal.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id="essential"
                      checked={true}
                      disabled={true}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="essential" className="font-medium text-gray-900">
                        Essential Services (Required)
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Processing necessary for the performance of our service, including account 
                        management, security, and core health assessment functionality.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id="analytics"
                      defaultChecked={true}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="analytics" className="font-medium text-gray-900">
                        Analytics and Improvements
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Help us improve our service by analyzing usage patterns and user behavior 
                        in an anonymized format.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id="communications"
                      defaultChecked={false}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="communications" className="font-medium text-gray-900">
                        Marketing Communications
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Receive updates about new features, health tips, and other relevant 
                        information via email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border rounded-lg">
                    <input
                      type="checkbox"
                      id="research"
                      defaultChecked={false}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="research" className="font-medium text-gray-900">
                        Research and Development
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Use anonymized and aggregated data to improve AI models and develop 
                        new health insights (no personal identification possible).
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full md:w-auto">
                  Save Consent Preferences
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManagement;