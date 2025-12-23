import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Pill, Plus, Edit, Trash2, CheckCircle, XCircle, Package, FileText, Clock } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import api from '../../lib/api-client';

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  description?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  indications?: string;
  contraindications?: string;
  sideEffects?: string;
  precautions?: string;
  interactions?: string;
  category?: string;
  price: number;
  stockQuantity: number;
  prescriptionRequired?: string;
  status: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
  filePath?: string;
}

interface Order {
  id: string;
  patientId: string;
  patientName: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderItems?: any[];
}

export const AdminPharmacy = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Medicine Form State
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    genericName: '',
    dosageForm: '',
    strength: '',
    category: '',
    price: '',
    stockQuantity: '',
    prescriptionRequired: '',
    imageUrl: '',
  });



  // Load data on component mount
  useEffect(() => {
    loadPharmacyData();
  }, []);

  const loadPharmacyData = async () => {
    // Load medicines
    try {
      const medicinesData = await api.pharmacy.getMedicines();
      setMedicines(medicinesData || []);
    } catch (error) {
      console.error('Failed to load medicines:', error);
      setMedicines([]);
    }

    // Load prescriptions
    try {
      const prescriptionsData = await api.pharmacy.getPrescriptions();
      setPrescriptions(prescriptionsData || []);
    } catch (error) {
      console.error('Failed to load prescriptions:', error);
      setPrescriptions([]);
    }

    // Load orders
    try {
      const ordersData = await api.pharmacy.getOrders();
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setOrders([]);
    }
  };

  // Handle Medicine CRUD
  const handleAddMedicine = async () => {
    if (!medicineForm.name || !medicineForm.price || !medicineForm.stockQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medicineData = {
      name: medicineForm.name,
      genericName: medicineForm.genericName,
      dosageForm: medicineForm.dosageForm,
      strength: medicineForm.strength,
      category: medicineForm.category,
      price: parseFloat(medicineForm.price),
      stockQuantity: parseInt(medicineForm.stockQuantity),
      prescriptionRequired: medicineForm.prescriptionRequired,
      status: 'ACTIVE',
      imageUrl: medicineForm.imageUrl,
    };

    try {
      await api.pharmacy.addMedicine(medicineData);
      resetMedicineForm();
      toast.success('Medicine added successfully');
      // Reload data to ensure consistency
      await loadPharmacyData();
    } catch (error) {
      console.error('Failed to add medicine:', error);
      toast.error('Failed to add medicine');
    }
  };

  const handleEditMedicine = async () => {
    if (!editingMedicine) return;
    if (!medicineForm.name || !medicineForm.price || !medicineForm.stockQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatePayload = {
      id: editingMedicine.id,
      name: medicineForm.name,
      genericName: medicineForm.genericName || null,
      description: null,
      manufacturer: null,
      indications: null,
      contraindications: null,
      sideEffects: null,
      precautions: null,
      interactions: null,
      dosageForm: medicineForm.dosageForm || null,
      strength: medicineForm.strength || null,
      category: medicineForm.category || null,
      price: parseFloat(medicineForm.price),
      stockQuantity: parseInt(medicineForm.stockQuantity),
      prescriptionRequired: medicineForm.prescriptionRequired || null,
      status: 'ACTIVE' as const,
      imageUrl: medicineForm.imageUrl || null,
    };

    try {
      await api.pharmacy.updateMedicine(editingMedicine.id, updatePayload);
      resetMedicineForm();
      toast.success('Medicine updated successfully');
      // Reload data to ensure consistency
      await loadPharmacyData();
    } catch (error) {
      console.error('Failed to update medicine:', error);
      toast.error('Failed to update medicine');
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this medicine? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await api.pharmacy.deleteMedicine(medicineId);
      setMedicines(medicines.filter(med => med.id !== medicineId));
      toast.success('Medicine deleted successfully');
      // Reload data to ensure consistency
      await loadPharmacyData();
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const resetMedicineForm = () => {
    setMedicineForm({
      name: '',
      genericName: '',
      dosageForm: '',
      strength: '',
      category: '',
      price: '',
      stockQuantity: '',
      prescriptionRequired: '',
      imageUrl: '',
    });
    setEditingMedicine(null);
    setShowMedicineForm(false);
  };

  const startEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      genericName: medicine.genericName || '',
      dosageForm: medicine.dosageForm || '',
      strength: medicine.strength || '',
      category: medicine.category || '',
      price: medicine.price.toString(),
      stockQuantity: medicine.stockQuantity.toString(),
      prescriptionRequired: medicine.prescriptionRequired || '',
      imageUrl: medicine.imageUrl || '',
    });
    setShowMedicineForm(true);
  };

  // Handle Prescription Actions
  const handleAcceptPrescription = async (prescriptionId: string) => {
    try {
      await api.pharmacy.acceptPrescription(prescriptionId);
      toast.success('Prescription accepted successfully');
      await loadPharmacyData(); // Reload to update status
    } catch (error) {
      console.error('Failed to accept prescription:', error);
      toast.error('Failed to accept prescription');
    }
  };

  const handleDenyPrescription = async (prescriptionId: string) => {
    try {
      await api.pharmacy.denyPrescription(prescriptionId);
      toast.success('Prescription denied successfully');
      await loadPharmacyData(); // Reload to update status
    } catch (error) {
      console.error('Failed to deny prescription:', error);
      toast.error('Failed to deny prescription');
    }
  };

  // Handle Order Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.pharmacy.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      await loadPharmacyData(); // Reload to update status
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };





  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Pharmacy Management</h1>
        <p className="text-gray-600">Manage medicines, orders, and prescriptions</p>
      </div>

      <Tabs defaultValue="medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        {/* Medicines Tab */}
        <TabsContent value="medicines" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Medicines Inventory</h2>
            <Button onClick={() => setShowMedicineForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          {/* Medicine Form */}
          {showMedicineForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicine-name">Name *</Label>
                    <Input
                      id="medicine-name"
                      value={medicineForm.name}
                      onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                      placeholder="Medicine name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-generic-name">Generic Name</Label>
                    <Input
                      id="medicine-generic-name"
                      value={medicineForm.genericName}
                      onChange={(e) => setMedicineForm({ ...medicineForm, genericName: e.target.value })}
                      placeholder="Generic name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-price">Price (₹) *</Label>
                    <Input
                      id="medicine-price"
                      type="number"
                      value={medicineForm.price}
                      onChange={(e) => setMedicineForm({ ...medicineForm, price: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-stock">Stock Quantity *</Label>
                    <Input
                      id="medicine-stock"
                      type="number"
                      value={medicineForm.stockQuantity}
                      onChange={(e) => setMedicineForm({ ...medicineForm, stockQuantity: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-category">Category</Label>
                    <Select value={medicineForm.category} onValueChange={(value: string) => setMedicineForm({ ...medicineForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                        <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="Vitamins & Supplements">Vitamins & Supplements</SelectItem>
                        <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="Respiratory">Respiratory</SelectItem>
                        <SelectItem value="Digestive">Digestive</SelectItem>
                        <SelectItem value="Neurological">Neurological</SelectItem>
                        <SelectItem value="Dermatological">Dermatological</SelectItem>
                        <SelectItem value="Endocrine">Endocrine</SelectItem>
                        <SelectItem value="Ophthalmic">Ophthalmic</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-dosage-form">Dosage Form</Label>
                    <Input
                      id="medicine-dosage-form"
                      value={medicineForm.dosageForm}
                      onChange={(e) => setMedicineForm({ ...medicineForm, dosageForm: e.target.value })}
                      placeholder="Tablet, Capsule, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-strength">Strength</Label>
                    <Input
                      id="medicine-strength"
                      value={medicineForm.strength}
                      onChange={(e) => setMedicineForm({ ...medicineForm, strength: e.target.value })}
                      placeholder="500mg, 10mg/ml, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-prescription-required">Prescription Required</Label>
                    <Select value={medicineForm.prescriptionRequired} onValueChange={(value: string) => setMedicineForm({ ...medicineForm, prescriptionRequired: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prescription requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">Yes</SelectItem>
                        <SelectItem value="NO">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-image-url">Image URL</Label>
                    <Input
                      id="medicine-image-url"
                      value={medicineForm.imageUrl}
                      onChange={(e) => setMedicineForm({ ...medicineForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={editingMedicine ? handleEditMedicine : handleAddMedicine}>
                    {editingMedicine ? 'Update' : 'Add'} Medicine
                  </Button>
                  <Button variant="outline" onClick={resetMedicineForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medicines List */}
          <div className="grid gap-4">
            {medicines.map((medicine) => (
              <Card key={medicine.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Pill className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{medicine.name}</h3>
                        <p className="text-sm text-gray-600">{medicine.category}</p>
                        <p className="text-xs text-gray-500">Stock: {medicine.stockQuantity} | ₹{medicine.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditMedicine(medicine)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteMedicine(medicine.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <h2 className="text-xl font-semibold">Prescriptions</h2>
          <div className="grid gap-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Prescription #{prescription.id}</h3>
                        <p className="text-sm text-gray-600">Patient: {prescription.patientName}</p>
                        <p className="text-xs text-gray-500">Doctor: {prescription.doctorName} | Date: {prescription.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {prescription.status}
                      </Badge>
                      {prescription.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleAcceptPrescription(prescription.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDenyPrescription(prescription.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <h2 className="text-xl font-semibold">Orders</h2>
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">Patient: {order.patientName}</p>
                        <p className="text-xs text-gray-500">Date: {new Date(order.orderDate).toLocaleDateString()} | Total: ₹{order.totalAmount}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value: string) => handleUpdateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Badge variant="outline">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
