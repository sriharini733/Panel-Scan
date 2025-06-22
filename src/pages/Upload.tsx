import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Image as ImageIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        toast.success('Image selected successfully!');
      } else {
        toast.error('Please select a valid image file (JPEG, PNG)');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success('Image uploaded successfully!');
    } else {
      toast.error('Please upload a valid image file');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

  const saveAnalysisToStorage = (analysisResult: any, fileName: string, fileSize: number, imageUrl: string) => {
    const existingReports = JSON.parse(localStorage.getItem('trackedReports') || '[]');
    
    const newReport = {
      id: Date.now().toString(),
      fileName: fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      status: analysisResult.status,
      confidence: analysisResult.confidence,
      analysisDate: new Date().toISOString().split('T')[0],
      fileSize: `${(fileSize / 1024 / 1024).toFixed(2)} MB`,
      location: 'Unknown',
      issues: analysisResult.issues || [],
      recommendations: analysisResult.recommendations || [],
      imageUrl: imageUrl // Store the actual image URL
    };
    
    existingReports.unshift(newReport);
    localStorage.setItem('trackedReports', JSON.stringify(existingReports));
  };

  const analyzeImage = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const base64Image = await convertToBase64(selectedFile);
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyB9g32l7FKHJcsCMy1HlzXOR_5uwS4zzQ8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Analyze this solar panel image and provide a detailed assessment. Determine if the solar panel is: 1) Healthy (no visible damage, clean, optimal condition), 2) Moderate Issues (minor dirt, small cracks, or slight damage that affects performance but doesn't require immediate replacement), or 3) Severe Damage (major cracks, significant damage, hotspots, or conditions requiring immediate attention). Provide a confidence percentage and specific recommendations. Format your response as JSON with the following structure: {\"status\": \"Healthy|Moderate Issues|Severe Damage\", \"confidence\": number, \"issues\": [\"list of identified issues\"], \"recommendations\": [\"list of actionable recommendations\"]}"
              },
              {
                inline_data: {
                  mime_type: selectedFile.type,
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      const analysisText = data.candidates[0].content.parts[0].text;
      
      let analysisResult;
      try {
        const cleanedText = analysisText.replace(/```json|```/g, '').trim();
        analysisResult = JSON.parse(cleanedText);
      } catch (parseError) {
        console.log('Raw analysis text:', analysisText);
        analysisResult = {
          status: analysisText.includes('Healthy') ? 'Healthy' : 
                   analysisText.includes('Severe') ? 'Severe Damage' : 'Moderate Issues',
          confidence: 85,
          issues: ['Analysis completed'],
          recommendations: [analysisText]
        };
      }

      // Save to tracking storage with the actual image URL
      saveAnalysisToStorage(analysisResult, selectedFile.name, selectedFile.size, previewUrl!);
      
      // Store results for results page
      localStorage.setItem('analysisResult', JSON.stringify(analysisResult));
      localStorage.setItem('analyzedImage', previewUrl!);
      
      toast.success('Analysis completed successfully!');
      navigate('/results');
      
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload Solar Panel Image</h1>
          <p className="text-lg text-gray-600">Upload drone-captured images for AI-powered health assessment</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Select Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG files up to 10MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {selectedFile && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Selected: {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={previewUrl}
                        alt="Selected solar panel"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Panel...
                        </>
                      ) : (
                        'Analyze Panel Health'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-gray-500">No image selected</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-8 border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Best Practices for Image Upload</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Ensure clear, high-resolution images of solar panels
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Avoid blurry or low-light images for better accuracy
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Include the entire panel surface in the frame
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  Drone-captured overhead shots work best
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
