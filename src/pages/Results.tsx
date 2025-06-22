
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, TrendingUp, RefreshCw, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

interface AnalysisResult {
  status: 'Healthy' | 'Moderate Issues' | 'Severe Damage';
  confidence: number;
  issues: string[];
  recommendations: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedResult = localStorage.getItem('analysisResult');
    const storedImage = localStorage.getItem('analyzedImage');
    
    if (storedResult && storedImage) {
      setAnalysisResult(JSON.parse(storedResult));
      setImageUrl(storedImage);
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  if (!analysisResult || !imageUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Healthy':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          color: 'bg-green-100 text-green-800 border-green-200',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800'
        };
      case 'Moderate Issues':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800'
        };
      case 'Severe Damage':
        return {
          icon: <XCircle className="h-6 w-6 text-red-500" />,
          color: 'bg-red-100 text-red-800 border-red-200',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800'
        };
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-gray-500" />,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800'
        };
    }
  };

  const statusConfig = getStatusConfig(analysisResult.status);

  const downloadReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      status: analysisResult.status,
      confidence: analysisResult.confidence,
      issues: analysisResult.issues,
      recommendations: analysisResult.recommendations
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-panel-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/upload')}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Analyze Another Image
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis Results</h1>
              <p className="text-lg text-gray-600">AI-powered solar panel health assessment</p>
            </div>
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

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Image Display */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Analyzed Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt="Analyzed solar panel"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status Overview */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className={`p-6 rounded-lg ${statusConfig.bgColor} border`}>
                  <div className="flex items-center gap-3 mb-4">
                    {statusConfig.icon}
                    <Badge className={statusConfig.color} variant="outline">
                      {analysisResult.status}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                        <span className="text-sm font-bold text-gray-900">{analysisResult.confidence}%</span>
                      </div>
                      <Progress value={analysisResult.confidence} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => navigate('/upload')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    Analyze Another
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Issues Identified */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-700">Issues Identified</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.issues && analysisResult.issues.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResult.issues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-red-800">{issue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-700 font-medium">No issues detected!</p>
                    <p className="text-green-600 text-sm">Your solar panel appears to be in good condition.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-700">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult.recommendations && analysisResult.recommendations.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-800">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                    <p className="text-blue-700 font-medium">Continue monitoring</p>
                    <p className="text-blue-600 text-sm">Keep up regular maintenance for optimal performance.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analysis Summary */}
          <Card className="mt-8 border-0 shadow-lg bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Analysis Complete</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Our AI has successfully analyzed your solar panel image with {analysisResult.confidence}% confidence. 
                  {analysisResult.status === 'Healthy' 
                    ? ' Your panel is in excellent condition!' 
                    : ' Follow the recommendations above to maintain optimal performance.'}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={() => navigate('/upload')}
                    variant="secondary"
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Analyze Another Panel
                  </Button>
                  <Button
                    onClick={downloadReport}
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
