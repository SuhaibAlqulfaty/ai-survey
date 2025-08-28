import { useState } from 'react'
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
  Minus
} from 'lucide-react'
import './App.css'

// Enhanced sample data for the dashboard
const sampleData = {
  metrics: {
    nps: 42,
    npsTrend: 3,
    csat: 85,
    csatTrend: 2,
    totalResponses: 1247,
    responseTrend: 156,
    responseRate: 68,
    responseRateTrend: -2
  },
  sentiment: [
    { name: 'Positive', value: 65, color: '#00B050', count: 810 },
    { name: 'Neutral', value: 25, color: '#94A3B8', count: 312 },
    { name: 'Negative', value: 10, color: '#EF4444', count: 125 }
  ],
  themes: [
    { name: 'Support', count: 234, sentiment: 'positive', percentage: 18.8 },
    { name: 'Pricing', count: 189, sentiment: 'neutral', percentage: 15.2 },
    { name: 'UI/UX', count: 156, sentiment: 'positive', percentage: 12.5 },
    { name: 'Performance', count: 98, sentiment: 'negative', percentage: 7.9 },
    { name: 'Features', count: 87, sentiment: 'positive', percentage: 7.0 },
    { name: 'Bugs', count: 45, sentiment: 'negative', percentage: 3.6 }
  ],
  recentFeedback: [
    { id: 1, text: "Great customer service, very responsive team!", sentiment: 'positive', user: 'User #aB3xZ9qR', time: '2 minutes ago', nps: 9 },
    { id: 2, text: "The new dashboard is confusing and hard to navigate", sentiment: 'negative', user: 'User #kL8mN4pQ', time: '5 minutes ago', nps: 4 },
    { id: 3, text: "Pricing is reasonable for the features provided", sentiment: 'positive', user: 'User #wX7yZ2vB', time: '8 minutes ago', nps: 8 },
    { id: 4, text: "Loading times have improved significantly", sentiment: 'positive', user: 'User #dF5gH9jK', time: '12 minutes ago', nps: 7 },
    { id: 5, text: "Would love to see more integrations with third-party tools", sentiment: 'neutral', user: 'User #mN9oP3qR', time: '15 minutes ago', nps: 6 }
  ],
  npsOverTime: [
    { month: 'Jan', score: 38, responses: 980 },
    { month: 'Feb', score: 41, responses: 1050 },
    { month: 'Mar', score: 39, responses: 1120 },
    { month: 'Apr', score: 44, responses: 1180 },
    { month: 'May', score: 42, responses: 1210 },
    { month: 'Jun', score: 42, responses: 1247 }
  ],
  alerts: [
    { id: 1, type: 'critical', message: 'VIP customer gave low NPS score', time: '5 minutes ago' },
    { id: 2, type: 'warning', message: 'Negative sentiment spike in "Performance" theme', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Response rate increased by 12% this week', time: '2 hours ago' }
  ]
}

function App() {
  const [activeTab, setActiveTab] = useState('summary')
  const [selectedTheme, setSelectedTheme] = useState(null)

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'negative': return <AlertCircle className="w-4 h-4 text-red-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />
    if (trend < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-600" />
  }

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const handleThemeClick = (theme) => {
    setSelectedTheme(selectedTheme === theme.name ? null : theme.name)
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
          {payload[0].payload.percentage && (
            <p className="text-sm text-muted-foreground">{`${payload[0].payload.percentage}% of total`}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="engage-gradient text-white px-4 py-2 rounded-lg font-bold text-xl">
                Engage.sa
              </div>
              <div className="text-sm text-muted-foreground">
                Survey Results Dashboard
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-primary border-primary animate-pulse">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                Live Data
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="breakdown">Question Breakdown</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Alerts Section */}
            {sampleData.alerts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleData.alerts.map((alert) => (
                  <Card key={alert.id} className={`border-l-4 ${
                    alert.type === 'critical' ? 'border-l-red-500 bg-red-50' :
                    alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                    'border-l-blue-500 bg-blue-50'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className={`w-5 h-5 mt-0.5 ${
                          alert.type === 'critical' ? 'text-red-600' :
                          alert.type === 'warning' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Promoter Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-primary">{sampleData.metrics.nps}</div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(sampleData.metrics.npsTrend)}
                      <span className={`text-sm ${getTrendColor(sampleData.metrics.npsTrend)}`}>
                        {Math.abs(sampleData.metrics.npsTrend)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${(sampleData.metrics.nps + 100) / 2}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-primary">{sampleData.metrics.csat}%</div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(sampleData.metrics.csatTrend)}
                      <span className={`text-sm ${getTrendColor(sampleData.metrics.csatTrend)}`}>
                        {Math.abs(sampleData.metrics.csatTrend)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={sampleData.metrics.csat} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{sampleData.metrics.totalResponses.toLocaleString()}</div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(sampleData.metrics.responseTrend)}
                      <span className={`text-sm ${getTrendColor(sampleData.metrics.responseTrend)}`}>
                        {Math.abs(sampleData.metrics.responseTrend)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    this week
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">{sampleData.metrics.responseRate}%</div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(sampleData.metrics.responseRateTrend)}
                      <span className={`text-sm ${getTrendColor(sampleData.metrics.responseRateTrend)}`}>
                        {Math.abs(sampleData.metrics.responseRateTrend)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={sampleData.metrics.responseRate} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    vs industry average
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sentiment Analysis */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>
                    Overall sentiment distribution from feedback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sampleData.sentiment}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sampleData.sentiment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [
                        `${value}% (${props.payload.count} responses)`, 
                        name
                      ]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-6 mt-4">
                    {sampleData.sentiment.map((item) => (
                      <div key={item.name} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm">{item.name}: {item.value}% ({item.count})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Themes */}
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Top Themes</CardTitle>
                  <CardDescription>
                    Most discussed topics in feedback (click to filter)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sampleData.themes} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="count" 
                        fill="#00B050"
                        radius={[0, 4, 4, 0]}
                        cursor="pointer"
                        onClick={(data) => handleThemeClick(data)}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  {selectedTheme && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">Filtered by: {selectedTheme}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedTheme(null)}
                        className="mt-2"
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* NPS Trend Chart */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>NPS Trend Over Time</CardTitle>
                <CardDescription>
                  Net Promoter Score progression over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={sampleData.npsOverTime}>
                    <defs>
                      <linearGradient id="npsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00B050" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00B050" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value, name) => [value, 'NPS Score']} />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#00B050" 
                      strokeWidth={2}
                      fill="url(#npsGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Feedback */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Live Feedback Feed</CardTitle>
                <CardDescription>
                  Most recent survey responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sampleData.recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex-shrink-0">
                        {getSentimentIcon(feedback.sentiment)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{feedback.text}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{feedback.user}</span>
                          <span>{feedback.time}</span>
                          <Badge variant="outline" size="sm">
                            NPS: {feedback.nps}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6">
            {/* Question Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Question Analysis</CardTitle>
                <CardDescription>
                  Detailed breakdown of responses by question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Question List */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Survey Questions</h3>
                    {[
                      { id: 1, text: "How likely are you to recommend our service?", type: "nps", responses: 1247 },
                      { id: 2, text: "How satisfied are you with our customer support?", type: "rating", responses: 1134 },
                      { id: 3, text: "Which features do you use most frequently?", type: "multiple", responses: 1089 },
                      { id: 4, text: "How would you rate our pricing?", type: "rating", responses: 1156 },
                      { id: 5, text: "What improvements would you like to see?", type: "text", responses: 892 }
                    ].map((question) => (
                      <Card key={question.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-primary/20 hover:border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{question.text}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" size="sm">
                                  {question.type.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {question.responses} responses
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Question Analysis */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* NPS Question Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">NPS Question: "How likely are you to recommend our service?"</CardTitle>
                        <CardDescription>1,247 responses • Score distribution</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={[
                            { score: '0', count: 12, category: 'Detractor' },
                            { score: '1', count: 8, category: 'Detractor' },
                            { score: '2', count: 15, category: 'Detractor' },
                            { score: '3', count: 23, category: 'Detractor' },
                            { score: '4', count: 31, category: 'Detractor' },
                            { score: '5', count: 42, category: 'Detractor' },
                            { score: '6', count: 67, category: 'Detractor' },
                            { score: '7', count: 156, category: 'Passive' },
                            { score: '8', count: 234, category: 'Passive' },
                            { score: '9', count: 312, category: 'Promoter' },
                            { score: '10', count: 347, category: 'Promoter' }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="score" />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [
                              `${value} responses`, 
                              `Score ${props.payload.score} (${props.payload.category})`
                            ]} />
                            <Bar 
                              dataKey="count" 
                              fill={(entry) => {
                                if (entry.category === 'Promoter') return '#00B050'
                                if (entry.category === 'Passive') return '#94A3B8'
                                return '#EF4444'
                              }}
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center space-x-6 mt-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">Detractors (0-6): 198</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <span className="text-sm">Passives (7-8): 390</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-600"></div>
                            <span className="text-sm">Promoters (9-10): 659</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Support Rating */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Support Satisfaction: "How satisfied are you with our customer support?"</CardTitle>
                        <CardDescription>1,134 responses • 5-point scale</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={[
                            { rating: 'Very Unsatisfied', count: 45, percentage: 4.0 },
                            { rating: 'Unsatisfied', count: 67, percentage: 5.9 },
                            { rating: 'Neutral', count: 189, percentage: 16.7 },
                            { rating: 'Satisfied', count: 456, percentage: 40.2 },
                            { rating: 'Very Satisfied', count: 377, percentage: 33.2 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="rating" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip formatter={(value, name, props) => [
                              `${value} responses (${props.payload.percentage}%)`, 
                              props.payload.rating
                            ]} />
                            <Bar dataKey="count" fill="#00B050" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Feature Usage */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Feature Usage: "Which features do you use most frequently?"</CardTitle>
                        <CardDescription>1,089 responses • Multiple selection allowed</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={[
                            { feature: 'Dashboard', count: 892, percentage: 81.9 },
                            { feature: 'Reports', count: 678, percentage: 62.3 },
                            { feature: 'Analytics', count: 567, percentage: 52.1 },
                            { feature: 'Integrations', count: 445, percentage: 40.9 },
                            { feature: 'API Access', count: 234, percentage: 21.5 },
                            { feature: 'Mobile App', count: 189, percentage: 17.4 }
                          ]} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="feature" type="category" width={100} />
                            <Tooltip formatter={(value, name, props) => [
                              `${value} users (${props.payload.percentage}%)`, 
                              props.payload.feature
                            ]} />
                            <Bar dataKey="count" fill="#00B050" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cross-Tabulation Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Cross-Tabulation Analysis</CardTitle>
                <CardDescription>
                  Analyze relationships between different survey questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* NPS vs Support Satisfaction */}
                  <div>
                    <h3 className="font-medium mb-4">NPS Score vs Support Satisfaction</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { satisfaction: 'Very Unsatisfied', avgNPS: 2.1, responses: 45 },
                        { satisfaction: 'Unsatisfied', avgNPS: 3.8, responses: 67 },
                        { satisfaction: 'Neutral', avgNPS: 6.2, responses: 189 },
                        { satisfaction: 'Satisfied', avgNPS: 8.1, responses: 456 },
                        { satisfaction: 'Very Satisfied', avgNPS: 9.3, responses: 377 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="satisfaction" angle={-45} textAnchor="end" height={80} />
                        <YAxis domain={[0, 10]} />
                        <Tooltip formatter={(value, name, props) => [
                          `Avg NPS: ${value}`, 
                          `${props.payload.satisfaction} (${props.payload.responses} responses)`
                        ]} />
                        <Bar dataKey="avgNPS" fill="#00B050" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Feature Usage vs NPS */}
                  <div>
                    <h3 className="font-medium mb-4">Feature Usage vs Average NPS</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={[
                        { feature: 'Dashboard', avgNPS: 7.8, users: 892 },
                        { feature: 'Reports', avgNPS: 8.2, users: 678 },
                        { feature: 'Analytics', avgNPS: 8.5, users: 567 },
                        { feature: 'Integrations', avgNPS: 7.1, users: 445 },
                        { feature: 'API Access', avgNPS: 9.1, users: 234 },
                        { feature: 'Mobile App', avgNPS: 6.8, users: 189 }
                      ]} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis dataKey="feature" type="category" width={80} />
                        <Tooltip formatter={(value, name, props) => [
                          `Avg NPS: ${value}`, 
                          `${props.payload.feature} (${props.payload.users} users)`
                        ]} />
                        <Bar dataKey="avgNPS" fill="#00B050" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Responses Tab */}
          <TabsContent value="responses" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Raw Responses</CardTitle>
                    <CardDescription>
                      Searchable and filterable response data ({sampleData.recentFeedback.length + 95} total responses)
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
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
              </CardHeader>
              <CardContent>
                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search responses..."
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All Sentiments</option>
                      <option>Positive</option>
                      <option>Neutral</option>
                      <option>Negative</option>
                    </select>
                    <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>All NPS Scores</option>
                      <option>Promoters (9-10)</option>
                      <option>Passives (7-8)</option>
                      <option>Detractors (0-6)</option>
                    </select>
                    <select className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>Last 30 days</option>
                      <option>Last 7 days</option>
                      <option>Last 24 hours</option>
                      <option>Custom range</option>
                    </select>
                  </div>
                </div>

                {/* Data Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Response ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            NPS Score
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Sentiment
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Feedback
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-border">
                        {[
                          ...sampleData.recentFeedback,
                          { id: 6, text: "The mobile app needs better offline functionality", sentiment: 'negative', user: 'User #pQ4rS7tU', time: '18 minutes ago', nps: 5, date: '2024-06-15 14:42' },
                          { id: 7, text: "Excellent integration with our existing tools", sentiment: 'positive', user: 'User #vW8xY1zA', time: '22 minutes ago', nps: 9, date: '2024-06-15 14:38' },
                          { id: 8, text: "Documentation could be more comprehensive", sentiment: 'neutral', user: 'User #bC3dE6fG', time: '25 minutes ago', nps: 7, date: '2024-06-15 14:35' },
                          { id: 9, text: "Love the new dashboard design, very intuitive", sentiment: 'positive', user: 'User #hI9jK2lM', time: '28 minutes ago', nps: 10, date: '2024-06-15 14:32' },
                          { id: 10, text: "Billing process is confusing and needs improvement", sentiment: 'negative', user: 'User #nO5pQ8rS', time: '32 minutes ago', nps: 4, date: '2024-06-15 14:28' }
                        ].map((response) => (
                          <tr key={response.id} className="hover:bg-muted/25 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                              #{response.id.toString().padStart(4, '0')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {response.date || '2024-06-15 15:' + (60 - response.id * 2).toString().padStart(2, '0')}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {response.user}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge 
                                variant={response.nps >= 9 ? "default" : response.nps >= 7 ? "secondary" : "destructive"}
                                className={response.nps >= 9 ? "bg-primary" : response.nps >= 7 ? "bg-gray-500" : "bg-red-500"}
                              >
                                {response.nps}/10
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {getSentimentIcon(response.sentiment)}
                                <span className={`text-sm capitalize ${getSentimentColor(response.sentiment)}`}>
                                  {response.sentiment}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-foreground max-w-md">
                              <div className="truncate" title={response.text}>
                                {response.text}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing 1 to 10 of 100 results
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Volume</CardTitle>
                  <CardDescription>Daily response count over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={[
                      { date: '06/10', responses: 45 },
                      { date: '06/11', responses: 52 },
                      { date: '06/12', responses: 38 },
                      { date: '06/13', responses: 61 },
                      { date: '06/14', responses: 47 },
                      { date: '06/15', responses: 58 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="responses" stroke="#00B050" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Quality</CardTitle>
                  <CardDescription>Average response length and completeness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Avg. Response Length</span>
                      <span className="font-medium">127 characters</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Completion Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <Progress value={94} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quality Score</span>
                      <span className="font-medium">8.2/10</span>
                    </div>
                    <Progress value={82} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Keywords</CardTitle>
                  <CardDescription>Most mentioned terms in responses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { word: 'support', count: 89, trend: 'up' },
                      { word: 'dashboard', count: 67, trend: 'up' },
                      { word: 'pricing', count: 54, trend: 'down' },
                      { word: 'features', count: 43, trend: 'up' },
                      { word: 'performance', count: 38, trend: 'down' },
                      { word: 'integration', count: 29, trend: 'up' }
                    ].map((keyword) => (
                      <div key={keyword.word} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium">{keyword.word}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">{keyword.count}</span>
                          {keyword.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-green-600" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App

