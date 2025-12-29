import React from 'react';
import { DataManagement } from '../components/legal';
import { AuthGuard } from '../components/auth';

const DataManagementPage = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-soft">
        <div className="container mx-auto py-8">
          <DataManagement />
        </div>
      </div>
    </AuthGuard>
  );
};

export default DataManagementPage;