// Test Runner Component for Integration Tests
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Clock, Download } from 'lucide-react';
import IntegrationTester from '../tests/integration-test';

export default function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [currentTest, setCurrentTest] = useState('');
  const [testLogs, setTestLogs] = useState([]);
  const [summary, setSummary] = useState(null);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);
    setTestLogs([]);
    setSummary(null);
    setCurrentTest('Initializing tests...');

    try {
      const tester = new IntegrationTester();
      
      // Override the log method to capture real-time updates
      const originalLog = tester.log.bind(tester);
      tester.log = (test, status, message, data = null) => {
        const logEntry = {
          test,
          status,
          message,
          data,
          timestamp: new Date().toISOString()
        };
        
        setTestLogs(prev => [...prev, logEntry]);
        setCurrentTest(`Running: ${test}`);
        
        // Call original log method
        originalLog(test, status, message, data);
      };

      const testResults = await tester.runAllTests();
      const report = tester.generateReport();
      
      setResults(testResults);
      setSummary(report.summary);
      setCurrentTest('Tests completed');
    } catch (error) {
      console.error('Test execution failed:', error);
      setTestLogs(prev => [...prev, {
        test: 'Test Execution',
        status: 'FAIL',
        message: `Test execution failed: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!results) return;

    const report = {
      timestamp: new Date().toISOString(),
      summary,
      testLogs,
      results
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `integration-test-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAIL':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'SKIP':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'FAIL':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'SKIP':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Integration Test Runner</h1>
            <p className="text-gray-600 mt-1">
              Comprehensive tests for Frontend-Backend integration
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              <span>{isRunning ? 'Running Tests...' : 'Run All Tests'}</span>
            </button>
            
            {results && (
              <button
                onClick={downloadReport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
            )}
          </div>
        </div>

        {/* Current Test Status */}
        {isRunning && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium">{currentTest}</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
              <div className="text-sm text-green-600">Passed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.skipped}</div>
              <div className="text-sm text-yellow-600">Skipped</div>
            </div>
          </div>
          
          {results && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <span className="text-lg font-semibold">Success Rate: </span>
                <span className={`text-lg font-bold ${results.successRate >= 80 ? 'text-green-600' : results.successRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {results.successRate}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Results */}
      {testLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testLogs.map((log, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(log.status)}`}
              >
                <div className="flex items-start space-x-3">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{log.test}</h3>
                      <span className="text-xs opacity-75">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{log.message}</p>
                    
                    {log.data && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer hover:underline">
                          View Details
                        </summary>
                        <pre className="text-xs mt-2 p-2 bg-white bg-opacity-50 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Categories */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">🔐 Authentication Tests</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• User Registration</li>
              <li>• User Login</li>
              <li>• Profile Management</li>
              <li>• User Logout</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">📊 Survey Management</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Create Survey</li>
              <li>• Get Surveys List</li>
              <li>• Get Single Survey</li>
              <li>• Publish Survey</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">📝 Response Collection</h3>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Get Public Survey</li>
              <li>• Submit Public Response</li>
              <li>• Survey Analytics</li>
              <li>• Dashboard Stats</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Endpoints Tested */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints Tested</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Authentication Endpoints</h3>
            <ul className="text-sm text-gray-600 space-y-1 font-mono">
              <li>POST /api/auth/register</li>
              <li>POST /api/auth/login</li>
              <li>GET /api/auth/profile</li>
              <li>POST /api/auth/logout</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Survey Endpoints</h3>
            <ul className="text-sm text-gray-600 space-y-1 font-mono">
              <li>GET /api/surveys</li>
              <li>POST /api/surveys</li>
              <li>GET /api/surveys/{'{id}'}</li>
              <li>POST /api/surveys/{'{id}'}/publish</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Public Endpoints</h3>
            <ul className="text-sm text-gray-600 space-y-1 font-mono">
              <li>GET /api/surveys/{'{id}'}/public</li>
              <li>POST /api/surveys/{'{id}'}/public/responses</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Analytics Endpoints</h3>
            <ul className="text-sm text-gray-600 space-y-1 font-mono">
              <li>GET /api/surveys/{'{id}'}/analytics</li>
              <li>GET /api/dashboard/stats</li>
              <li>GET /api/health</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

