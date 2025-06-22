
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart as RechartsPieChart, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for analytics
  const [analyticsData] = useState({
    totalAnalyses: 1247,
    healthyPanels: 623,
    moderateIssues: 401,
    severeDamage: 223,
    averageConfidence: 91.2,
    trendsData: [
      { month: 'Jan', healthy: 45, moderate: 25, severe: 15 },
      { month: 'Feb', healthy: 52, moderate: 28, severe: 18 },
      { month: 'Mar', healthy: 61, moderate: 32, severe: 21 },
      { month: 'Apr', healthy: 58, moderate: 35, severe: 19 },
      { month: 'May', healthy: 67, moderate: 38, severe: 25 },
      { month: 'Jun', healthy: 72, moderate: 41, severe: 28 }
    ],
    statusDistribution: [
      { name: 'Healthy', value: 623, color: '#10B981' },
      { name: 'Moderate Issues', value: 401, color: '#F59E0B' },
      { name: 'Severe Damage', value: 223, color: '#EF4444' }
    ],
    recentAnalyses: [
      { id: 1, date: '2024-06-14', status: 'Healthy', confidence: 94.2, location: 'Site A' },
      { id: 2, date: '2024-06-13', status: 'Moderate Issues', confidence: 87.5, location: 'Site B' },
      { id: 3, date: '2024-06-13', status: 'Severe Damage', confidence: 92.1, location: 'Site C' },
      { id: 4, date: '2024-06-12', status: 'Healthy', confidence: 89.8, location: 'Site D' },
      { id: 5, date: '2024-06-12', status: 'Moderate Issues', confidence: 91.3, location: 'Site E' }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Healthy': return 'bg-green-100 text-green-800';
      case 'Moderate Issues': return 'bg-yellow-100 text-yellow-800';
      case 'Severe Damage': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      summary: {
        totalAnalyses: analyticsData.totalAnalyses,
        healthyPanels: analyticsData.healthyPanels,
        moderateIssues: analyticsData.moderateIssues,
        severeDamage: analyticsData.severeDamage,
        averageConfidence: analyticsData.averageConfidence
      },
      trends: analyticsData.trendsData,
      recentAnalyses: analyticsData.recentAnalyses
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-panel-analytics-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
              <p className="text-lg text-gray-600">Comprehensive solar panel assessment analytics</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={downloadReport}
                variant="outline"
                className="hover:bg-blue-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          </div>
        </div>

        {/* Time Range Filter */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[
              { label: 'Last 7 days', value: '7d' },
              { label: 'Last 30 days', value: '30d' },
              { label: 'Last 90 days', value: '90d' },
              { label: 'Last year', value: '1y' }
            ].map((range) => (
              <Button
                key={range.value}
                variant={selectedTimeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeRange(range.value)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                  <p className="text-3xl font-bold text-gray-900">{analyticsData.totalAnalyses.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 text-sm font-medium">+12.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthy Panels</p>
                  <p className="text-3xl font-bold text-green-600">{analyticsData.healthyPanels}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={(analyticsData.healthyPanels / analyticsData.totalAnalyses) * 100} className="h-2" />
                <span className="text-gray-600 text-sm mt-1">
                  {((analyticsData.healthyPanels / analyticsData.totalAnalyses) * 100).toFixed(1)}% of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues Detected</p>
                  <p className="text-3xl font-bold text-yellow-600">{analyticsData.moderateIssues + analyticsData.severeDamage}</p>
                </div>
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={((analyticsData.moderateIssues + analyticsData.severeDamage) / analyticsData.totalAnalyses) * 100} className="h-2" />
                <span className="text-gray-600 text-sm mt-1">
                  {(((analyticsData.moderateIssues + analyticsData.severeDamage) / analyticsData.totalAnalyses) * 100).toFixed(1)}% of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
                  <p className="text-3xl font-bold text-blue-600">{analyticsData.averageConfidence}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 text-sm font-medium">+2.1% accuracy improvement</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Distribution Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Health Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <RechartsPieChart data={analyticsData.statusDistribution}>
                      {analyticsData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {analyticsData.statusDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends Bar Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.trendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="healthy" fill="#10B981" name="Healthy" />
                    <Bar dataKey="moderate" fill="#F59E0B" name="Moderate" />
                    <Bar dataKey="severe" fill="#EF4444" name="Severe" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden">
              <div className="space-y-4">
                {analyticsData.recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">#{analysis.id}</div>
                      <div>
                        <p className="font-medium">{analysis.location}</p>
                        <p className="text-sm text-gray-600">{analysis.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(analysis.status)} variant="outline">
                        {analysis.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{analysis.confidence}%</p>
                        <p className="text-xs text-gray-600">Confidence</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
