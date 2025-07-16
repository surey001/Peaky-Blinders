import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";

// Sample weather data (in real implementation, this would come from a weather API)
const sampleWeatherData = {
  current: {
    location: "New Delhi, India",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    uvIndex: 6,
    icon: "partly-cloudy"
  },
  forecast: [
    { day: "Today", high: 32, low: 24, condition: "Sunny", icon: "sunny", precipitation: 0 },
    { day: "Tomorrow", high: 30, low: 22, condition: "Partly Cloudy", icon: "partly-cloudy", precipitation: 10 },
    { day: "Thursday", high: 28, low: 20, condition: "Rainy", icon: "rainy", precipitation: 80 },
    { day: "Friday", high: 26, low: 18, condition: "Cloudy", icon: "cloudy", precipitation: 40 },
    { day: "Saturday", high: 29, low: 21, condition: "Sunny", icon: "sunny", precipitation: 0 },
  ],
  farmingTips: [
    "Good conditions for watering crops in the morning",
    "High humidity may increase fungal disease risk",
    "Strong winds may require crop protection",
    "UV index is moderate - suitable for outdoor work with protection"
  ]
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition) {
    case "sunny":
      return <Sun className="text-yellow-500 w-8 h-8" />;
    case "partly-cloudy":
      return <Cloud className="text-gray-500 w-8 h-8" />;
    case "rainy":
      return <CloudRain className="text-blue-500 w-8 h-8" />;
    case "cloudy":
      return <Cloud className="text-gray-600 w-8 h-8" />;
    default:
      return <Sun className="text-yellow-500 w-8 h-8" />;
  }
};

export default function WeatherInfo() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [location, setLocation] = useState("New Delhi, India");
  const [weatherData] = useState(sampleWeatherData);

  const handleLocationSearch = () => {
    // In real implementation, this would fetch weather data for the new location
    console.log("Searching weather for:", location);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Cloud className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weather Information</h1>
        </div>
        <p className="text-gray-600">Get current weather conditions and farming recommendations</p>
      </div>

      {/* Location Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Input
              placeholder="Enter location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleLocationSearch} className="bg-blue-600 hover:bg-blue-700">
              Get Weather
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Current Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-2">
                  <WeatherIcon condition={weatherData.current.icon} />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {weatherData.current.temperature}°C
                </h2>
                <p className="text-gray-600">{weatherData.current.condition}</p>
                <p className="text-sm text-gray-500">{weatherData.current.location}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="text-blue-500 w-4 h-4" />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <span className="text-sm font-medium">{weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="text-gray-500 w-4 h-4" />
                    <span className="text-sm">Wind Speed</span>
                  </div>
                  <span className="text-sm font-medium">{weatherData.current.windSpeed} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="text-gray-500 w-4 h-4" />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <span className="text-sm font-medium">{weatherData.current.visibility} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sun className="text-yellow-500 w-4 h-4" />
                    <span className="text-sm">UV Index</span>
                  </div>
                  <span className="text-sm font-medium">{weatherData.current.uvIndex}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecast */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <WeatherIcon condition={day.icon} />
                      <div>
                        <p className="font-medium">{day.day}</p>
                        <p className="text-sm text-gray-600">{day.condition}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{day.high}°/{day.low}°</p>
                      <p className="text-sm text-blue-600">{day.precipitation}% rain</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Farming Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Farming Weather Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weatherData.farmingTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="bg-green-600 p-1 rounded-full mt-1">
                      <Thermometer className="text-white w-3 h-3" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}