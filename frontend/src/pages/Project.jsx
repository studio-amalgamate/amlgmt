import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import { projectAPI } from '../services/api';

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const data = await projectAPI.getById(id);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 lg:pt-0 lg:ml-64 h-screen flex items-center justify-center px-4">
        <p className="text-xl opacity-50">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 lg:pt-0 lg:ml-64 h-screen flex items-center justify-center px-4">
        <p className="text-xl opacity-50">Project not found</p>
      </div>
    );
  }

  if (project.media.length === 0) {
    return (
      <div className="pt-20 lg:pt-0 lg:ml-64 h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl mb-4">{project.title}</h2>
          <p className="text-xl opacity-50">No media in this project yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-0 h-screen" style={{ marginLeft: '0' }}>
      <div className="lg:ml-[15vw]" style={{ width: '100%', maxWidth: '100vw' }}>
        <Slideshow
          media={project.media}
          projectInfo={{
            title: project.title,
            client: project.client,
            date: project.date,
            location: project.location
          }}
        />
      </div>
    </div>
  );
};

export default Project;
