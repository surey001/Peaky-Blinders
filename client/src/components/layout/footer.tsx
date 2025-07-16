import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-farm-green p-2 rounded-lg">
                <Sprout className="text-white" />
              </div>
              <span className="text-xl font-bold">AI FARMTOOL</span>
            </div>
            <p className="text-gray-400">
              Empowering farmers with AI-driven agricultural solutions for better crop management and yield optimization.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>AI Chat Assistant</li>
              <li>Disease Detection</li>
              <li>Plant Care Guide</li>
              <li>Multilingual Support</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Documentation</li>
              <li>Community Forum</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-farm-green transition-colors">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-farm-green transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-farm-green transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI FARMTOOL. All rights reserved. Built for farmers, by farmers.</p>
        </div>
      </div>
    </footer>
  );
}
