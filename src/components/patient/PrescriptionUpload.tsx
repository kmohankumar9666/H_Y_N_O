import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { prescriptionAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import {
  Upload, FileText, X, CheckCircle, AlertCircle,
  Camera, Image as ImageIcon, File
} from 'lucide-react';

interface PrescriptionUploadProps {
  onNavigate: (path: string) => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  onNavigate
}) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were rejected. Only images (JPEG, PNG) and PDFs under 5MB are allowed.');
    }

    setFiles(prev => [...prev, ...validFiles]);
    setError('');
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      if (notes.trim()) {
        formData.append('notes', notes.trim());
      }

      await prescriptionAPI.upload(formData);
      setUploadSuccess(true);
      setFiles([]);
      setNotes('');
    } catch (err) {
      setError('Failed to upload prescription. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  if (uploadSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="text-center rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-green-50/50">
          <CardContent className="pt-8 pb-8">
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">Upload Successful!</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Your prescription has been uploaded successfully. Our pharmacists will review it and contact you soon.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => setUploadSuccess(false)}
                variant="outline"
                className="border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
              >
                Upload Another
              </Button>
              <Button
                onClick={() => onNavigate('/patient/pharmacy')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 text-white font-semibold"
              >
                Back to Pharmacy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-blue-100/50 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Upload Prescription
          </h1>
          <p className="text-gray-600 text-xl">Upload your prescription for medicine ordering with ease</p>
        </div>
      </div>

      <Card className="rounded-3xl shadow-lg border-0 bg-gradient-to-br from-white to-blue-50/50">
        <CardHeader className="p-8">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-2">
              <Upload className="h-6 w-6 text-white" />
            </div>
            Upload Files
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <div
            className="border-2 border-dashed border-blue-200 rounded-3xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group shadow-inner"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-10 w-10 text-blue-600" />
            </div>
            <p className="text-xl font-semibold text-gray-900 mb-3">Click to upload or drag and drop</p>
            <p className="text-gray-500 text-lg">Images (JPEG, PNG) or PDF files up to 5MB each</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                <Camera className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700">Photos</span>
              </div>
              <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                <FileText className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">PDFs</span>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {files.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Selected Files ({files.length})
              </h3>
              <div className="grid gap-4">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-md border border-gray-200/50">
                    <div className="bg-white rounded-full p-3 shadow-sm">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full p-2 transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="notes" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Any specific instructions or notes for the pharmacist..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="rounded-2xl border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100/50 shadow-md transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>

          {error && (
            <Alert className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 rounded-2xl p-4 shadow-inner">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none rounded-2xl font-semibold text-white text-lg"
          >
            {uploading ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Uploading...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Upload className="h-5 w-5" />
                Upload Prescription
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionUpload;
