import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { projectAPI, authAPI } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Plus, LogOut, Edit, Trash2, Settings as SettingsIcon, GripVertical } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectAPI.getAllAdmin();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectAPI.delete(projectId);
      toast({ title: 'Success', description: 'Project deleted' });
      loadProjects();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for smooth UX
    setProjects(items);

    // Prepare order data for API
    const projectOrder = items.map((project, index) => ({
      id: project.id,
      order: index,
    }));

    try {
      await projectAPI.reorder(projectOrder);
      toast({ title: 'Success', description: 'Projects reordered' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reorder projects',
        variant: 'destructive',
      });
      // Reload to revert on error
      loadProjects();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Project Dashboard</h1>
          <div className="flex gap-4">
            <Link to="/admin/settings">
              <Button variant="outline">
                <SettingsIcon className="mr-2" size={16} />
                Settings
              </Button>
            </Link>
            <Link to="/admin/project/new">
              <Button>
                <Plus className="mr-2" size={16} />
                New Project
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2" size={16} />
              Logout
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 mb-4">No projects yet</p>
            <Link to="/admin/project/new">
              <Button>
                <Plus className="mr-2" size={16} />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="projects">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid gap-4"
                >
                  {projects.map((project, index) => (
                    <Draggable key={project.id} draggableId={project.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                          >
                            <GripVertical size={24} />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-medium mb-2">{project.title}</h2>
                            <p className="text-sm text-gray-500">
                              {project.client} • {project.date} • {project.location}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {project.media.length} media items
                              {project.featured && ' • Featured'}
                              {!project.published && ' • DRAFT'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/admin/project/${project.id}`}>
                              <Button variant="outline" size="sm">
                                <Edit size={16} />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(project.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
