import React from 'react';
import { PrivacyPolicy } from '../components/legal';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container mx-auto py-8">
        <PrivacyPolicy />
      </div>
    </div>
  );
};

export default PrivacyPage;