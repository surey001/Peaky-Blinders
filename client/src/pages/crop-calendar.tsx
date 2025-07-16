import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Leaf, Sun, Droplets, Scissors } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";

const cropData = {
  tomato: {
    name: "Tomato",
    plantingTime: "March - May",
    harvestTime: "June - September",
    wateringFreq: "Daily",
    sunlightReq: "Full sun (6-8 hours)",
    growthPeriod: "60-90 days",
    tips: ["Start seeds indoors 6-8 weeks before transplanting", "Support plants with stakes or cages", "Water at base to prevent disease"]
  },
  rice: {
    name: "Rice",
    plantingTime: "June - July",
    harvestTime: "November - December",
    wateringFreq: "Keep flooded",
    sunlightReq: "Full sun",
    growthPeriod: "120-150 days",
    tips: ["Prepare flooded fields", "Transplant seedlings after 3-4 weeks", "Maintain water level throughout growing season"]
  },
  wheat: {
    name: "Wheat",
    plantingTime: "November - December",
    harvestTime: "March - April",
    wateringFreq: "Weekly",
    sunlightReq: "Full sun",
    growthPeriod: "120-130 days",
    tips: ["Plant in well-drained soil", "Apply fertilizer at planting", "Harvest when grains are golden"]
  },
  corn: {
    name: "Corn",
    plantingTime: "April - June",
    harvestTime: "July - October",
    wateringFreq: "2-3 times per week",
    sunlightReq: "Full sun",
    growthPeriod: "90-120 days",
    tips: ["Plant in blocks for better pollination", "Hill soil around stalks", "Harvest when kernels are milky"]
  },
  potato: {
    name: "Potato",
    plantingTime: "February - April",
    harvestTime: "May - August",
    wateringFreq: "Weekly",
    sunlightReq: "Partial sun",
    growthPeriod: "70-90 days",
    tips: ["Plant in trenches", "Hill soil as plants grow", "Harvest after flowering"]
  }
};

export default function CropCalendar() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrops = Object.entries(cropData).filter(([key, crop]) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCropData = selectedCrop ? cropData[selectedCrop as keyof typeof cropData] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-green-600 p-3 rounded-lg">
            <Calendar className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crop Calendar</h1>
        </div>
        <p className="text-gray-600">Plan your farming activities with seasonal crop calendars</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crop Selection */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Crop</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search crops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a crop" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCrops.map(([key, crop]) => (
                    <SelectItem key={key} value={key}>
                      {crop.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Crop Details */}
        <div className="lg:col-span-2">
          {selectedCropData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="text-green-600" />
                  <span>{selectedCropData.name} Growing Guide</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Calendar className="text-green-600 w-5 h-5" />
                      <div>
                        <p className="font-semibold">Planting Time</p>
                        <p className="text-sm text-gray-600">{selectedCropData.plantingTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                      <Scissors className="text-orange-600 w-5 h-5" />
                      <div>
                        <p className="font-semibold">Harvest Time</p>
                        <p className="text-sm text-gray-600">{selectedCropData.harvestTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Droplets className="text-blue-600 w-5 h-5" />
                      <div>
                        <p className="font-semibold">Watering</p>
                        <p className="text-sm text-gray-600">{selectedCropData.wateringFreq}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Sun className="text-yellow-600 w-5 h-5" />
                      <div>
                        <p className="font-semibold">Sunlight</p>
                        <p className="text-sm text-gray-600">{selectedCropData.sunlightReq}</p>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="font-semibold">Growth Period</p>
                      <p className="text-sm text-gray-600">{selectedCropData.growthPeriod}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold mb-2">Growing Tips</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedCropData.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-600">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="mx-auto text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500">Select a crop to view its growing calendar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}