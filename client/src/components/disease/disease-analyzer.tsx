import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { FileUpload } from "@/components/ui/file-upload";
import { Upload, Search, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import type { DiseaseDetection } from "@shared/schema";

export default function DiseaseAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: detections = [], isLoading } = useQuery<DiseaseDetection[]>({
    queryKey: ['/api/disease/detections'],
  });

  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/disease/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze image');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/disease/detections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setSelectedFile(null);
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      analyzeImageMutation.mutate(selectedFile);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return "bg-green-50";
    if (confidence >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Upload Plant Image</h3>
        
        <FileUpload
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          accept="image/*"
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-500 transition-colors"
        >
          <Upload className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Drag & drop plant images here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </FileUpload>

        {selectedFile && (
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500 w-5 h-5" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={analyzeImageMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {analyzeImageMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Analyze Disease
                </>
              )}
            </Button>
          </div>
        )}

        {analyzeImageMutation.isError && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="text-red-500 w-5 h-5" />
            <p className="text-sm text-red-700">
              {(analyzeImageMutation.error as Error)?.message || "Failed to analyze image"}
            </p>
          </div>
        )}
      </div>

      {/* Detection History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detection History</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        ) : detections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No disease detections yet. Upload an image to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {detections.slice(0, 5).map((detection) => (
              <Card key={detection.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {detection.detectedDisease || "Unknown Condition"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {new Date(detection.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    {detection.confidence && (
                      <span className={`text-xs px-2 py-1 rounded ${getConfidenceBg(detection.confidence)} ${getConfidenceColor(detection.confidence)}`}>
                        {detection.confidence}% Confidence
                      </span>
                    )}
                  </div>
                  
                  {detection.treatment && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Treatment:</p>
                      <p className="text-sm text-gray-600">{detection.treatment}</p>
                    </div>
                  )}
                  
                  {detection.prevention && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Prevention:</p>
                      <p className="text-sm text-gray-600">{detection.prevention}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
