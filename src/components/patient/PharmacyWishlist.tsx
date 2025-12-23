import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import { Heart, ShoppingCart, Plus, ArrowLeft, Trash2 } from 'lucide-react';

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

interface PharmacyWishlistProps {
  onNavigate: (path: string) => void;
  onAddToCart: (medicine: Medicine) => void;
  cartItemCount: number;
}

export const PharmacyWishlist: React.FC<PharmacyWishlistProps> = ({
  onNavigate,
  onAddToCart,
  cartItemCount
}) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      // Mock wishlist data - replace with actual API call
      const mockWishlist = [
        {
          id: '1',
          name: 'Paracetamol 500mg',
          description: 'Pain relief medication',
          price: 25.50,
          stockQuantity: 100,
          dosageForm: 'Tablet',
          strength: '500mg',
          manufacturer: 'PharmaCorp',
          prescriptionRequired: 'NO'
        },
        {
          id: '2',
          name: 'Vitamin D3 1000IU',
          description: 'Vitamin D supplement',
          price: 45.00,
          stockQuantity: 50,
          dosageForm: 'Capsule',
          strength: '1000IU',
          manufacturer: 'HealthVit',
          prescriptionRequired: 'NO'
        }
      ];
      setWishlist(mockWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (medicineId: string) => {
    setWishlist(prev => prev.filter(item => item.id !== medicineId));
    // TODO: Implement API call to remove from wishlist
  };

  const addToCart = (medicine: Medicine) => {
    onAddToCart(medicine);
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(medicine.id);
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
      {/* Enhanced Header with Gradient */}
      <div className="bg-gradient-to-r from-pink-50 via-red-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('/patient/pharmacy')}
              className="bg-white/50 hover:bg-white/80 border border-pink-200 rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pharmacy
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600 text-lg">Medicines you've saved for later</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-pink-100 text-pink-800 border-pink-200 rounded-xl">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {cartItemCount} items in cart
            </Badge>
          </div>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-4">Save medicines you want to buy later</p>
          <Button onClick={() => onNavigate('/patient/pharmacy/medicine')}>
            Browse Medicines
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{wishlist.length} items in wishlist</p>
            <Button variant="outline" onClick={() => onNavigate('/patient/pharmacy/cart')}>
              View Cart
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-red-400 fill-current" />
                  </div>
                  <CardTitle className="text-lg">{medicine.name}</CardTitle>
                  <p className="text-gray-600">{medicine.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{medicine.price.toFixed(2)}
                      </span>
                      <Badge variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"}>
                        {medicine.stockQuantity > 0 ? `${medicine.stockQuantity} in stock` : 'Out of stock'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Form:</strong> {medicine.dosageForm}</p>
                      <p><strong>Strength:</strong> {medicine.strength}</p>
                      <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
                    </div>
                    {medicine.prescriptionRequired === 'YES' && (
                      <Alert>
                        <AlertDescription>
                          Prescription required for this medicine
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stockQuantity === 0}
                        className="flex-1"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => removeFromWishlist(medicine.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
