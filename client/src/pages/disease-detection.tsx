import { Card, CardContent } from "@/components/ui/card";
import DiseaseAnalyzer from "@/components/disease/disease-analyzer";
import { Search } from "lucide-react";

export default function DiseaseDetection() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-red-500 p-3 rounded-lg">
            <Search className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Disease Detection</h1>
        </div>
        <p className="text-gray-600">Upload plant images for accurate disease diagnosis and treatment recommendations</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <DiseaseAnalyzer />
        </CardContent>
      </Card>
    </div>
  );
}
