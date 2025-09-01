import React, { useState, useEffect } from 'react'
import TestRunner from './components/TestRunner.jsx'
import { 
  CheckCircle,
  Settings,
  PlayCircle,
  Home,
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import './App.css'

// Simple UI components to replace the problematic imports
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
    outline: 'border border-[#00B050] text-[#00B050] bg-white'
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard') // 'dashboard', 'survey', or 'test'
  const [surveyId, setSurveyId] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Check URL for survey ID or test page on load
  useEffect(() => {
    const path = window.location.pathname
    const surveyMatch = path.match(/\/survey\/(\d+)/)
    if (surveyMatch) {
      setSurveyId(surveyMatch[1])
      setCurrentPage('survey')
    } else if (path.includes('/test')) {
      setCurrentPage('test')
    }
  }, [])

  // Sample survey data for testing
  const sampleSurvey = {
    id: 1,
    title: "Customer Experience Survey",
    description: "Help us improve our service by sharing your feedback",
    category: "customer_satisfaction",
    estimated_time: "5-8 minutes",
    questions: [
      {
        type: "nps",
        question: "How likely are you to recommend our service to a friend or colleague?",
        required: true
      },
      {
        type: "rating",
        question: "How satisfied are you with our customer support?",
        required: true,
        options: { scale: 5 }
      },
      {
        type: "multiple_choice",
        question: "Which features do you use most frequently?",
        required: false,
        options: ["Dashboard", "Reports", "Analytics", "Integrations"]
      },
      {
        type: "text",
        question: "What improvements would you like to see?",
        required: false
      }
    ]
  }

  const testSurveyForm = () => {
    setSurveyId(1)
    setCurrentPage('survey')
    setCurrentQuestion(0)
    setResponses({})
    setIsCompleted(false)
  }

  // Survey form logic
  if (currentPage === 'survey' && surveyId) {
    const survey = sampleSurvey
    const totalQuestions = survey.questions.length
    const progress = ((currentQuestion + 1) / totalQuestions) * 100

    const nextQuestion = () => {
      const currentQ = survey.questions[currentQuestion]
      if (currentQ.required && !responses[currentQuestion]) {
        alert('This question is required')
        return
      }

      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1)
      } else {
        submitSurvey()
      }
    }

    const prevQuestion = () => {
      if (currentQuestion > 0) {
        setCurrentQuestion(prev => prev - 1)
      }
    }

    const submitSurvey = async () => {
      setIsSubmitting(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsCompleted(true)
      } catch (error) {
        console.error('Error submitting survey:', error)
      } finally {
        setIsSubmitting(false)
      }
    }

    const renderQuestion = (question, index) => {
      const response = responses[index]

      switch (question.type) {
        case 'nps':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <span className="text-sm text-gray-500">Not likely</span>
                  <div className="flex space-x-1">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                      <button
                        key={score}
                        onClick={() => setResponses(prev => ({ ...prev, [index]: score }))}
                        className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                          response === score
                            ? 'bg-[#00B050] border-[#00B050] text-white'
                            : 'border-gray-300 hover:border-[#00B050] hover:bg-green-50'
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">Very likely</span>
                </div>
              </div>
            </div>
          )

        case 'rating':
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setResponses(prev => ({ ...prev, [index]: rating }))}
                      className="p-2"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          response >= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )

        case 'multiple_choice':
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={response === option}
                      onChange={() => setResponses(prev => ({ ...prev, [index]: option }))}
                      className="w-4 h-4 text-[#00B050] border-gray-300 focus:ring-[#00B050]"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )

        case 'text':
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h3>
              <textarea
                value={response || ''}
                onChange={(e) => setResponses(prev => ({ ...prev, [index]: e.target.value }))}
                placeholder="Please share your thoughts..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00B050] focus:border-transparent"
                rows={4}
              />
            </div>
          )

        default:
          return <div>Question type not supported</div>
      }
    }

    if (isCompleted) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-[#00B050] mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600">
                  Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-[#00B050] hover:bg-green-600"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[#00B050] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Engage.sa</h1>
                  <p className="text-sm text-gray-500">Survey Platform</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[#00B050] border-[#00B050]">
                {survey.estimated_time}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="mb-8">
            <CardContent className="pt-8 pb-8">
              {renderQuestion(survey.questions[currentQuestion], currentQuestion)}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={nextQuestion}
              disabled={isSubmitting}
              className="bg-[#00B050] hover:bg-green-600 flex items-center space-x-2"
            >
              <span>{currentQuestion === totalQuestions - 1 ? (isSubmitting ? 'Submitting...' : 'Submit') : 'Next'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Test Runner Page
  if (currentPage === 'test') {
    return <TestRunner />
  }

  // Dashboard Page
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
                <p className="text-sm text-gray-500">Survey Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-[#00B050] border-[#00B050]">
                Live Demo
              </Badge>
              <Button 
                onClick={testSurveyForm}
                className="bg-[#00B050] hover:bg-green-600"
              >
                Test Survey Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Survey Platform Dashboard</h2>
          <p className="text-lg text-gray-600 mb-8">
            Create, manage, and analyze surveys with AI-powered insights
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={testSurveyForm}
              className="bg-[#00B050] hover:bg-green-600 text-lg px-8 py-3"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Try Survey Form Demo
            </Button>
            <Button 
              onClick={() => setCurrentPage('test')}
              variant="outline"
              className="border-[#00B050] text-[#00B050] hover:bg-green-50 text-lg px-8 py-3"
            >
              <Settings className="w-5 h-5 mr-2" />
              Run Integration Tests
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

