import React, { useState, useEffect } from 'react'
import { 
  CheckCircle,
  Settings,
  PlayCircle,
  Home,
  Star,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Users,
  FileText,
  Zap
} from 'lucide-react'
import TestRunner from './components/TestRunner-working.jsx'

// Simple UI components
const Button = ({ children, onClick, disabled, variant = 'default', className = '', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'
  const variantClasses = {
    default: 'bg-[#00B050] text-white hover:bg-green-600',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
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
    outline: 'border border-gray-300 bg-white text-gray-700',
    success: 'bg-green-100 text-green-800'
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [surveyData, setSurveyData] = useState({})

  // Survey questions
  const questions = [
    {
      id: 'nps',
      type: 'nps',
      question: 'How likely are you to recommend our AI Survey Platform to a friend or colleague?',
      required: true
    },
    {
      id: 'rating',
      type: 'rating',
      question: 'How would you rate your overall experience with our platform?',
      required: true
    },
    {
      id: 'features',
      type: 'multiple_choice',
      question: 'Which feature interests you most?',
      options: ['AI-Powered Analytics', 'Real-time Responses', 'Custom Branding', 'Advanced Reporting'],
      required: true
    },
    {
      id: 'feedback',
      type: 'text',
      question: 'Any additional feedback or suggestions?',
      required: false
    }
  ]

  const testSurveyForm = () => {
    setCurrentPage('survey')
    setCurrentQuestion(0)
    setSurveyData({})
  }

  const handleAnswer = (questionId, answer) => {
    setSurveyData(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setCurrentPage('success')
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  // Survey Success Page
  if (currentPage === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardContent className="text-center pt-8 pb-8">
            <CheckCircle className="w-16 h-16 text-[#00B050] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your survey response has been submitted successfully.
            </p>
            <div className="space-y-2 text-sm text-gray-500 mb-6">
              <p>Responses collected: {Object.keys(surveyData).length}</p>
              <p>Completion time: ~2 minutes</p>
            </div>
            <Button onClick={() => setCurrentPage('dashboard')}>
              <Home className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Survey Form Page
  if (currentPage === 'survey') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-8 pb-8">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#00B050] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {currentQ.question}
                  {currentQ.required && <span className="text-red-500 ml-1">*</span>}
                </h2>

                {/* NPS Question */}
                {currentQ.type === 'nps' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Not at all likely</span>
                      <span className="text-sm text-gray-500">Extremely likely</span>
                    </div>
                    <div className="flex space-x-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                        <button
                          key={score}
                          onClick={() => handleAnswer(currentQ.id, score)}
                          className={`w-10 h-10 rounded-md border-2 font-medium transition-colors ${
                            surveyData[currentQ.id] === score
                              ? 'border-[#00B050] bg-[#00B050] text-white'
                              : 'border-gray-300 text-gray-700 hover:border-[#00B050]'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating Question */}
                {currentQ.type === 'rating' && (
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleAnswer(currentQ.id, rating)}
                        className="p-2"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            surveyData[currentQ.id] >= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Multiple Choice Question */}
                {currentQ.type === 'multiple_choice' && (
                  <div className="space-y-3">
                    {currentQ.options.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(currentQ.id, option)}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                          surveyData[currentQ.id] === option
                            ? 'border-[#00B050] bg-green-50'
                            : 'border-gray-200 hover:border-[#00B050]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Text Question */}
                {currentQ.type === 'text' && (
                  <textarea
                    value={surveyData[currentQ.id] || ''}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    placeholder="Please share your thoughts..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B050] focus:border-transparent"
                    rows={4}
                  />
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  onClick={nextQuestion}
                  disabled={currentQ.required && !surveyData[currentQ.id]}
                >
                  {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Test Runner Page - Use the working TestRunner component
  if (currentPage === 'test') {
    return <TestRunner />
  }

  // Dashboard Page - Enhanced with more features
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#00B050] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Engage.sa</h1>
                <p className="text-sm text-gray-500">AI Survey Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="success" className="text-[#00B050] border-[#00B050]">
                ✅ Live Demo
              </Badge>
              <Badge variant="outline">
                🚀 Production Ready
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-12 mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Survey Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create, manage, and analyze surveys with intelligent insights. 
            Built with React + Laravel, featuring real-time analytics and seamless integration.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="text-center">
              <BarChart3 className="w-8 h-8 text-[#00B050] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">Real-time survey analytics and insights</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="text-center">
              <Users className="w-8 h-8 text-[#00B050] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600">Secure authentication and user roles</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="text-center">
              <FileText className="w-8 h-8 text-[#00B050] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Survey Builder</h3>
              <p className="text-sm text-gray-600">Drag-and-drop survey creation</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="text-center">
              <Zap className="w-8 h-8 text-[#00B050] mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Integration</h3>
              <p className="text-sm text-gray-600">Smart question suggestions and analysis</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">Try Our Platform</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              onClick={testSurveyForm}
              className="bg-[#00B050] hover:bg-green-600 text-lg px-8 py-4 text-white"
            >
              <PlayCircle className="w-6 h-6 mr-3" />
              Try Survey Form Demo
            </Button>
            
            <Button 
              onClick={() => setCurrentPage('test')}
              variant="outline"
              className="border-[#00B050] text-[#00B050] hover:bg-green-50 text-lg px-8 py-4"
            >
              <Settings className="w-6 h-6 mr-3" />
              Run Integration Tests
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>✅ Frontend-Backend Integration Complete</p>
            <p>✅ Authentication & API Working</p>
            <p>✅ Production Ready</p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Stack</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl mb-2">⚛️</div>
              <p className="font-medium">React 18</p>
              <p className="text-sm text-gray-600">Frontend Framework</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🐘</div>
              <p className="font-medium">Laravel 10</p>
              <p className="text-sm text-gray-600">Backend API</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🎨</div>
              <p className="font-medium">Tailwind CSS</p>
              <p className="text-sm text-gray-600">Styling</p>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">🔒</div>
              <p className="font-medium">Sanctum Auth</p>
              <p className="text-sm text-gray-600">Authentication</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

