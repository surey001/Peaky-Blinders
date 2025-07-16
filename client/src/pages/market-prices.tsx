import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, DollarSign, MapPin, Calendar } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";

const marketData = {
  crops: [
    {
      name: "Wheat",
      currentPrice: 2500,
      previousPrice: 2400,
      unit: "per quintal",
      location: "Delhi Mandi",
      date: "2025-01-16",
      trend: "up",
      changePercent: 4.2
    },
    {
      name: "Rice",
      currentPrice: 3200,
      previousPrice: 3300,
      unit: "per quintal",
      location: "Punjab Mandi",
      date: "2025-01-16",
      trend: "down",
      changePercent: -3.0
    },
    {
      name: "Corn",
      currentPrice: 1800,
      previousPrice: 1750,
      unit: "per quintal",
      location: "UP Mandi",
      date: "2025-01-16",
      trend: "up",
      changePercent: 2.9
    },
    {
      name: "Tomato",
      currentPrice: 40,
      previousPrice: 35,
      unit: "per kg",
      location: "Bangalore Market",
      date: "2025-01-16",
      trend: "up",
      changePercent: 14.3
    },
    {
      name: "Onion",
      currentPrice: 25,
      previousPrice: 30,
      unit: "per kg",
      location: "Mumbai Market",
      date: "2025-01-16",
      trend: "down",
      changePercent: -16.7
    },
    {
      name: "Potato",
      currentPrice: 18,
      previousPrice: 16,
      unit: "per kg",
      location: "Delhi Market",
      date: "2025-01-16",
      trend: "up",
      changePercent: 12.5
    }
  ],
  locations: ["Delhi Mandi", "Punjab Mandi", "UP Mandi", "Bangalore Market", "Mumbai Market", "Chennai Market"],
  categories: ["Grains", "Vegetables", "Fruits", "Pulses"]
};

export default function MarketPrices() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrops = marketData.crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || crop.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const TrendIcon = ({ trend }: { trend: string }) => {
    return trend === "up" ? (
      <TrendingUp className="text-green-500 w-4 h-4" />
    ) : (
      <TrendingDown className="text-red-500 w-4 h-4" />
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-green-600 p-3 rounded-lg">
            <TrendingUp className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Prices</h1>
        </div>
        <p className="text-gray-600">Current market prices and trends for agricultural commodities</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {marketData.locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {marketData.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Price Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{crop.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  <TrendIcon trend={crop.trend} />
                  <span className={`text-sm font-medium ${
                    crop.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {crop.changePercent > 0 ? "+" : ""}{crop.changePercent}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <DollarSign className="text-green-600 w-5 h-5" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{crop.currentPrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{crop.unit}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Previous Price:</span>
                    <span className="font-medium">₹{crop.previousPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="text-gray-500 w-3 h-3" />
                      <span className="text-gray-600">Location:</span>
                    </div>
                    <span className="font-medium">{crop.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="text-gray-500 w-3 h-3" />
                      <span className="text-gray-600">Date:</span>
                    </div>
                    <span className="font-medium">{crop.date}</span>
                  </div>
                </div>

                <div className={`p-2 rounded-lg ${
                  crop.trend === "up" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                }`}>
                  <p className={`text-xs text-center ${
                    crop.trend === "up" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                  }`}>
                    {crop.trend === "up" ? "Price increased" : "Price decreased"} by ₹{Math.abs(crop.currentPrice - crop.previousPrice)} from yesterday
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <TrendingUp className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">No crops found matching your filters</p>
          </CardContent>
        </Card>
      )}

      {/* Market Insights */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Rising Prices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tomato and Potato prices are showing strong upward trends due to reduced supply and increased demand.
              </p>
            </div>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">Falling Prices</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Onion prices have dropped significantly due to increased harvest and good storage conditions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}