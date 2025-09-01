// Working Test Runner Component for Integration Tests
import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Clock, Download, RefreshCw } from 'lucide-react';

// Simple UI components
const Button = ({ children, onClick, disabled, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'
  const variantClasses = {
    default: 'bg-[#00B050] text-white hover:bg-green-600',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
)

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

const Progress = ({ value, className = '' }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-[#00B050] h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
)

// Simple Integration Tester (without external dependencies)
class SimpleIntegrationTester {
  constructor() {
    this.baseURL = 'http://localhost:8000/api';
    this.testResults = [];
    this.authToken = null;
  }

  // Utility method to make API calls
  async apiCall(endpoint, method = 'GET', data = null, useAuth = false) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (useAuth && this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const config = {
      method,
      headers
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const result = await response.json();
      
      return {
        success: response.ok,
        status: response.status,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        error: error.message
      };
    }
  }

  // Log test results
  log(test, status, message, data = null) {
    const result = {
      test,
      status, // 'pass', 'fail', 'info'
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    return result;
  }

  // Test 1: API Health Check
  async testAPIHealth() {
    const result = await this.apiCall('/health');
    
    if (result.success && result.data.success) {
      return this.log('API Health Check', 'pass', 'API is responding correctly', result.data);
    } else {
      return this.log('API Health Check', 'fail', 'API health check failed', result);
    }
  }

  // Test 2: User Login
  async testUserLogin() {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const result = await this.apiCall('/auth/login', 'POST', loginData);
    
    if (result.success && result.data.success) {
      this.authToken = result.data.data.token;
      return this.log('User Login', 'pass', 'User logged in successfully', {
        user: result.data.data.user.email,
        hasToken: !!result.data.data.token
      });
    } else {
      return this.log('User Login', 'fail', 'User login failed', result.data);
    }
  }

  // Test 3: Protected Route Access
  async testProtectedRoute() {
    if (!this.authToken) {
      return this.log('Protected Route', 'fail', 'No auth token available');
    }
    
    const result = await this.apiCall('/auth/profile', 'GET', null, true);
    
    if (result.success && result.data.success) {
      return this.log('Protected Route', 'pass', 'Protected route accessed successfully', result.data.data);
    } else {
      return this.log('Protected Route', 'fail', 'Protected route access failed', result.data);
    }
  }

  // Test 4: Survey Creation
  async testSurveyCreation() {
    if (!this.authToken) {
      return this.log('Survey Creation', 'fail', 'No auth token available');
    }
    
    const surveyData = {
      title: 'Integration Test Survey',
      description: 'Testing the frontend-backend integration',
      category: 'testing',
      questions: [
        {
          type: 'nps',
          question: 'How likely are you to recommend our integration?',
          required: true
        },
        {
          type: 'text',
          question: 'Any additional feedback?',
          required: false
        }
      ],
      settings: {
        allow_anonymous: true,
        show_progress: true
      }
    };
    
    const result = await this.apiCall('/surveys', 'POST', surveyData, true);
    
    if (result.success && result.data.success) {
      this.testSurveyId = result.data.data.survey.id;
      return this.log('Survey Creation', 'pass', 'Survey created successfully', {
        id: result.data.data.survey.id,
        title: result.data.data.survey.title
      });
    } else {
      return this.log('Survey Creation', 'fail', 'Survey creation failed', result.data);
    }
  }

  // Test 5: Survey Retrieval
  async testSurveyRetrieval() {
    if (!this.authToken) {
      return this.log('Survey Retrieval', 'fail', 'No auth token available');
    }
    
    const result = await this.apiCall('/surveys', 'GET', null, true);
    
    if (result.success && result.data.success) {
      const surveys = result.data.data.data;
      return this.log('Survey Retrieval', 'pass', `Retrieved ${surveys.length} surveys`, {
        total: surveys.length
      });
    } else {
      return this.log('Survey Retrieval', 'fail', 'Survey retrieval failed', result.data);
    }
  }

  // Run all tests
  async runAllTests(onProgress) {
    this.testResults = [];
    
    const tests = [
      { name: 'API Health Check', method: this.testAPIHealth },
      { name: 'User Login', method: this.testUserLogin },
      { name: 'Protected Route', method: this.testProtectedRoute },
      { name: 'Survey Creation', method: this.testSurveyCreation },
      { name: 'Survey Retrieval', method: this.testSurveyRetrieval }
    ];
    
    const results = {};
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: tests.length,
          testName: test.name,
          status: 'running'
        });
      }
      
      try {
        const result = await test.method.call(this);
        results[test.name] = result.status === 'pass';
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: tests.length,
            testName: test.name,
            status: result.status,
            result: result
          });
        }
        
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        const errorResult = this.log(test.name, 'fail', `Test threw an error: ${error.message}`);
        results[test.name] = false;
        
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: tests.length,
            testName: test.name,
            status: 'fail',
            result: errorResult
          });
        }
      }
    }
    
    return results;
  }

  // Generate test report
  generateReport() {
    const passed = this.testResults.filter(r => r.status === 'pass').length;
    const failed = this.testResults.filter(r => r.status === 'fail').length;
    const total = passed + failed;
    
    return {
      summary: {
        total_tests: total,
        passed: passed,
        failed: failed,
        success_rate: total > 0 ? Math.round((passed / total) * 100) : 0,
        timestamp: new Date().toISOString()
      },
      results: this.testResults
    };
  }
}

export default function TestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [currentTest, setCurrentTest] = useState('');
  const [testLogs, setTestLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setResults(null);
    setTestLogs([]);
    setSummary(null);
    setCurrentTest('Initializing tests...');
    setProgress(0);

    try {
      const tester = new SimpleIntegrationTester();
      
      const testResults = await tester.runAllTests((progressInfo) => {
        setCurrentTest(`Running: ${progressInfo.testName}`);
        setProgress((progressInfo.current / progressInfo.total) * 100);
        
        if (progressInfo.result) {
          setTestLogs(prev => [...prev, progressInfo.result]);
        }
      });
      
      const report = tester.generateReport();
      
      setResults(testResults);
      setSummary(report.summary);
      setCurrentTest('Tests completed');
      setProgress(100);
    } catch (error) {
      console.error('Test execution failed:', error);
      setTestLogs(prev => [...prev, {
        test: 'Test Execution',
        status: 'fail',
        message: `Test execution failed: ${error.message}`,
        timestamp: new Date().toISOString()
      }]);
      setCurrentTest('Tests failed');
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    if (!summary || !testLogs) return;
    
    const report = {
      summary,
      results: testLogs,
      generated_at: new Date().toISOString()
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
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'info':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pass':
        return <Badge variant="success">PASS</Badge>;
      case 'fail':
        return <Badge variant="error">FAIL</Badge>;
      case 'info':
        return <Badge variant="default">INFO</Badge>;
      default:
        return <Badge variant="warning">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Integration Test Runner</h1>
          <p className="text-gray-600">
            Comprehensive testing of frontend-backend integration for the AI Survey Platform
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={runTests}
                  disabled={isRunning}
                  className="bg-[#00B050] hover:bg-green-600"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Integration Tests
                    </>
                  )}
                </Button>
                
                {summary && (
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                )}
              </div>
              
              {summary && (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Success Rate: <span className="font-semibold text-[#00B050]">{summary.success_rate}%</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {summary.passed} passed, {summary.failed} failed
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        {isRunning && (
          <Card className="mb-8">
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{currentTest}</span>
                  <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testLogs.length > 0 && (
          <Card>
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              <div className="space-y-3">
                {testLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(log.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-gray-900">{log.test}</h3>
                        {getStatusBadge(log.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.message}</p>
                      {log.data && (
                        <details className="text-xs text-gray-500">
                          <summary className="cursor-pointer hover:text-gray-700">View Details</summary>
                          <pre className="mt-2 p-2 bg-white rounded border overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {summary && !isRunning && (
          <Card className="mt-8">
            <CardContent>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{summary.total_tests}</div>
                  <div className="text-sm text-blue-600">Total Tests</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
                  <div className="text-sm text-green-600">Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                  <div className="text-sm text-red-600">Failed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{summary.success_rate}%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

