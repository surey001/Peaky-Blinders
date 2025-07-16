import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/language";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import DiseaseDetection from "@/pages/disease-detection";
import PlantCare from "@/pages/plant-care";
import CropCalendar from "@/pages/crop-calendar";
import WeatherInfo from "@/pages/weather-info";
import MarketPrices from "@/pages/market-prices";
import LearningHub from "@/pages/learning-hub";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/disease-detection" component={DiseaseDetection} />
      <Route path="/plant-care" component={PlantCare} />
      <Route path="/crop-calendar" component={CropCalendar} />
      <Route path="/weather-info" component={WeatherInfo} />
      <Route path="/market-prices" component={MarketPrices} />
      <Route path="/learning-hub" component={LearningHub} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
