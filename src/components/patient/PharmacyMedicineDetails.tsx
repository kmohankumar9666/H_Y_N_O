import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import {
  Pill, ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart,
  Info, AlertTriangle, Clock, Shield, Truck
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
  category?: string;
  imageUrl?: string;
  prescriptionRequired: string;
  usageInstructions?: string;
  sideEffects?: string;
  warnings?: string;
  storageInstructions?: string;
  expiryDate?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface PharmacyMedicineDetailsProps {
  medicineId: string;
  onNavigate: (path: string) => void;
  onAddToCart: (medicine: Medicine) => void;
  cartItemCount: number;
}

export const PharmacyMedicineDetails: React.FC<PharmacyMedicineDetailsProps> = ({
  medicineId,
  onNavigate,
  onAddToCart,
  cartItemCount
}) => {
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMedicineDetails();
    fetchReviews();
  }, [medicineId]);

  const fetchMedicineDetails = async () => {
    try {
      const data = await medicineAPI.getById(medicineId);
      setMedicine(data);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Mock reviews data - replace with actual API call
      setReviews([
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          rating: 5,
          comment: 'Very effective medication. Fast delivery and good packaging.',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          rating: 4,
          comment: 'Good quality medicine. Took a bit longer than expected for delivery.',
          createdAt: '2024-01-10'
        }
      ]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (medicine) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(medicine);
      }
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center py-12">
        <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Medicine not found</h3>
        <Button onClick={() => onNavigate('/patient/pharmacy')}>
          Back to Pharmacy
        </Button>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 shadow-xl border border-blue-100/50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('/patient/pharmacy/medicine')} className="hover:bg-blue-100 rounded-2xl p-3">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Medicines
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 shadow-md rounded-full">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {cartItemCount} items in cart
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medicine Image & Basic Info */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50">
          <CardContent className="p-8">
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-md">
              {medicine.imageUrl ? (
                <img
                  src={medicine.imageUrl}
                  alt={medicine.name}
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl"><Pill class="h-24 w-24 text-blue-500" /></div>';
                    }
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                  <Pill className="h-24 w-24 text-blue-500" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">{medicine.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{medicine.description}</p>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-2xl">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm text-gray-700 font-medium ml-2">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
                <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ₹{medicine.price.toFixed(2)}
                </span>
                <Badge variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"} className={`px-4 py-2 rounded-full font-semibold shadow-lg ${
                  medicine.stockQuantity > 0
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200'
                }`}>
                  {medicine.stockQuantity > 0 ? `${medicine.stockQuantity} in stock` : 'Out of stock'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-gray-600 mb-1">Form</p>
                  <p className="font-semibold text-blue-700 flex items-center gap-2"><Pill className="h-4 w-4" /> {medicine.dosageForm}</p>
                </div>
                <div className="p-4 bg-indigo-50 rounded-2xl">
                  <p className="text-gray-600 mb-1">Strength</p>
                  <p className="font-semibold text-indigo-700">{medicine.strength}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <p className="text-gray-600 mb-1">Manufacturer</p>
                  <p className="font-semibold text-purple-700">{medicine.manufacturer}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className="text-gray-600 mb-1">Category</p>
                  <p className="font-semibold text-gray-700">{medicine.category || 'General'}</p>
                </div>
              </div>

              {medicine.prescriptionRequired === 'YES' && (
                <Alert className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 rounded-2xl p-4 shadow-inner">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Prescription required for this medicine
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Section */}
        <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-purple-50/50">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Add to Cart</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3 bg-white rounded-full p-2 shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-bold text-lg text-gray-900">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(medicine.stockQuantity, quantity + 1))}
                  disabled={quantity >= medicine.stockQuantity}
                  className="h-10 w-10 rounded-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                Max: {medicine.stockQuantity}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={medicine.stockQuantity === 0}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-2xl font-semibold text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart - ₹{(medicine.price * quantity).toFixed(2)}
              </Button>
              <Button
                variant="outline"
                onClick={toggleWishlist}
                className={`h-12 px-4 rounded-2xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all ${isWishlisted ? 'text-red-600 border-red-200 bg-red-50' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-gray-50/50">
        <CardContent className="p-8">
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            {['overview', 'reviews', 'usage'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {medicine.usageInstructions && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Usage Instructions
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-2xl">{medicine.usageInstructions}</p>
                </div>
              )}

              {medicine.sideEffects && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Side Effects
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded-2xl">{medicine.sideEffects}</p>
                </div>
              )}

              {medicine.warnings && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-600" />
                    Warnings
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-red-50 p-4 rounded-2xl">{medicine.warnings}</p>
                </div>
              )}

              {medicine.storageInstructions && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    Storage Instructions
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-2xl">{medicine.storageInstructions}</p>
                </div>
              )}

              {medicine.expiryDate && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    Expiry Date
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-2xl">{medicine.expiryDate}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                <Badge variant="secondary" className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full">
                  {reviews.length} reviews
                </Badge>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="rounded-2xl shadow-md border-0 bg-gradient-to-r from-white to-gray-50">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {review.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-900">{review.userName}</span>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">{review.createdAt}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600">Be the first to review this medicine</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Use</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Dosage</h4>
                    <p className="text-blue-700">{medicine.strength}</p>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl shadow-md border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-green-900 mb-3">Form</h4>
                    <p className="text-green-700">{medicine.dosageForm}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyMedicineDetails;
