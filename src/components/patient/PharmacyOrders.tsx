import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, RefreshCw, MapPin, CreditCard, Banknote, Phone, Mail, Info } from 'lucide-react';
import { toast } from 'sonner';
import { orderAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';

interface OrderItem {
  id: string;
  medicine: {
    id: string;
    name: string;
    price: number;
    dosageForm: string;
    strength: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderItems: OrderItem[];
}

interface PharmacyOrdersProps {
  onNavigate: (path: string) => void;
}

export const PharmacyOrders: React.FC<PharmacyOrdersProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current patient ID from auth context
      const patientId = user?.id;
      if (!patientId) {
        setError('Patient ID not found. Please log in again.');
        return;
      }

      const ordersData = await orderAPI.getByPatient(patientId);
      // Parse deliveryAddress from JSON string to object if needed
      const parsedOrders = ordersData.map((order: any) => ({
        ...order,
        deliveryAddress: typeof order.deliveryAddress === 'string'
          ? JSON.parse(order.deliveryAddress)
          : order.deliveryAddress
      }));
      setOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'default';
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const handleViewDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleCancelOrder = async (orderId: string) => {
    const confirmed = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');
    if (!confirmed) return;

    try {
      await orderAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    const confirmed = window.confirm('Are you sure you want to confirm this order?');
    if (!confirmed) return;

    try {
      await orderAPI.updateStatus(orderId, 'confirmed');
      toast.success('Order confirmed successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Failed to confirm order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-4">You haven't placed any orders yet. Start shopping to see your order history here.</p>
        <Button onClick={() => onNavigate('/patient/pharmacy')} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Browse Medicines
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Order History</h1>
            <p className="text-gray-600 text-lg">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <CardTitle className="text-xl font-bold text-gray-900">Order #{order.id}</CardTitle>
                  <Badge 
                    variant={getStatusBadgeVariant(order.status)} 
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-full shadow-md ${
                      order.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                      order.status?.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      order.status?.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      order.status?.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-blue-100 text-blue-800 border-blue-200'
                    }`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Ordered on</p>
                  <p className="font-semibold text-gray-900">{formatDate(order.orderDate)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Order Items ({order.orderItems?.length || 0})
                </h5>
                <div className="space-y-3">
                  {order.orderItems?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-25 rounded-xl border border-gray-100 hover:shadow-inner transition-all">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-sm">
                        <Package className="h-7 w-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900">{item.medicine?.name}</h4>
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <span>{item.medicine?.dosageForm}</span>
                          <span>•</span>
                          <span>{item.medicine?.strength}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-gray-900">Qty: {item.quantity}</p>
                        <p className="text-base font-bold text-blue-600">₹{item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="border-gray-200" />

              {/* Order Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Delivery Address
                  </h4>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm">{order.deliveryAddress?.name}</p>
                    <p className="text-gray-600 text-sm">{order.deliveryAddress?.street}</p>
                    <p className="text-gray-600 text-sm">{order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}</p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {order.deliveryAddress?.phone}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {order.deliveryAddress?.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    Payment Details
                  </h4>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <span className="font-medium">Method:</span> 
                      <Banknote className="h-3 w-3 text-green-600" />
                      {order.paymentMethod?.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <span className="font-medium">Total:</span> 
                      <span className="font-bold text-2xl text-green-600">₹{order.totalAmount?.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(order.id)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {expandedOrderId === order.id ? 'Hide Details' : 'View Details'}
                </Button>
                {order.status?.toLowerCase() === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Order
                  </Button>
                )}
              </div>

              {/* Expanded Details */}
              {expandedOrderId === order.id && (
                <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-inner border border-blue-100">
                  <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-600" />
                    Additional Order Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <p className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold bg-blue-100 px-2 py-1 rounded text-xs">Order ID</span>
                        {order.id}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold bg-green-100 px-2 py-1 rounded text-xs">Status</span>
                        {order.status}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold bg-purple-100 px-2 py-1 rounded text-xs">Order Date</span>
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold bg-indigo-100 px-2 py-1 rounded text-xs">Total Items</span>
                        {order.orderItems?.length || 0}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold bg-yellow-100 px-2 py-1 rounded text-xs">Payment Method</span>
                        {order.paymentMethod}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <span className="font-semibold bg-red-100 px-2 py-1 rounded text-xs">Total Amount</span>
                        <span className="font-bold text-xl text-green-600">₹{order.totalAmount?.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
