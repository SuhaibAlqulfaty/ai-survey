// Comprehensive Integration Tests for Frontend-Backend
import apiClient from '../api/client';

class IntegrationTester {
  constructor() {
    this.results = [];
    this.testUser = {
      name: 'Test User',
      email: 'test@engage.sa',
      password: 'password123',
      company: 'Engage.sa',
      role: 'admin'
    };
    this.testSurvey = null;
    this.authToken = null;
  }

  // Log test results
  log(test, status, message, data = null) {
    const result = {
      test,
      status,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    this.results.push(result);
    
    const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${emoji} ${test}: ${message}`);
    
    if (data) {
      console.log('   Data:', data);
    }
  }

  // Test 1: API Health Check
  async testHealthCheck() {
    try {
      const response = await apiClient.healthCheck();
      this.log('Health Check', 'PASS', 'API is responding', response);
      return true;
    } catch (error) {
      this.log('Health Check', 'FAIL', `API not responding: ${error.message}`);
      return false;
    }
  }

  // Test 2: User Registration
  async testUserRegistration() {
    try {
      const response = await apiClient.register(this.testUser);
      
      if (response.token && response.user) {
        this.authToken = response.token;
        this.log('User Registration', 'PASS', 'User registered successfully', {
          userId: response.user.id,
          email: response.user.email,
          hasToken: !!response.token
        });
        return true;
      } else {
        this.log('User Registration', 'FAIL', 'Registration response missing token or user');
        return false;
      }
    } catch (error) {
      this.log('User Registration', 'FAIL', `Registration failed: ${error.message}`);
      return false;
    }
  }

  // Test 3: User Login
  async testUserLogin() {
    try {
      // First logout to clear any existing session
      await apiClient.logout();
      
      const response = await apiClient.login({
        email: this.testUser.email,
        password: this.testUser.password
      });
      
      if (response.token && response.user) {
        this.authToken = response.token;
        this.log('User Login', 'PASS', 'User logged in successfully', {
          userId: response.user.id,
          email: response.user.email,
          hasToken: !!response.token
        });
        return true;
      } else {
        this.log('User Login', 'FAIL', 'Login response missing token or user');
        return false;
      }
    } catch (error) {
      this.log('User Login', 'FAIL', `Login failed: ${error.message}`);
      return false;
    }
  }

  // Test 4: Get User Profile
  async testGetProfile() {
    try {
      const response = await apiClient.getProfile();
      
      if (response.user && response.user.email === this.testUser.email) {
        this.log('Get Profile', 'PASS', 'Profile retrieved successfully', {
          userId: response.user.id,
          email: response.user.email,
          name: response.user.name
        });
        return true;
      } else {
        this.log('Get Profile', 'FAIL', 'Profile data incorrect or missing');
        return false;
      }
    } catch (error) {
      this.log('Get Profile', 'FAIL', `Get profile failed: ${error.message}`);
      return false;
    }
  }

  // Test 5: Create Survey
  async testCreateSurvey() {
    try {
      const surveyData = {
        title: 'Test Survey Integration',
        description: 'This is a test survey for integration testing',
        category: 'customer_satisfaction',
        estimated_time: '5-10 minutes',
        questions: [
          {
            id: 1,
            type: 'nps',
            question: 'How likely are you to recommend our service?',
            required: true,
            options: {
              scale: 10,
              leftLabel: 'Not likely',
              rightLabel: 'Very likely'
            }
          },
          {
            id: 2,
            type: 'rating',
            question: 'How satisfied are you with our customer support?',
            required: true,
            options: {
              scale: 5,
              type: 'stars'
            }
          },
          {
            id: 3,
            type: 'text',
            question: 'What improvements would you like to see?',
            required: false,
            options: {
              maxLength: 500,
              placeholder: 'Share your thoughts...'
            }
          }
        ],
        settings: {
          collectEmail: false,
          anonymous: true,
          oneResponsePerPerson: true,
          showProgressBar: true
        }
      };

      const response = await apiClient.createSurvey(surveyData);
      
      if (response.survey && response.survey.id) {
        this.testSurvey = response.survey;
        this.log('Create Survey', 'PASS', 'Survey created successfully', {
          surveyId: response.survey.id,
          title: response.survey.title,
          status: response.survey.status,
          questionCount: response.survey.questions?.length || 0
        });
        return true;
      } else {
        this.log('Create Survey', 'FAIL', 'Survey creation response missing survey data');
        return false;
      }
    } catch (error) {
      this.log('Create Survey', 'FAIL', `Survey creation failed: ${error.message}`);
      return false;
    }
  }

  // Test 6: Get Surveys List
  async testGetSurveys() {
    try {
      const response = await apiClient.getSurveys();
      
      if (response.surveys && Array.isArray(response.surveys)) {
        const foundTestSurvey = response.surveys.find(s => s.id === this.testSurvey?.id);
        
        this.log('Get Surveys', 'PASS', 'Surveys retrieved successfully', {
          totalSurveys: response.surveys.length,
          testSurveyFound: !!foundTestSurvey,
          pagination: response.pagination || 'No pagination'
        });
        return true;
      } else {
        this.log('Get Surveys', 'FAIL', 'Surveys response missing or invalid format');
        return false;
      }
    } catch (error) {
      this.log('Get Surveys', 'FAIL', `Get surveys failed: ${error.message}`);
      return false;
    }
  }

  // Test 7: Get Single Survey
  async testGetSingleSurvey() {
    if (!this.testSurvey) {
      this.log('Get Single Survey', 'SKIP', 'No test survey available');
      return false;
    }

    try {
      const response = await apiClient.getSurvey(this.testSurvey.id);
      
      if (response.survey && response.survey.id === this.testSurvey.id) {
        this.log('Get Single Survey', 'PASS', 'Single survey retrieved successfully', {
          surveyId: response.survey.id,
          title: response.survey.title,
          hasQuestions: !!response.survey.questions,
          hasAnalytics: !!response.survey.analytics
        });
        return true;
      } else {
        this.log('Get Single Survey', 'FAIL', 'Single survey response incorrect');
        return false;
      }
    } catch (error) {
      this.log('Get Single Survey', 'FAIL', `Get single survey failed: ${error.message}`);
      return false;
    }
  }

  // Test 8: Publish Survey
  async testPublishSurvey() {
    if (!this.testSurvey) {
      this.log('Publish Survey', 'SKIP', 'No test survey available');
      return false;
    }

    try {
      const response = await apiClient.publishSurvey(this.testSurvey.id);
      
      if (response.survey && response.survey.status === 'published') {
        this.log('Publish Survey', 'PASS', 'Survey published successfully', {
          surveyId: response.survey.id,
          status: response.survey.status,
          publishedAt: response.survey.published_at
        });
        return true;
      } else {
        this.log('Publish Survey', 'FAIL', 'Survey publish response incorrect');
        return false;
      }
    } catch (error) {
      this.log('Publish Survey', 'FAIL', `Publish survey failed: ${error.message}`);
      return false;
    }
  }

  // Test 9: Get Public Survey (No Auth Required)
  async testGetPublicSurvey() {
    if (!this.testSurvey) {
      this.log('Get Public Survey', 'SKIP', 'No test survey available');
      return false;
    }

    try {
      // Temporarily remove auth token to test public access
      const originalToken = apiClient.getToken();
      apiClient.setToken(null);
      
      const response = await apiClient.getPublicSurvey(this.testSurvey.id);
      
      // Restore auth token
      apiClient.setToken(originalToken);
      
      if (response.survey && response.survey.id === this.testSurvey.id) {
        this.log('Get Public Survey', 'PASS', 'Public survey retrieved successfully', {
          surveyId: response.survey.id,
          title: response.survey.title,
          isPublic: true,
          hasQuestions: !!response.survey.questions
        });
        return true;
      } else {
        this.log('Get Public Survey', 'FAIL', 'Public survey response incorrect');
        return false;
      }
    } catch (error) {
      this.log('Get Public Survey', 'FAIL', `Get public survey failed: ${error.message}`);
      return false;
    }
  }

  // Test 10: Submit Public Response (No Auth Required)
  async testSubmitPublicResponse() {
    if (!this.testSurvey) {
      this.log('Submit Public Response', 'SKIP', 'No test survey available');
      return false;
    }

    try {
      // Temporarily remove auth token to test public access
      const originalToken = apiClient.getToken();
      apiClient.setToken(null);
      
      const responseData = {
        answers: {
          1: 9, // NPS score
          2: 5, // Rating
          3: 'Great service, keep up the good work!' // Text feedback
        },
        metadata: {
          userAgent: 'Integration Test',
          ipAddress: '127.0.0.1',
          startTime: new Date().toISOString(),
          completionTime: 45 // seconds
        }
      };

      const response = await apiClient.submitPublicResponse(this.testSurvey.id, responseData);
      
      // Restore auth token
      apiClient.setToken(originalToken);
      
      if (response.response && response.response.id) {
        this.log('Submit Public Response', 'PASS', 'Public response submitted successfully', {
          responseId: response.response.id,
          surveyId: this.testSurvey.id,
          npsScore: response.response.nps_score,
          sentiment: response.response.sentiment
        });
        return true;
      } else {
        this.log('Submit Public Response', 'FAIL', 'Public response submission failed');
        return false;
      }
    } catch (error) {
      this.log('Submit Public Response', 'FAIL', `Submit public response failed: ${error.message}`);
      return false;
    }
  }

  // Test 11: Get Survey Analytics
  async testGetSurveyAnalytics() {
    if (!this.testSurvey) {
      this.log('Get Survey Analytics', 'SKIP', 'No test survey available');
      return false;
    }

    try {
      const response = await apiClient.getSurveyAnalytics(this.testSurvey.id);
      
      if (response.analytics) {
        this.log('Get Survey Analytics', 'PASS', 'Survey analytics retrieved successfully', {
          totalResponses: response.analytics.total_responses,
          npsScore: response.analytics.nps_score,
          completionRate: response.analytics.completion_rate,
          sentimentBreakdown: response.analytics.sentiment_breakdown
        });
        return true;
      } else {
        this.log('Get Survey Analytics', 'FAIL', 'Analytics response missing');
        return false;
      }
    } catch (error) {
      this.log('Get Survey Analytics', 'FAIL', `Get analytics failed: ${error.message}`);
      return false;
    }
  }

  // Test 12: Get Dashboard Stats
  async testGetDashboardStats() {
    try {
      const response = await apiClient.getDashboardStats();
      
      if (response.stats) {
        this.log('Get Dashboard Stats', 'PASS', 'Dashboard stats retrieved successfully', {
          totalSurveys: response.stats.total_surveys,
          totalResponses: response.stats.total_responses,
          avgNPS: response.stats.average_nps,
          responseRate: response.stats.response_rate
        });
        return true;
      } else {
        this.log('Get Dashboard Stats', 'FAIL', 'Dashboard stats response missing');
        return false;
      }
    } catch (error) {
      this.log('Get Dashboard Stats', 'FAIL', `Get dashboard stats failed: ${error.message}`);
      return false;
    }
  }

  // Test 13: User Logout
  async testUserLogout() {
    try {
      await apiClient.logout();
      
      // Try to access protected endpoint to verify logout
      try {
        await apiClient.getProfile();
        this.log('User Logout', 'FAIL', 'Still able to access protected endpoint after logout');
        return false;
      } catch (error) {
        if (error.message.includes('Authentication required')) {
          this.log('User Logout', 'PASS', 'User logged out successfully', {
            tokenCleared: !apiClient.getToken(),
            protectedAccessBlocked: true
          });
          return true;
        } else {
          this.log('User Logout', 'FAIL', `Unexpected error after logout: ${error.message}`);
          return false;
        }
      }
    } catch (error) {
      this.log('User Logout', 'FAIL', `Logout failed: ${error.message}`);
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Comprehensive Integration Tests...\n');
    
    const tests = [
      () => this.testHealthCheck(),
      () => this.testUserRegistration(),
      () => this.testUserLogin(),
      () => this.testGetProfile(),
      () => this.testCreateSurvey(),
      () => this.testGetSurveys(),
      () => this.testGetSingleSurvey(),
      () => this.testPublishSurvey(),
      () => this.testGetPublicSurvey(),
      () => this.testSubmitPublicResponse(),
      () => this.testGetSurveyAnalytics(),
      () => this.testGetDashboardStats(),
      () => this.testUserLogout(),
    ];

    let passed = 0;
    let failed = 0;
    let skipped = 0;

    for (const test of tests) {
      try {
        const result = await test();
        if (result === true) passed++;
        else if (result === false) failed++;
        else skipped++;
      } catch (error) {
        console.error('Test execution error:', error);
        failed++;
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Print summary
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⚠️ Skipped: ${skipped}`);
    console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

    return {
      passed,
      failed,
      skipped,
      results: this.results,
      successRate: Math.round((passed / (passed + failed)) * 100)
    };
  }

  // Generate test report
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        passed: this.results.filter(r => r.status === 'PASS').length,
        failed: this.results.filter(r => r.status === 'FAIL').length,
        skipped: this.results.filter(r => r.status === 'SKIP').length,
      },
      details: this.results
    };

    console.log('\n📋 Detailed Test Report:');
    console.log(JSON.stringify(report, null, 2));

    return report;
  }
}

// Export for use in other files
export default IntegrationTester;

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && window.location.pathname.includes('test')) {
  const tester = new IntegrationTester();
  tester.runAllTests().then(() => {
    tester.generateReport();
  });
}

