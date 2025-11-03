import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, mediaAPI, authAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { ArrowLeft, Upload, Trash2, Image as ImageIcon, Video, Star, GripVertical } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    date: '',
    location: '',
    description: '',
    featured: false,
    published: true,
  });
  const [media, setMedia] = useState([]);
  const [projectId, setProjectId] = useState(id !== 'new' ? id : null);

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    if (!isNew) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectAPI.getById(id);
      setFormData({
        title: data.title,
        client: data.client,
        date: data.date,
        location: data.location,
        description: data.description,
        featured: data.featured,
        published: data.published !== undefined ? data.published : true,
      });
      setMedia(data.media || []);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load project', variant: 'destructive' });
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNew) {
        const newProject = await projectAPI.create(formData);
        setProjectId(newProject.id);
        toast({ title: 'Success', description: 'Project created! Now upload media.' });
        navigate(`/admin/project/${newProject.id}`, { replace: true });
      } else {
        await projectAPI.update(projectId, formData);
        toast({ title: 'Success', description: 'Project updated' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save project', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!projectId) {
      toast({ title: 'Error', description: 'Please save project details first', variant: 'destructive' });
      return;
    }

    setUploading(true);

    for (const file of files) {
      try {
        const newMedia = await mediaAPI.upload(projectId, file);
        setMedia(prev => [...prev, newMedia]);
        toast({ title: 'Success', description: `${file.name} uploaded` });
      } catch (error) {
        toast({ title: 'Error', description: `Failed to upload ${file.name}`, variant: 'destructive' });
      }
    }

    setUploading(false);
    e.target.value = '';
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!window.confirm('Delete this media?')) return;

    try {
      await mediaAPI.delete(projectId, mediaId);
      setMedia(prev => prev.filter(m => m.id !== mediaId));
      toast({ title: 'Success', description: 'Media deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete media', variant: 'destructive' });
    }
  };

  const handleToggleFeatured = async (mediaId, currentStatus) => {
    try {
      await mediaAPI.toggleFeatured(projectId, mediaId, !currentStatus);
      setMedia(prev => prev.map(m => 
        m.id === mediaId ? { ...m, featured: !currentStatus } : m
      ));
      toast({ 
        title: 'Success', 
        description: !currentStatus ? 'Added to featured' : 'Removed from featured' 
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update featured status', variant: 'destructive' });
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setMedia(updatedItems);

    // Save to backend
    try {
      const mediaOrder = updatedItems.map(item => ({ id: item.id, order: item.order }));
      await mediaAPI.reorder(projectId, mediaOrder);
      toast({ title: 'Success', description: 'Media order updated' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update order', variant: 'destructive' });
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

        <h1 className="text-3xl font-normal mb-8">
          {isNew ? 'Create New Project' : 'Edit Project'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  placeholder="e.g. January 2025"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Published (visible on public site)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured Project (all media from this project on homepage)
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-6">
            {loading ? 'Saving...' : isNew ? 'Create Project' : 'Update Project'}
          </Button>
        </form>

        {projectId && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-normal mb-4">Media</h2>

            <div className="mb-6">
              <Label
                htmlFor="media-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-500">
                    {uploading ? 'Uploading...' : 'Click to upload images or videos'}
                  </p>
                </div>
              </Label>
              <input
                id="media-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {media.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No media uploaded yet</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="relative group">
                    {item.type === 'image' ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${item.url}`}
                        alt={item.alt}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Image load error:', item.url);
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Video size={48} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant={item.featured ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleFeatured(item.id, item.featured)}
                        className="h-8 w-8 p-0"
                        title={item.featured ? "Remove from featured" : "Add to featured"}
                      >
                        <Star size={16} fill={item.featured ? "currentColor" : "none"} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMedia(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      {item.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />}
                      {item.order + 1}
                      {item.featured && <Star size={12} fill="currentColor" className="ml-1" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectEditor;
