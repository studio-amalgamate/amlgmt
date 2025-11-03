import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsAPI, authAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    brand_name: 'Your Name',
    logo_url: '',
    about_title: 'About',
    about_content: '',
    contact_email: '',
    contact_phone: '',
    instagram_url: '',
    clients_list: '',
  });

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setFormData({
        brand_name: data.brand_name || 'Your Name',
        logo_url: data.logo_url || '',
        about_title: data.about_title || 'About',
        about_content: data.about_content || '',
        contact_email: data.contact_email || '',
        contact_phone: data.contact_phone || '',
        instagram_url: data.instagram_url || '',
        clients_list: data.clients_list || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await settingsAPI.update(formData);
      toast({ title: 'Success', description: 'Settings saved successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);

    try {
      const result = await settingsAPI.uploadLogo(file);
      setFormData({ ...formData, logo_url: result.logo_url });
      toast({ title: 'Success', description: 'Logo uploaded' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to upload logo', variant: 'destructive' });
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="mb-6">
          <ArrowLeft className="mr-2" size={16} />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-normal mb-8">Site Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Brand Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-normal mb-4">Brand</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                {formData.logo_url && (
                  <div className="mt-2 mb-4">
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}${formData.logo_url}`}
                      alt="Logo"
                      className="h-16 object-contain"
                    />
                  </div>
                )}
                <Label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mt-2"
                >
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-sm text-gray-500">
                      {uploadingLogo ? 'Uploading...' : 'Click to upload logo'}
                    </p>
                  </div>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-normal mb-4">About Page</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="about_title">About Section Title</Label>
                <Input
                  id="about_title"
                  value={formData.about_title}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="about_content">About Content</Label>
                <Textarea
                  id="about_content"
                  value={formData.about_content}
                  onChange={(e) => setFormData({ ...formData, about_content: e.target.value })}
                  rows={8}
                  placeholder="Write your bio here..."
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-normal mb-4">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Phone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/yourhandle"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Clients Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-normal mb-4">Select Clients</h2>
            
            <div>
              <Label htmlFor="clients_list">Clients List (comma-separated)</Label>
              <Textarea
                id="clients_list"
                value={formData.clients_list}
                onChange={(e) => setFormData({ ...formData, clients_list: e.target.value })}
                rows={3}
                placeholder="Vogue India, GQ, Elle, Harper's Bazaar"
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" disabled={saving} size="lg">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
