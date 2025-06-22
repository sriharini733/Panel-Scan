import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Zap, Shield, TrendingUp, CheckCircle, AlertTriangle, XCircle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze your solar panel images with 95%+ accuracy"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Damage Detection",
      description: "Identify cracks, hotspots, dirt accumulation, and other performance-affecting issues"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Performance Optimization",
      description: "Get actionable recommendations to maximize your solar panel efficiency and lifespan"
    }
  ];

  const conditions = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      label: "Healthy",
      description: "Optimal performance"
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
      label: "Moderate Issues",
      description: "Maintenance recommended"
    },
    {
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      label: "Severe Damage",
      description: "Immediate attention required"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-7xl pt-20 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Solar Panel
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> Health Assessment</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Smart Predictions for a Sustainable Tomorrow. Upload drone-captured images and get instant AI-powered analysis of your solar panel condition.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                onClick={() => navigate('/upload')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Panel Image
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-semibold hover:bg-blue-50"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Advanced Solar Panel Analysis
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Leverage cutting-edge AI technology to maintain optimal solar panel performance
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4 p-3 rounded-full bg-gray-50">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Condition Types Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Condition Assessment Types
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Our AI can identify various solar panel conditions with high accuracy
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-3xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {conditions.map((condition, index) => (
                <Card key={index} className="p-6 text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex flex-col items-center">
                      <div className="mb-3">
                        {condition.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{condition.label}</h3>
                      <p className="text-sm text-gray-600">{condition.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 sm:py-32 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Assess Your Solar Panels?
            </h2>
            <p className="mt-4 text-lg leading-8 text-blue-100">
              Upload your drone-captured images and get instant AI-powered analysis
            </p>
            <div className="mt-8">
              <Button 
                onClick={() => navigate('/upload')}
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Upload className="mr-2 h-5 w-5" />
                Start Analysis
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
