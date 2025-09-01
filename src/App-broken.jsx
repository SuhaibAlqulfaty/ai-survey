import React, { useState } from 'react'
import TestRunner from './components/TestRunner.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Eye,
  Save,
  Sparkles,
  Settings,
  Copy,
  Trash2,
  X,
  Plus,
  CheckSquare,
  Send,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  ArrowLeft,
  ArrowRight,
  Home,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Zap,
  Globe,
  Mail,
  Phone,
  Share2,
  PlayCircle
} from 'lucide-react'
import './App.css'

export default function App() {
  const [activeView, setActiveView] = useState('overview')
  const [currentPage, setCurrentPage] = useState('dashboard') // 'dashboard', 'survey', or 'test'
  const [surveyId, setSurveyId] = useState(null)
  const [aiGoal, setAiGoal] = useState('customer satisfaction with our mobile app and user experience feedback')
  const [aiAudience, setAiAudience] = useState('existing_customers')
  const [aiLength, setAiLength] = useState('short')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState([])

  // Survey form state
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
        question: "What improvements would you like to see in our service?",
        required: false
      }
    ]
  }

  // Survey Form Component
  const SurveyForm = () => {
    const survey = sampleSurvey
    const totalQuestions = survey.questions.length
    const progress = ((currentQuestion + 1) / totalQuestions) * 100

    const handleResponse = (value) => {
      setResponses(prev => ({
        ...prev,
        [currentQuestion]: value
      }))
    }

    const nextQuestion = () => {
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
        // Here we'll integrate with the Laravel backend
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
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
                        onClick={() => handleResponse(score)}
                        className={`w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
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
          const scale = question.options?.scale || 5
          return (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h3>
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: scale }, (_, i) => i + 1).map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleResponse(rating)}
                      className={`p-3 transition-all ${
                        response === rating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2 max-w-xs mx-auto">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          )

        case 'multiple_choice':
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleResponse(option)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      response === option
                        ? 'border-[#00B050] bg-green-50 text-[#00B050]'
                        : 'border-gray-200 hover:border-[#00B050] hover:bg-green-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        response === option
                          ? 'border-[#00B050] bg-[#00B050]'
                          : 'border-gray-300'
                      }`}>
                        {response === option && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )

        case 'text':
          return (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">{question.question}</h3>
              <textarea
                value={response || ''}
                onChange={(e) => handleResponse(e.target.value)}
                placeholder="Please share your thoughts..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-[#00B050] focus:outline-none resize-none"
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

    // Test Runner Page
    if (currentPage === 'test') {
      return <TestRunner />
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

        {/* Survey Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">{survey.title}</CardTitle>
              <CardDescription className="text-lg">{survey.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              {renderQuestion(survey.questions[currentQuestion], currentQuestion)}
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  onClick={nextQuestion}
                  disabled={!responses[currentQuestion] && survey.questions[currentQuestion].required}
                  className="bg-[#00B050] hover:bg-green-600 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : currentQuestion === totalQuestions - 1 ? (
                    <>
                      <span>Submit Survey</span>
                      <Send className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Test survey form by simulating URL
  const testSurveyForm = () => {
    setCurrentPage('survey')
    setSurveyId('1')
  }

  // Main render logic
  if (currentPage === 'survey') {
    return <SurveyForm />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-[#00B050] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Engage.sa</h1>
                <p className="text-sm text-gray-500">Survey Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-[#00B050] border-[#00B050]">
                <div className="w-2 h-2 bg-[#00B050] rounded-full mr-2"></div>
                Live Data
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

