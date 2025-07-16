import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Search, Leaf, Calendar, Cloud, TrendingUp, Book } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";
import VoiceAssistant from "@/components/voice/voice-assistant";
import type { Activity } from "@shared/schema";

export default function Home() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div 
          className="relative h-64 rounded-2xl overflow-hidden mb-6"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=600')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-4">{t("welcome_title")}</h2>
              <p className="text-xl">{t("welcome_subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Assistant Section */}
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t("voice_assistant")}</h3>
        <p className="text-gray-600 mb-6">Use voice commands to navigate - say keywords like "chat", "disease", "plant care", or "home"</p>
        <VoiceAssistant />
      </div>

      {/* Three Main Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Chat Module */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white rounded-t-xl">
            <div className="flex items-center space-x-3 mb-4">
              <MessageCircle className="text-2xl" />
              <h3 className="text-xl font-semibold">{t("chat_feature_title")}</h3>
            </div>
            <p className="text-green-100">{t("chat_feature_desc")}</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex space-x-3">
                <div className="bg-green-600 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                  <MessageCircle className="text-white text-sm" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-700">Hello! I'm your AI farming assistant. How can I help you today?</p>
                </div>
              </div>
            </div>
            <Link href="/chat">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {t("get_started")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Disease Detection Module */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white rounded-t-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Search className="text-2xl" />
              <h3 className="text-xl font-semibold">{t("disease_feature_title")}</h3>
            </div>
            <p className="text-red-100">{t("disease_feature_desc")}</p>
          </div>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <Search className="mx-auto text-4xl text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Upload plant images</p>
              <p className="text-sm text-gray-500">for instant disease analysis</p>
            </div>
            <Link href="/disease-detection">
              <Button className="w-full bg-red-500 hover:bg-red-600">
                {t("analyze")}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Plant Care Module */}
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white rounded-t-xl">
            <div className="flex items-center space-x-3 mb-4">
              <Leaf className="text-2xl" />
              <h3 className="text-xl font-semibold">{t("care_feature_title")}</h3>
            </div>
            <p className="text-green-100">{t("care_feature_desc")}</p>
          </div>
          <CardContent className="p-6">
            <div className="space-y-4 mb-6">
              <img 
                src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250" 
                alt="Healthy tomato plants" 
                className="w-full h-32 object-cover rounded-lg"
              />
              <div>
                <h4 className="font-semibold text-gray-900">Get Plant Care Tips</h4>
                <p className="text-sm text-gray-600">Search for any plant and get detailed care instructions</p>
              </div>
            </div>
            <Link href="/plant-care">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                {t("search")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-8 mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/crop-calendar">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center p-4 h-auto hover:bg-green-600 hover:text-white group w-full"
            >
              <Calendar className="text-2xl mb-2" />
              <span className="text-sm font-medium">Crop Calendar</span>
            </Button>
          </Link>
          <Link href="/weather-info">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center p-4 h-auto hover:bg-blue-600 hover:text-white group w-full"
            >
              <Cloud className="text-2xl mb-2" />
              <span className="text-sm font-medium">Weather Info</span>
            </Button>
          </Link>
          <Link href="/market-prices">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center p-4 h-auto hover:bg-green-600 hover:text-white group w-full"
            >
              <TrendingUp className="text-2xl mb-2" />
              <span className="text-sm font-medium">Market Prices</span>
            </Button>
          </Link>
          <Link href="/learning-hub">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center p-4 h-auto hover:bg-blue-600 hover:text-white group w-full"
            >
              <Book className="text-2xl mb-2" />
              <span className="text-sm font-medium">Learning Hub</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Activity</h3>
          <Button variant="ghost" className="text-green-600 hover:text-green-700">
            View All
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading recent activities...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activities. Start by chatting with our AI assistant!
            </div>
          ) : (
            activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-full ${
                  activity.type === 'chat' ? 'bg-green-600' :
                  activity.type === 'disease_detection' ? 'bg-red-500' :
                  'bg-green-600'
                }`}>
                  {activity.type === 'chat' && <MessageCircle className="text-white w-4 h-4" />}
                  {activity.type === 'disease_detection' && <Search className="text-white w-4 h-4" />}
                  {activity.type === 'plant_care' && <Leaf className="text-white w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
