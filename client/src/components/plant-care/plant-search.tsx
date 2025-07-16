import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Leaf, Droplets, Sun, Thermometer, Loader2 } from "lucide-react";
import type { PlantCareRecord } from "@shared/schema";

export default function PlantSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: careRecords = [], isLoading } = useQuery<PlantCareRecord[]>({
    queryKey: ['/api/plant-care/records'],
  });

  const searchPlantMutation = useMutation({
    mutationFn: async (plantQuery: string) => {
      const response = await apiRequest("POST", "/api/plant-care/search", { plantQuery });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/plant-care/records'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activities'] });
      setSearchQuery("");
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    searchPlantMutation.mutate(searchQuery.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const renderCareInstructions = (instructions: any) => {
    if (!instructions) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {instructions.watering && (
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <Droplets className="text-blue-500 w-5 h-5 mt-1" />
            <div>
              <p className="text-sm font-medium text-blue-900">Watering</p>
              <p className="text-sm text-blue-700">{instructions.watering}</p>
            </div>
          </div>
        )}
        
        {instructions.sunlight && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Sun className="text-yellow-500 w-5 h-5 mt-1" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Sunlight</p>
              <p className="text-sm text-yellow-700">{instructions.sunlight}</p>
            </div>
          </div>
        )}
        
        {instructions.temperature && (
          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <Thermometer className="text-green-500 w-5 h-5 mt-1" />
            <div>
              <p className="text-sm font-medium text-green-900">Temperature</p>
              <p className="text-sm text-green-700">{instructions.temperature}</p>
            </div>
          </div>
        )}
        
        {instructions.soil && (
          <div className="flex items-start space-x-3 p-3 bg-earth-brown bg-opacity-10 rounded-lg">
            <div className="w-5 h-5 mt-1 bg-earth-brown rounded-full"></div>
            <div>
              <p className="text-sm font-medium text-earth-brown">Soil</p>
              <p className="text-sm text-gray-700">{instructions.soil}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Search for Plants</h3>
        
        <div className="flex space-x-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a plant (e.g., tomato, rose, basil)..."
            className="flex-1"
            disabled={searchPlantMutation.isPending}
          />
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || searchPlantMutation.isPending}
            className="bg-leaf-green hover:bg-green-700"
          >
            {searchPlantMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {searchPlantMutation.isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              {(searchPlantMutation.error as Error)?.message || "Failed to search for plant"}
            </p>
          </div>
        )}
      </div>

      {/* Plant Care Records */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Plant Care Library</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-leaf-green" />
          </div>
        ) : careRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Leaf className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No plant care records yet. Search for a plant to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {careRecords.slice(0, 5).map((record) => (
              <Card key={record.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="bg-leaf-green p-3 rounded-lg">
                      <Leaf className="text-white w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{record.plantName}</h4>
                      {record.scientificName && (
                        <p className="text-sm text-gray-500 italic">{record.scientificName}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Added {new Date(record.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {record.careInstructions && renderCareInstructions(record.careInstructions)}
                  
                  {record.careInstructions?.commonIssues && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-2">Common Issues to Watch For:</p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {record.careInstructions.commonIssues.map((issue: string, index: number) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
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
