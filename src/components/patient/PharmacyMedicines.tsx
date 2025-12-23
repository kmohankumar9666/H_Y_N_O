import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import { Pill, Search, Plus, ShoppingCart, Filter, Heart, ChevronLeft, ChevronRight, SortAsc, SortDesc, AlertCircle } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  category?: string;
  imageUrl?: string;
  prescriptionRequired: string;
}

interface PharmacyMedicinesProps {
  onAddToCart: (medicine: Medicine, quantity: number) => void;
  cartItemCount: number;
  onNavigate: (path: string) => void;
}

export const PharmacyMedicines: React.FC<PharmacyMedicinesProps> = ({
  onAddToCart,
  cartItemCount,
  onNavigate
}) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(9);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await medicineAPI.getAll();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  // Predefined medicine categories
  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Vitamins & Supplements',
    'Cardiovascular',
    'Respiratory',
    'Digestive',
    'Neurological',
    'Dermatological',
    'Endocrine',
    'Ophthalmic',
    'Other'
  ];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    const matchesPrice = medicine.price >= minPrice && medicine.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = (medicineId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(medicineId)) {
        newFavorites.delete(medicineId);
      } else {
        newFavorites.add(medicineId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-100/50 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Medicines
            </h1>
            <p className="text-gray-600 text-xl">Browse and order medicines online with prescription delivery</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-md rounded-full">
              <ShoppingCart className="h-5 w-5 mr-2" />
              {cartItemCount} items in cart
            </Badge>
            <Button
              onClick={() => onNavigate('/patient/pharmacy/cart')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 text-white font-semibold"
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Search, Filter, Sort, and Price Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-4 rounded-2xl border-2 border-blue-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
          />
        </div>
        <div className="relative group">
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="pl-12 w-full py-4 rounded-2xl border-2 border-blue-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-blue-200">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="relative group">
          <SortAsc className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="pl-12 w-full py-4 rounded-2xl border-2 border-blue-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-blue-200">
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="price-asc">Price Low-High</SelectItem>
              <SelectItem value="price-desc">Price High-Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <div className="relative group flex-1">
            <Input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="pl-10 pr-4 py-4 rounded-2xl border-2 border-blue-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
          </div>
          <div className="relative group flex-1">
            <Input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="pl-10 pr-4 py-4 rounded-2xl border-2 border-blue-200/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
          </div>
        </div>
      </div>

      {/* Enhanced Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedMedicines.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 shadow-inner">
            <Pill className="h-20 w-20 text-gray-300 mb-6 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No medicines found</h3>
            <p className="text-gray-600 text-lg mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSortBy('name-asc');
                setMinPrice(0);
                setMaxPrice(1000);
                setCurrentPage(1);
              }}
              variant="outline"
              className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-8 py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          paginatedMedicines.map((medicine) => {
            const quantity = quantities.get(medicine.id) || 1;
            const setQuantity = (newQuantity: number) => {
              setQuantities(prev => new Map(prev).set(medicine.id, newQuantity));
            };
            return (
              <Card
                key={medicine.id}
                className="group border-0 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-sm"
              >
                <CardHeader className="p-0 relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden group-hover:brightness-105 transition-all duration-300">
                    {medicine.imageUrl ? (
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-purple-100"><Pill class="h-12 w-12 text-blue-500 animate-bounce" /></div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-pulse">
                        <Pill className="h-12 w-12 text-blue-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(medicine.id)}
                        className={`p-2 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg ${favorites.has(medicine.id) ? 'text-red-500 shadow-red-200/50' : 'text-gray-400 shadow-gray-200/50'}`}
                      >
                        <Heart className={`h-5 w-5 transition-colors ${favorites.has(medicine.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Badge
                        variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"}
                        className={`px-3 py-2 rounded-full shadow-lg font-semibold ${
                          medicine.stockQuantity > 0
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200 shadow-green-200/50'
                            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200 shadow-red-200/50'
                        }`}
                      >
                        {medicine.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{medicine.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{medicine.description}</CardDescription>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500 space-y-2">
                      <p className="flex items-center gap-2"><span className="font-semibold text-gray-700">Form:</span> <Pill className="h-3 w-3 text-blue-500" /> {medicine.dosageForm}</p>
                      <p className="flex items-center gap-2"><span className="font-semibold text-gray-700">Strength:</span> <span className="bg-blue-100 px-2 py-1 rounded-full text-xs font-medium text-blue-700">{medicine.strength}</span></p>
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ₹{medicine.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    <p className="flex items-center gap-2"><span className="font-semibold text-gray-700">By:</span> <span className="bg-purple-100 px-2 py-1 rounded-full text-xs font-medium text-purple-700">{medicine.manufacturer}</span></p>
                  </div>
                  {medicine.prescriptionRequired === 'YES' && (
                    <Alert className="mb-4 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 rounded-2xl p-3 shadow-inner">
                      <AlertDescription className="flex items-center gap-2 text-orange-800">
                        <AlertCircle className="h-4 w-4" />
                        Prescription required for this medicine
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-semibold text-gray-700">Qty:</label>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="h-9 w-9 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={medicine.stockQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-16 h-9 text-center border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 shadow-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.min(medicine.stockQuantity, quantity + 1))}
                        className="h-9 w-9 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => onAddToCart(medicine, quantity)}
                    disabled={medicine.stockQuantity === 0}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-2xl font-semibold text-white"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
