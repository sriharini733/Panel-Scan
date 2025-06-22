
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ArrowLeft, 
  TrendingUp, 
  Upload, 
  Eye,
  FileText,
  Calendar,
  Filter,
  Search,
  Plus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TrackedReport {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'Healthy' | 'Moderate Issues' | 'Severe Damage' | 'Processing';
  confidence: number;
  analysisDate: string;
  fileSize: string;
  location?: string;
  issues?: string[];
  recommendations?: string[];
  imageUrl?: string; // Add imageUrl to interface
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackedReports, setTrackedReports] = useState<TrackedReport[]>([]);

  useEffect(() => {
    // Load reports from localStorage
    const loadReports = () => {
      const storedReports = localStorage.getItem('trackedReports');
      if (storedReports) {
        setTrackedReports(JSON.parse(storedReports));
      }
    };

    loadReports();

    // Listen for storage changes to update in real-time
    const handleStorageChange = () => {
      loadReports();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for updates every 2 seconds (for same-tab updates)
    const interval = setInterval(loadReports, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleViewReport = (report: TrackedReport) => {
    // Store the specific report data for viewing
    const reportData = {
      status: report.status,
      confidence: report.confidence,
      issues: report.issues || [],
      recommendations: report.recommendations || []
    };
    
    localStorage.setItem('analysisResult', JSON.stringify(reportData));
    // Use the stored image URL or fallback to placeholder
    localStorage.setItem('analyzedImage', report.imageUrl || '/placeholder.svg');
    
    navigate('/results');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Healthy':
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          count: trackedReports.filter(r => r.status === 'Healthy').length
        };
      case 'Moderate Issues':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          count: trackedReports.filter(r => r.status === 'Moderate Issues').length
        };
      case 'Severe Damage':
        return {
          icon: <XCircle className="h-4 w-4 text-red-500" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          count: trackedReports.filter(r => r.status === 'Severe Damage').length
        };
      case 'Processing':
        return {
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          count: trackedReports.filter(r => r.status === 'Processing').length
        };
      default:
        return {
          icon: <FileText className="h-4 w-4 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          count: 0
        };
    }
  };

  const filteredReports = trackedReports.filter(report => {
    const matchesSearch = report.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: trackedReports.length,
    healthy: trackedReports.filter(r => r.status === 'Healthy').length,
    moderate: trackedReports.filter(r => r.status === 'Moderate Issues').length,
    severe: trackedReports.filter(r => r.status === 'Severe Damage').length,
    processing: trackedReports.filter(r => r.status === 'Processing').length
  };

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-lg text-gray-600">Track and manage your solar panel analysis reports</p>
            </div>
            <Button
              onClick={() => navigate('/upload')}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCounts.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthy</p>
                  <p className="text-3xl font-bold text-green-600">{statusCounts.healthy}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Issues</p>
                  <p className="text-3xl font-bold text-yellow-600">{statusCounts.moderate}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Damage</p>
                  <p className="text-3xl font-bold text-red-600">{statusCounts.severe}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-3xl font-bold text-blue-600">{statusCounts.processing}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by filename or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Healthy', value: 'Healthy' },
                  { label: 'Issues', value: 'Moderate Issues' },
                  { label: 'Damage', value: 'Severe Damage' },
                  { label: 'Processing', value: 'Processing' }
                ].map((status) => (
                  <Button
                    key={status.value}
                    variant={statusFilter === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status.value)}
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Analysis Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>File Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => {
                    const statusConfig = getStatusConfig(report.status);
                    return (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            {report.fileName}
                          </div>
                        </TableCell>
                        <TableCell>{report.location || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {report.uploadDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.color} variant="outline">
                            <div className="flex items-center gap-1">
                              {statusConfig.icon}
                              {report.status}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.status === 'Processing' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-sm text-gray-500">Processing...</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{report.confidence}%</span>
                              </div>
                              <Progress value={report.confidence} className="h-1" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{report.fileSize}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={report.status === 'Processing'}
                              onClick={() => handleViewReport(report)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No reports found</p>
                <p className="text-gray-500 text-sm mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Upload your first solar panel image to get started'}
                </p>
                <Button
                  onClick={() => navigate('/upload')}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
