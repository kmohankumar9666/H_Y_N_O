import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import {
  Pill, ShoppingCart, Search, Plus, Package, CreditCard, ArrowRight
} from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  imageUrl?: string;
  prescriptionRequired: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

interface PharmacyDashboardProps {
  cartItemCount: number;
  onNavigate: (path: string) => void;
  onAddToCart: (medicine: Medicine, quantity: number) => void;
}

export const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({
  cartItemCount,
  onNavigate,
  onAddToCart
}) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Mock data for new features
  const healthTips = [
    "Stay hydrated! Drink at least 8 glasses of water daily for better health.",
    "Take your medications at the same time each day to maintain consistent levels in your body.",
    "Always read the medication label and follow dosage instructions carefully.",
    "Store medicines in a cool, dry place away from direct sunlight.",
    "Never share prescription medications with others, even if they have similar symptoms."
  ];

  const healthReminders = [
    { id: 1, type: 'medication', title: 'Blood Pressure Medication', time: '8:00 AM', daysLeft: 2 },
    { id: 2, type: 'refill', title: 'Vitamin D Supplement', time: 'Refill due', daysLeft: 5 },
    { id: 3, type: 'appointment', title: 'Doctor Checkup', time: 'Tomorrow 2:00 PM', daysLeft: 1 }
  ];

  const upcomingRefills = [
    { id: 1, medicine: 'Lisinopril 10mg', dueDate: '2024-01-15', quantity: 30 },
    { id: 2, medicine: 'Metformin 500mg', dueDate: '2024-01-18', quantity: 60 },
    { id: 3, medicine: 'Amlodipine 5mg', dueDate: '2024-01-20', quantity: 30 }
  ];

  const recentActivity = [
    { id: 1, type: 'order', title: 'Order #1234 Delivered', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'prescription', title: 'New Prescription Added', time: '1 day ago', status: 'pending' },
    { id: 3, type: 'refill', title: 'Refill Reminder Sent', time: '3 days ago', status: 'info' }
  ];

  const spendingData = [1200, 950, 1400, 1100, 1600, 1300]; // Mock monthly spending

  // Auto-rotate health tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [healthTips.length]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const medicinesData = await medicineAPI.getAll();
      setMedicines(medicinesData);
      // For now, we'll skip orders since getAll doesn't exist, can be added later
      setRecentOrders([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredMedicines = medicines.slice(0, 6); // Top 6 medicines as featured
  const totalMedicines = medicines.length;
  const recentOrderCount = recentOrders.length;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to medicines page with search query
      onNavigate(`/patient/pharmacy/medicine?search=${encodeURIComponent(searchQuery)}`);
    } else {
      onNavigate('/patient/pharmacy/medicine');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Gradient and Search */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Online Pharmacy
            </h1>
            <p className="text-gray-600 text-lg">Your trusted source for quality medicines and healthcare essentials</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-3 rounded-xl border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-xl"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800 border-blue-200">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartItemCount} items in cart
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-sm border-green-200 text-green-800">
            {totalMedicines} medicines available
          </Badge>
        </div>
      </div>

      {/* Enhanced Quick Actions with Gradients and Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group" 
          onClick={() => onNavigate('/patient/pharmacy/medicine')}
        >
          <CardContent className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Pill className="h-12 w-12 text-blue-600 mx-auto mb-4 relative z-10" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 relative z-10">Browse Medicines</h3>
            <p className="text-gray-600 text-sm relative z-10">Search and order medicines online</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group" 
          onClick={() => onNavigate('/patient/pharmacy/cart')}
        >
          <CardContent className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4 relative z-10" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 relative z-10">Shopping Cart</h3>
            <p className="text-gray-600 text-sm relative z-10">{cartItemCount} items in cart</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group" 
          onClick={() => onNavigate('/patient/pharmacy/checkout')}
        >
          <CardContent className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4 relative z-10" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 relative z-10">Checkout</h3>
            <p className="text-gray-600 text-sm relative z-10">Complete your order securely</p>
          </CardContent>
        </Card>

        <Card 
          className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group" 
          onClick={() => onNavigate('/patient/pharmacy/orders')}
        >
          <CardContent className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Package className="h-12 w-12 text-orange-600 mx-auto mb-4 relative z-10" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 relative z-10">Order History</h3>
            <p className="text-gray-600 text-sm relative z-10">Track your past orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Tips Carousel */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Health Tip of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="relative">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-lg font-medium text-gray-800 italic">
                "{healthTips[currentTipIndex]}"
              </p>
              <div className="flex justify-center mt-4 space-x-2">
                {healthTips.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                      index === currentTipIndex ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Featured Medicines */}
      <Card className="border-blue-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Featured Medicines
          </CardTitle>
          <p className="text-blue-100">Discover our top recommended products</p>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMedicines.slice(0, 6).map((medicine) => (
                  <div 
                    key={medicine.id} 
                    className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      {medicine.imageUrl ? (
                        <img
                          src={medicine.imageUrl}
                          alt={medicine.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-purple-100"><Pill class="h-12 w-12 text-blue-500" /></div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-purple-100">
                          <Pill className="h-12 w-12 text-blue-500" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge 
                          variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"}
                          className={`${
                            medicine.stockQuantity > 0 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {medicine.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{medicine.name}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{medicine.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-500 space-y-1">
                          <p><span className="font-medium">Form:</span> {medicine.dosageForm}</p>
                          <p><span className="font-medium">Strength:</span> {medicine.strength}</p>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ₹{medicine.price.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        onClick={() => onAddToCart(medicine, 1)}
                        disabled={medicine.stockQuantity === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 px-6 py-3 rounded-xl"
                onClick={() => onNavigate('/patient/pharmacy/medicine')}
              >
                View All Medicines
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
