import React, { useState } from 'react'
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
  Zap,
  Globe,
  Mail,
  Smartphone,
  Share2,
  Code,
  Bell,
  Shield,
  Calendar,
  FileText,
  Edit3,
  PlayCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import './App.css'

export default function App() {
  const [activeView, setActiveView] = useState('overview')
  const [aiGoal, setAiGoal] = useState('customer satisfaction with our mobile app and user experience feedback')
  const [aiAudience, setAiAudience] = useState('existing_customers')
  const [aiLength, setAiLength] = useState('short')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState([])

  const generateQuestionsWithAI = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'system',
            content: 'You are a professional survey designer. Generate survey questions based on the provided goal, audience, and length. Return a JSON array of questions with type, text, and options (if applicable).'
          }, {
            role: 'user',
            content: `Generate ${aiLength === 'short' ? '5-8' : aiLength === 'medium' ? '10-15' : '15+'} survey questions for: ${aiGoal}. Target audience: ${aiAudience}. Include a mix of NPS, rating, multiple choice, and text questions.`
          }],
          temperature: 0.7,
          max_tokens: 1500
        })
      })
      
      const data = await response.json()
      const questions = JSON.parse(data.choices[0].message.content)
      setGeneratedQuestions(questions)
    } catch (error) {
      console.error('Error generating questions:', error)
      setGeneratedQuestions([
        { type: 'nps', text: 'How likely are you to recommend our mobile app?', explanation: 'Standard NPS question to measure customer loyalty' },
        { type: 'rating', text: 'How would you rate the overall user experience?', explanation: 'Measures satisfaction with app usability' },
        { type: 'multiple', text: 'Which features do you use most frequently?', options: ['Dashboard', 'Reports', 'Settings', 'Support'], explanation: 'Identifies popular features for prioritization' }
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  // Sample data for charts
  const npsData = [
    { score: 0, count: 12 }, { score: 1, count: 8 }, { score: 2, count: 15 },
    { score: 3, count: 22 }, { score: 4, count: 31 }, { score: 5, count: 45 },
    { score: 6, count: 67 }, { score: 7, count: 156 }, { score: 8, count: 234 },
    { score: 9, count: 312 }, { score: 10, count: 347 }
  ]

  const sentimentData = [
    { name: 'Positive', value: 810, color: '#00B050' },
    { name: 'Neutral', value: 312, color: '#9CA3AF' },
    { name: 'Negative', value: 125, color: '#EF4444' }
  ]

  const themesData = [
    { theme: 'Bugs', count: 89 },
    { theme: 'Features', count: 156 },
    { theme: 'Performance', count: 134 },
    { theme: 'UI/UX', count: 98 },
    { theme: 'Pricing', count: 67 },
    { theme: 'Support', count: 123 }
  ]

  const trendData = [
    { month: 'Jan', nps: 38 }, { month: 'Feb', nps: 35 }, { month: 'Mar', nps: 39 },
    { month: 'Apr', nps: 41 }, { month: 'May', nps: 40 }, { month: 'Jun', nps: 42 }
  ]

  const responses = [
    { id: '#0001', date: '2024-06-15 15:58', user: 'User #aB3xZ9qR', nps: 9, sentiment: 'Positive', feedback: 'Great customer service, very responsive team!' },
    { id: '#0002', date: '2024-06-15 15:56', user: 'User #kL8mN4pQ', nps: 3, sentiment: 'Negative', feedback: 'The new dashboard is confusing and hard to navigate' },
    { id: '#0003', date: '2024-06-15 15:54', user: 'User #wX7yZ2vB', nps: 8, sentiment: 'Positive', feedback: 'Pricing is reasonable for the features provided' },
    { id: '#0004', date: '2024-06-15 15:52', user: 'User #dF5gH9jK', nps: 7, sentiment: 'Positive', feedback: 'Loading times have improved significantly' },
    { id: '#0005', date: '2024-06-15 15:50', user: 'User #mN9oP3qR', nps: 6, sentiment: 'Neutral', feedback: 'Would love to see more integrations with third-party tools' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
              Engage.sa
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Survey Platform</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live Data
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveView('overview')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeView === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveView('create')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeView === 'create'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Create Survey
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeView === 'analytics'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveView('responses')}
            className={`py-4 px-2 border-b-2 font-medium text-sm ${
              activeView === 'responses'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Responses
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main className="p-6">
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Surveys</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">+2 this month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Responses</p>
                      <p className="text-2xl font-bold text-gray-900">3,247</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">+156 this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg NPS Score</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">+3 from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-bold text-gray-900">68%</p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    <span className="text-red-600">-2% vs industry</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">VIP customer gave low NPS score</p>
                        <p className="text-sm text-red-600">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Negative sentiment spike in "Performance" theme</p>
                        <p className="text-sm text-yellow-600">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Response rate increased by 12% this week</p>
                        <p className="text-sm text-blue-600">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-green-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      onClick={() => setActiveView('create')}
                      className="h-20 flex-col space-y-2 bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Create Survey</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveView('analytics')}
                      className="h-20 flex-col space-y-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <BarChart3 className="w-6 h-6" />
                      <span>View Analytics</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveView('responses')}
                      className="h-20 flex-col space-y-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <MessageSquare className="w-6 h-6" />
                      <span>View Responses</span>
                    </Button>
                    <Button 
                      variant="outline"
                      className="h-20 flex-col space-y-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Download className="w-6 h-6" />
                      <span>Export Data</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>NPS Trend (Last 6 Months)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="nps" stroke="#00B050" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {sentimentData.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Survey Creation */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-600" />
                    Survey Information
                  </CardTitle>
                  <CardDescription>Basic details about your survey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Survey Title</label>
                    <input
                      type="text"
                      placeholder="Enter survey title..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      defaultValue="Customer Experience Survey"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Describe your survey..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                      defaultValue="Help us improve our service by sharing your experience and feedback."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Customer Experience</option>
                        <option>Product Feedback</option>
                        <option>Employee Satisfaction</option>
                        <option>Market Research</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Time</label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>2-3 minutes</option>
                        <option>3-5 minutes</option>
                        <option>5-10 minutes</option>
                        <option>10+ minutes</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Question Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                    AI Question Generator
                  </CardTitle>
                  <CardDescription>Let AI suggest relevant questions based on your survey goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to learn?</label>
                    <textarea
                      value={aiGoal}
                      onChange={(e) => setAiGoal(e.target.value)}
                      placeholder="Describe your survey objectives..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                      <select 
                        value={aiAudience} 
                        onChange={(e) => setAiAudience(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="existing_customers">Existing Customers</option>
                        <option value="potential_customers">Potential Customers</option>
                        <option value="employees">Employees</option>
                        <option value="website_visitors">Website Visitors</option>
                        <option value="event_attendees">Event Attendees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Survey Length</label>
                      <select 
                        value={aiLength} 
                        onChange={(e) => setAiLength(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="short">Short (5-8 questions)</option>
                        <option value="medium">Medium (10-15 questions)</option>
                        <option value="long">Long (15+ questions)</option>
                      </select>
                    </div>
                  </div>
                  <Button 
                    onClick={generateQuestionsWithAI}
                    disabled={isGenerating}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Questions with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Generated Questions */}
              {generatedQuestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Generated Questions</CardTitle>
                    <CardDescription>Review and add questions to your survey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedQuestions.map((question, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {question.type.toUpperCase()}
                                </Badge>
                              </div>
                              <p className="font-medium text-gray-900 mb-1">{question.text}</p>
                              <p className="text-sm text-gray-600">{question.explanation}</p>
                              {question.options && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Options:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {question.options.map((option, optIndex) => (
                                      <Badge key={optIndex} variant="secondary" className="text-xs">
                                        {option}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <Button size="sm" variant="outline" className="ml-4">
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Templates</CardTitle>
                  <CardDescription>Start with proven survey templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { name: 'Customer Satisfaction', questions: 8, icon: '😊', desc: 'Measure overall customer satisfaction and loyalty' },
                      { name: 'Product Feedback', questions: 12, icon: '📦', desc: 'Gather insights about product features and usability' },
                      { name: 'Employee Engagement', questions: 15, icon: '👥', desc: 'Assess workplace satisfaction and engagement levels' },
                      { name: 'Event Feedback', questions: 6, icon: '🎉', desc: 'Collect feedback from event attendees' }
                    ].map((template, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{template.icon}</div>
                          <div>
                            <h3 className="font-medium text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600">{template.desc}</p>
                            <Badge variant="secondary" className="text-xs mt-1">{template.questions} questions</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Use Template</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-green-600" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>See how your survey will look to respondents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Customer Experience Survey</h2>
                        <p className="text-gray-600 mb-4">Help us improve our service by sharing your experience and feedback.</p>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                          <span>2-3 minutes</span>
                          <Badge variant="secondary">Customer Experience</Badge>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>0 of 5 questions</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge className="bg-green-100 text-green-800">1</Badge>
                            <span className="font-medium">How likely are you to recommend our service? *</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Not likely</span>
                            <span className="text-sm text-gray-600">Very likely</span>
                          </div>
                          <div className="flex space-x-2">
                            {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                              <button key={num} className="w-8 h-8 border border-gray-300 rounded hover:bg-green-50 hover:border-green-300 text-sm">
                                {num}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge className="bg-blue-100 text-blue-800">2</Badge>
                            <span className="font-medium">How satisfied are you with our customer support? *</span>
                          </div>
                          <div className="flex space-x-2">
                            {[1,2,3,4,5].map(num => (
                              <Star key={num} className="w-8 h-8 text-gray-300 hover:text-yellow-400 cursor-pointer" />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Click to rate from 1 to 5 stars</p>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge className="bg-purple-100 text-purple-800">3</Badge>
                            <span className="font-medium">Which features do you use most often?</span>
                          </div>
                          <div className="space-y-2">
                            {['Dashboard', 'Reports', 'Analytics', 'Integrations'].map(option => (
                              <label key={option} className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded border-gray-300" />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                        <Button variant="outline" disabled>
                          ← Previous
                        </Button>
                        <span className="text-sm text-gray-600">Question 1 of 5</span>
                        <Button className="bg-green-600 hover:bg-green-700">
                          Next →
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Survey Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-green-600" />
                    Survey Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Response Collection</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Collect Email Addresses', desc: 'Require respondents to provide email', checked: false },
                        { label: 'Anonymous Responses', desc: 'Hide respondent identity', checked: true },
                        { label: 'One Response Per Person', desc: 'Prevent duplicate submissions', checked: true },
                        { label: 'Show Progress Bar', desc: 'Display completion progress', checked: true }
                      ].map((setting, index) => (
                        <label key={index} className="flex items-start space-x-3">
                          <input type="checkbox" defaultChecked={setting.checked} className="mt-1 rounded border-gray-300" />
                          <div>
                            <div className="font-medium text-sm">{setting.label}</div>
                            <div className="text-xs text-gray-600">{setting.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Distribution</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Survey URL</label>
                        <div className="flex">
                          <input 
                            type="text" 
                            value="https://engage.sa/survey/customer-experience-2024"
                            readOnly
                            className="flex-1 p-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                          />
                          <Button variant="outline" className="rounded-l-none">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <Mail className="w-4 h-4 mr-2" />
                          Share via Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Smartphone className="w-4 h-4 mr-2" />
                          Share via SMS
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Social Media
                        </Button>
                        <Button variant="outline" size="sm">
                          <Code className="w-4 h-4 mr-2" />
                          Embed Code
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <Button variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => setActiveView('test-survey')}>
                      <Target className="w-4 h-4 mr-2" />
                      Test Survey
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <Send className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeView === 'test-survey' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Test Survey - Customer Experience Survey</CardTitle>
                    <CardDescription>Preview and test your survey before publishing</CardDescription>
                  </div>
                  <Button variant="outline" onClick={() => setActiveView('create')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Editor
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-w-2xl mx-auto">
                  {/* Survey Test Interface */}
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Experience Survey</h2>
                      <p className="text-gray-600">Help us improve our service by sharing your experience</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Question 1 of 4</span>
                        <span>25% Complete</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>

                    {/* NPS Question */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-6">
                        How likely are you to recommend our service to a friend or colleague?
                      </h3>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Not at all likely</span>
                          <span>Extremely likely</span>
                        </div>
                        <div className="flex space-x-2 justify-center">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                            <button
                              key={score}
                              className="w-12 h-12 rounded-lg border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:bg-green-50 transition-all duration-200 font-medium"
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                      <Button variant="outline" disabled>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Next
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Test Controls */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium text-blue-900">Test Mode Active</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Reset Test</Button>
                        <Button variant="outline" size="sm" onClick={() => setActiveView('create')}>
                          Exit Test
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      This is a preview of your survey. Test all functionality before publishing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Net Promoter Score</p>
                      <p className="text-2xl font-bold text-gray-900">42</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">3</span>
                      <span className="text-gray-600 ml-1">from last month</span>
                    </div>
                    <Progress value={70} className="mt-2 h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">2%</span>
                      <span className="text-gray-600 ml-1">from last month</span>
                    </div>
                    <Progress value={85} className="mt-2 h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Responses</p>
                      <p className="text-2xl font-bold text-gray-900">1,247</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">156</span>
                      <span className="text-gray-600 ml-1">this week</span>
                    </div>
                    <Progress value={60} className="mt-2 h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-bold text-gray-900">68%</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-red-600">2%</span>
                      <span className="text-gray-600 ml-1">vs industry average</span>
                    </div>
                    <Progress value={68} className="mt-2 h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>Overall sentiment distribution from feedback</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-6 mt-4">
                    {sentimentData.map((item) => (
                      <div key={item.name} className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm font-medium">{item.name}: {item.value} ({Math.round(item.value/1247*100)}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Themes</CardTitle>
                  <CardDescription>Most discussed topics in feedback (click to filter)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={themesData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="theme" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00B050" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* NPS Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>NPS Question: "How likely are you to recommend our service?"</CardTitle>
                <CardDescription>1,247 responses • Score distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={npsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#00B050" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-8 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">198</div>
                    <div className="text-sm text-gray-600">Detractors (0-6)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">390</div>
                    <div className="text-sm text-gray-600">Passives (7-8)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">659</div>
                    <div className="text-sm text-gray-600">Promoters (9-10)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeView === 'responses' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Raw Responses</h3>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search responses..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>All Sentiments</option>
                    <option>Positive</option>
                    <option>Neutral</option>
                    <option>Negative</option>
                  </select>
                  <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>All NPS Scores</option>
                    <option>Promoters (9-10)</option>
                    <option>Passives (7-8)</option>
                    <option>Detractors (0-6)</option>
                  </select>
                  <select className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Last 30 days</option>
                    <option>Last 7 days</option>
                    <option>Last 24 hours</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Responses Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NPS Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{response.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{response.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{response.user}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`${
                              response.nps >= 9 ? 'bg-green-100 text-green-800' :
                              response.nps >= 7 ? 'bg-gray-100 text-gray-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {response.nps}/10
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                response.sentiment === 'Positive' ? 'bg-green-500' :
                                response.sentiment === 'Negative' ? 'bg-red-500' :
                                'bg-gray-500'
                              }`}></div>
                              <span className="text-sm text-gray-900">{response.sentiment}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{response.feedback}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Showing 1-5 of 100 responses</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>Previous</Button>
                      <Button variant="outline" size="sm" className="bg-green-600 text-white">1</Button>
                      <Button variant="outline" size="sm">2</Button>
                      <Button variant="outline" size="sm">3</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Response Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <AreaChart data={trendData}>
                      <Area type="monotone" dataKey="nps" stroke="#00B050" fill="#00B050" fillOpacity={0.3} />
                      <XAxis dataKey="month" />
                      <Tooltip />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Complete Responses</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg. Response Time</span>
                      <span className="font-medium">2.3 min</span>
                    </div>
                    <Progress value={76} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Text Quality Score</span>
                      <span className="font-medium">8.7/10</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { word: 'excellent', count: 89 },
                      { word: 'slow', count: 67 },
                      { word: 'helpful', count: 54 },
                      { word: 'confusing', count: 43 },
                      { word: 'intuitive', count: 38 }
                    ].map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{keyword.word}</span>
                        <Badge variant="secondary">{keyword.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

