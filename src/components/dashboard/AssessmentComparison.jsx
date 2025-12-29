import { useState } from 'react';
import { Card, Button } from '../ui';

const ComparisonTable = ({ fields, title, assessment1, assessment2, formatDate, formatValue, getChangeIndicator }) => (
  <Card>
    <div className="card-header">
      <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="card-body">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white/30 backdrop-blur-md">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parameter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {formatDate(assessment1.createdAt)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {formatDate(assessment2.createdAt)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white/25 backdrop-blur-md divide-y divide-gray-200/60">
            {fields.map((field) => {
              const value1 = assessment1[field.key];
              const value2 = assessment2[field.key];
              const change = getChangeIndicator(value1, value2, field.isHigherBetter);
              
              return (
                <tr key={field.key} className="hover:bg-white/25">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {field.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatValue(value1, field.type)}
                    {field.unit && value1 != null && ` ${field.unit}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatValue(value2, field.type)}
                    {field.unit && value2 != null && ` ${field.unit}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg ${change.color}`} aria-hidden="true">
                        {change.icon}
                      </span>
                      <span className={change.color}>
                        {change.text}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </Card>
);

const AIAnalysisComparison = ({ assessment1, assessment2, formatDate }) => {
  const ai1 = assessment1.aiAnalysis;
  const ai2 = assessment2.aiAnalysis;

  if (!ai1 && !ai2) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-gray-600">No AI analysis available for either assessment.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="card-header">
        <h3 className="text-xl font-semibold text-gray-900">AI Analysis Comparison</h3>
      </div>
      <div className="card-body">
        <div className="grid md:grid-cols-2 gap-6">
          {/* First Assessment */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              {formatDate(assessment1.createdAt)}
            </h4>
            {ai1 ? (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Confidence:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {Math.round(ai1.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Insights:</span>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                    {ai1.insights}
                  </p>
                </div>
                {ai1.recommendations && ai1.recommendations.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Recommendations:</span>
                    <ul className="mt-1 text-sm text-gray-700 space-y-1">
                      {ai1.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No AI analysis available</p>
            )}
          </div>

          {/* Second Assessment */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-3">
              {formatDate(assessment2.createdAt)}
            </h4>
            {ai2 ? (
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Confidence:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {Math.round(ai2.confidence * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Insights:</span>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                    {ai2.insights}
                  </p>
                </div>
                {ai2.recommendations && ai2.recommendations.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Recommendations:</span>
                    <ul className="mt-1 text-sm text-gray-700 space-y-1">
                      {ai2.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No AI analysis available</p>
            )}
          </div>
        </div>

        {/* Confidence Comparison */}
        {ai1 && ai2 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="text-md font-medium text-gray-900 mb-3">Analysis Confidence Comparison</h5>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Earlier Assessment</span>
                  <span>{Math.round(ai1.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${ai1.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Later Assessment</span>
                  <span>{Math.round(ai2.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${ai2.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

const AssessmentComparison = ({ assessments, onClose }) => {
  const [activeTab, setActiveTab] = useState('symptoms');

  if (assessments?.length !== 2) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-gray-600">Please select exactly 2 assessments to compare.</p>
          <Button variant="secondary" onClick={onClose} className="mt-4">
            Back to History
          </Button>
        </div>
      </Card>
    );
  }

  const [assessment1, assessment2] = assessments;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeIndicator = (value1, value2, isHigherBetter = false) => {
    if (value1 === value2 || value1 == null || value2 == null) {
      return { icon: '→', color: 'text-gray-500', text: 'No change' };
    }
    
    const isIncrease = value2 > value1;
    const isImprovement = isHigherBetter ? isIncrease : !isIncrease;
    
    return {
      icon: isIncrease ? '↗' : '↘',
      color: isImprovement ? 'text-green-600' : 'text-red-600',
      text: isImprovement ? 'Improved' : 'Worsened'
    };
  };

  const formatValue = (value, type = 'default') => {
    if (value == null) return 'Not provided';
    
    switch (type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'scale':
        return `${value}/5`;
      case 'frequency':
        return `${value} times/week`;
      case 'minutes':
        return `${value} min/day`;
      case 'units':
        return `${value} units/week`;
      case 'lab':
        return typeof value === 'number' ? value.toFixed(1) : value;
      default:
        return value;
    }
  };

  const symptomFields = [
    { key: 'fatigue', label: 'Fatigue Level', type: 'scale', isHigherBetter: false },
    { key: 'hair_loss', label: 'Hair Loss', type: 'boolean', isHigherBetter: false },
    { key: 'acidity', label: 'Acidity Level', type: 'scale', isHigherBetter: false },
    { key: 'dizziness', label: 'Dizziness Level', type: 'scale', isHigherBetter: false },
    { key: 'muscle_pain', label: 'Muscle Pain Level', type: 'scale', isHigherBetter: false },
    { key: 'numbness', label: 'Numbness Level', type: 'scale', isHigherBetter: false }
  ];

  const lifestyleFields = [
    { key: 'vegetarian', label: 'Vegetarian Diet', type: 'boolean' },
    { key: 'iron_food_freq', label: 'Iron-rich Foods', type: 'frequency', isHigherBetter: true },
    { key: 'dairy_freq', label: 'Dairy Consumption', type: 'frequency' },
    { key: 'sunlight_min', label: 'Sunlight Exposure', type: 'minutes', isHigherBetter: true },
    { key: 'junk_food_freq', label: 'Junk Food Consumption', type: 'frequency', isHigherBetter: false },
    { key: 'smoking', label: 'Smoking', type: 'boolean', isHigherBetter: false },
    { key: 'alcohol', label: 'Alcohol Consumption', type: 'units', isHigherBetter: false }
  ];

  const labFields = [
    { key: 'hemoglobin', label: 'Hemoglobin (g/dL)', type: 'lab', isHigherBetter: true, unit: 'g/dL' },
    { key: 'ferritin', label: 'Ferritin (ng/mL)', type: 'lab', isHigherBetter: true, unit: 'ng/mL' },
    { key: 'vitamin_b12', label: 'Vitamin B12 (pg/mL)', type: 'lab', isHigherBetter: true, unit: 'pg/mL' },
    { key: 'vitamin_d', label: 'Vitamin D (ng/mL)', type: 'lab', isHigherBetter: true, unit: 'ng/mL' },
    { key: 'calcium', label: 'Calcium (mg/dL)', type: 'lab', isHigherBetter: true, unit: 'mg/dL' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Assessment Comparison</h2>
          <p className="text-gray-600 mt-1">
            Comparing assessments from {formatDate(assessment1.createdAt)} and {formatDate(assessment2.createdAt)}
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>
          Back to History
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'symptoms', label: 'Symptoms' },
            { id: 'lifestyle', label: 'Lifestyle' },
            { id: 'labs', label: 'Lab Results' },
            { id: 'ai', label: 'AI Analysis' }
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
        {activeTab === 'symptoms' && (
          <ComparisonTable 
            fields={symptomFields} 
            title="Symptom Comparison"
            assessment1={assessment1}
            assessment2={assessment2}
            formatDate={formatDate}
            formatValue={formatValue}
            getChangeIndicator={getChangeIndicator}
          />
        )}
        
        {activeTab === 'lifestyle' && (
          <ComparisonTable 
            fields={lifestyleFields} 
            title="Lifestyle Comparison"
            assessment1={assessment1}
            assessment2={assessment2}
            formatDate={formatDate}
            formatValue={formatValue}
            getChangeIndicator={getChangeIndicator}
          />
        )}
        
        {activeTab === 'labs' && (
          <ComparisonTable 
            fields={labFields} 
            title="Lab Results Comparison"
            assessment1={assessment1}
            assessment2={assessment2}
            formatDate={formatDate}
            formatValue={formatValue}
            getChangeIndicator={getChangeIndicator}
          />
        )}
        
        {activeTab === 'ai' && (
          <AIAnalysisComparison 
            assessment1={assessment1}
            assessment2={assessment2}
            formatDate={formatDate}
          />
        )}
      </div>

      {/* Export Options */}
      <Card>
        <div className="card-body">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Comparison</h3>
          <div className="flex space-x-4">
            <Button
              variant="secondary"
              onClick={() => globalThis.print()}
            >
              Print Comparison
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                // This would trigger a CSV export
                console.log('Export to CSV functionality would be implemented here');
              }}
            >
              Export to CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AssessmentComparison;