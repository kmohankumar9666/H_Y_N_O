import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Heart, Droplets, Clock, Shield, Pill, Activity } from 'lucide-react';

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'medication' | 'lifestyle' | 'prevention';
  icon: string;
  readTime: number;
}

interface PharmacyHealthTipsProps {
  onNavigate: (path: string) => void;
}

export const PharmacyHealthTips: React.FC<PharmacyHealthTipsProps> = ({
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const healthTips: HealthTip[] = [
    {
      id: '1',
      title: 'Stay Hydrated',
      content: 'Drink at least 8 glasses of water daily for better health. Proper hydration helps maintain body temperature, keeps joints healthy, and prevents infections.',
      category: 'lifestyle',
      icon: 'droplets',
      readTime: 1
    },
    {
      id: '2',
      title: 'Medication Timing',
      content: 'Take your medications at the same time each day to maintain consistent levels in your body. Set reminders on your phone to help you remember.',
      category: 'medication',
      icon: 'clock',
      readTime: 1
    },
    {
      id: '3',
      title: 'Read Labels Carefully',
      content: 'Always read the medication label and follow dosage instructions carefully. Pay attention to warnings, side effects, and interactions with other medications.',
      category: 'medication',
      icon: 'shield',
      readTime: 2
    },
    {
      id: '4',
      title: 'Proper Storage',
      content: 'Store medicines in a cool, dry place away from direct sunlight. Keep them in their original containers and out of reach of children.',
      category: 'general',
      icon: 'pill',
      readTime: 1
    },
    {
      id: '5',
      title: 'Regular Exercise',
      content: 'Engage in at least 30 minutes of moderate exercise daily. Walking, swimming, or cycling can improve cardiovascular health and boost your immune system.',
      category: 'lifestyle',
      icon: 'activity',
      readTime: 2
    },
    {
      id: '6',
      title: 'Healthy Diet',
      content: 'Include plenty of fruits, vegetables, whole grains, and lean proteins in your diet. Limit processed foods, sugary drinks, and excessive salt intake.',
      category: 'lifestyle',
      icon: 'heart',
      readTime: 2
    },
    {
      id: '7',
      title: 'Sleep Well',
      content: 'Aim for 7-9 hours of quality sleep each night. Good sleep helps your body repair itself and strengthens your immune system.',
      category: 'lifestyle',
      icon: 'clock',
      readTime: 1
    },
    {
      id: '8',
      title: 'Regular Check-ups',
      content: 'Schedule regular health check-ups with your doctor. Early detection of health issues can lead to more effective treatment.',
      category: 'prevention',
      icon: 'activity',
      readTime: 1
    }
  ];

  const categories = [
    { id: 'all', label: 'All Tips', icon: Heart },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
    { id: 'prevention', label: 'Prevention', icon: Shield },
    { id: 'general', label: 'General', icon: Heart }
  ];

  const filteredTips = selectedCategory === 'all'
    ? healthTips
    : healthTips.filter(tip => tip.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets': return <Droplets className="h-6 w-6" />;
      case 'clock': return <Clock className="h-6 w-6" />;
      case 'shield': return <Shield className="h-6 w-6" />;
      case 'pill': return <Pill className="h-6 w-6" />;
      case 'activity': return <Activity className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      default: return <Heart className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'lifestyle': return 'bg-green-100 text-green-800';
      case 'prevention': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % filteredTips.length);
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, [filteredTips.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onNavigate('/patient/pharmacy')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pharmacy
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Tips</h1>
          <p className="text-gray-600">Stay healthy with our expert advice</p>
        </div>
      </div>

      {/* Enhanced Featured Tip */}
      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-6 w-6" />
            Featured Health Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 p-4 bg-white rounded-2xl shadow-lg border border-emerald-100">
              {getIcon(filteredTips[currentTipIndex]?.icon)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge className={`${getCategoryColor(filteredTips[currentTipIndex]?.category)} px-4 py-2 text-sm font-medium rounded-xl`}>
                  {filteredTips[currentTipIndex]?.category}
                </Badge>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredTips[currentTipIndex]?.readTime} min read
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {filteredTips[currentTipIndex]?.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {filteredTips[currentTipIndex]?.content}
              </p>
              <div className="flex justify-center mt-6 space-x-2">
                {filteredTips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-3 w-3 rounded-full transition-all duration-300 cursor-pointer ${
                      index === currentTipIndex ? 'bg-emerald-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentTipIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Category Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-lg'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip) => (
          <Card key={tip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getIcon(tip.icon)}
                  </div>
                  <Badge className={getCategoryColor(tip.category)}>
                    {tip.category}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600">{tip.readTime} min</span>
              </div>
              <CardTitle className="text-lg">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tip.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Health Reminder */}
      <Alert className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-2xl">
        <Heart className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong className="text-amber-900">Important Reminder:</strong> These tips are for general health information only.
          Always consult your healthcare provider for personalized medical advice and before making any significant changes to your health routine.
        </AlertDescription>
      </Alert>
    </div>
  );
};
