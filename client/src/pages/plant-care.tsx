import { Card, CardContent } from "@/components/ui/card";
import PlantSearch from "@/components/plant-care/plant-search";
import { Leaf } from "lucide-react";

export default function PlantCare() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-leaf-green p-3 rounded-lg">
            <Leaf className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Plant Care Guide</h1>
        </div>
        <p className="text-gray-600">Search for plants and get detailed care instructions and growing tips</p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <PlantSearch />
        </CardContent>
      </Card>
    </div>
  );
}
