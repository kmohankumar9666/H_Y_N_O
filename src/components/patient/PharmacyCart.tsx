import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ShoppingCart, Pill, Plus, Minus, Trash2, ArrowLeft, Package, CreditCard, IndianRupee } from 'lucide-react';

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

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface PharmacyCartProps {
  cart: CartItem[];
  onUpdateQuantity: (medicineId: string, quantity: number) => void;
  onRemoveFromCart: (medicineId: string) => void;
  onNavigate: (path: string) => void;
}

export const PharmacyCart: React.FC<PharmacyCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onNavigate
}) => {
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  };

  const getDeliveryCharges = () => {
    return 50;
  };

  const getTaxes = () => {
    return getSubtotal() * 0.05;
  };

  const getTotalPrice = () => {
    return getSubtotal() + getDeliveryCharges() + getTaxes();
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('/patient/pharmacy')}
              className="text-white hover:bg-white/20 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Medicines
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-1">Shopping Cart</h1>
              <p className="text-blue-100 text-lg">{getCartItemCount()} items in your cart</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm font-medium">
              <ShoppingCart className="h-4 w-4 mr-2" />
              {getCartItemCount()} items
            </Badge>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">0</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Your cart is feeling lonely</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Add some medicines to your cart and let's get you feeling better!
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => onNavigate('/patient/pharmacy')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Pill className="h-4 w-4 mr-2" />
              Browse Medicines
            </Button>
            <Button
              variant="outline"
              onClick={() => onNavigate('/patient/pharmacy/prescription-upload')}
              className="border-2 hover:bg-gray-50 transition-colors duration-200"
            >
              <Package className="h-4 w-4 mr-2" />
              Upload Prescription
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.medicine.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center shadow-sm">
                    <Pill className="h-10 w-10 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-lg text-gray-900">{item.medicine.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        {item.medicine.dosageForm}
                      </span>
                      <span className="flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        {item.medicine.strength}
                      </span>
                      <span className="text-blue-600 font-medium">₹{item.medicine.price.toFixed(2)} each</span>
                    </div>
                    <p className="text-xs text-gray-500">by {item.medicine.manufacturer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.medicine.id, item.quantity - 1)}
                        className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center font-medium text-gray-900">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.medicine.id, item.quantity + 1)}
                        disabled={item.quantity >= item.medicine.stockQuantity}
                        className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-200"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-lg text-gray-900">₹{(item.medicine.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × ₹{item.medicine.price.toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFromCart(item.medicine.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({getCartItemCount()} items):</span>
                  <span className="font-medium">₹{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges:</span>
                  <span className="font-medium">₹{getDeliveryCharges().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Taxes (GST 5%):</span>
                  <span className="font-medium">₹{getTaxes().toFixed(2)}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900">Total Amount:</span>
                  <div className="text-right">
                    <span className="text-2xl text-blue-600">₹{getTotalPrice().toFixed(2)}</span>
                    <p className="text-xs text-gray-500 font-normal mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onNavigate('/patient/pharmacy')}
                  className="flex-1 border-2 hover:bg-gray-50 transition-all duration-200"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => onNavigate('/patient/pharmacy/checkout')}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
