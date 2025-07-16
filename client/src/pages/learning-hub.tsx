import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Book, Play, Clock, Star, Search, Filter } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTranslation } from "@/lib/translations";

const learningContent = {
  courses: [
    {
      id: 1,
      title: "Organic Farming Fundamentals",
      description: "Learn the basics of organic farming, soil health, and sustainable practices",
      duration: "4 hours",
      level: "Beginner",
      rating: 4.8,
      students: 1250,
      category: "Organic Farming",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      lessons: [
        "Introduction to Organic Farming",
        "Soil Health and Composting",
        "Natural Pest Management",
        "Organic Certification Process"
      ]
    },
    {
      id: 2,
      title: "Crop Rotation and Planning",
      description: "Master the art of crop rotation for better yields and soil health",
      duration: "3 hours",
      level: "Intermediate",
      rating: 4.6,
      students: 890,
      category: "Crop Management",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      lessons: [
        "Principles of Crop Rotation",
        "Planning Seasonal Crops",
        "Companion Planting",
        "Maximizing Land Use"
      ]
    },
    {
      id: 3,
      title: "Pest and Disease Management",
      description: "Identify and control common pests and diseases in crops",
      duration: "5 hours",
      level: "Intermediate",
      rating: 4.7,
      students: 2100,
      category: "Plant Health",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      lessons: [
        "Common Crop Diseases",
        "Integrated Pest Management",
        "Biological Control Methods",
        "Chemical Control Guidelines"
      ]
    },
    {
      id: 4,
      title: "Water Management in Agriculture",
      description: "Efficient irrigation techniques and water conservation methods",
      duration: "3.5 hours",
      level: "Beginner",
      rating: 4.5,
      students: 1680,
      category: "Water Management",
      image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      lessons: [
        "Irrigation Systems",
        "Drip Irrigation Setup",
        "Rainwater Harvesting",
        "Water Quality Testing"
      ]
    },
    {
      id: 5,
      title: "Smart Farming Technologies",
      description: "Introduction to modern farming technologies and IoT applications",
      duration: "6 hours",
      level: "Advanced",
      rating: 4.9,
      students: 756,
      category: "Technology",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      lessons: [
        "IoT in Agriculture",
        "Precision Farming",
        "Drone Applications",
        "Data Analytics for Farming"
      ]
    },
    {
      id: 6,
      title: "Sustainable Agriculture Practices",
      description: "Build a sustainable farming system for long-term success",
      duration: "4.5 hours",
      level: "Intermediate",
      rating: 4.8,
      students: 1425,
      category: "Sustainability",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      lessons: [
        "Sustainable Farming Principles",
        "Carbon Footprint Reduction",
        "Renewable Energy in Farming",
        "Biodiversity Conservation"
      ]
    }
  ],
  categories: ["All", "Organic Farming", "Crop Management", "Plant Health", "Water Management", "Technology", "Sustainability"],
  levels: ["All", "Beginner", "Intermediate", "Advanced"]
};

export default function LearningHub() {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  const filteredCourses = learningContent.courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const LevelBadge = ({ level }: { level: string }) => {
    const colors = {
      Beginner: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      Advanced: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[level as keyof typeof colors]}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Book className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Hub</h1>
        </div>
        <p className="text-gray-600">Enhance your farming knowledge with expert-led courses</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {learningContent.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                {learningContent.levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <div className="aspect-video relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <LevelBadge level={course.level} />
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500 w-4 h-4 fill-current" />
                    <span className="font-medium">{course.rating}</span>
                    <span className="text-gray-600">({course.students} students)</span>
                  </div>
                  <span className="text-gray-600">{course.category}</span>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Content:</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {course.lessons.slice(0, 3).map((lesson, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-green-600 rounded-full"></div>
                        <span>{lesson}</span>
                      </li>
                    ))}
                    {course.lessons.length > 3 && (
                      <li className="text-green-600 font-medium">+{course.lessons.length - 3} more lessons</li>
                    )}
                  </ul>
                </div>
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <Card className="mt-6">
          <CardContent className="p-12 text-center">
            <Book className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">No courses found matching your criteria</p>
          </CardContent>
        </Card>
      )}

      {/* Learning Stats */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Learning Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{learningContent.courses.length}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {learningContent.courses.reduce((sum, course) => sum + course.students, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {(learningContent.courses.reduce((sum, course) => sum + course.rating, 0) / learningContent.courses.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {learningContent.courses.reduce((sum, course) => sum + parseFloat(course.duration), 0).toFixed(1)}h
              </div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}