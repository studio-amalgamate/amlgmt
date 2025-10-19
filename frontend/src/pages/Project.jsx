import React from 'react';
import { useParams } from 'react-router-dom';
import Slideshow from '../components/Slideshow';
import { getProjectById } from '../mock';

const Project = () => {
  const { id } = useParams();
  const project = getProjectById(id);

  if (!project) {
    return (
      <div className="ml-64 h-screen flex items-center justify-center">
        <p className="text-xl opacity-50">Project not found</p>
      </div>
    );
  }

  return (
    <div className="ml-64 h-screen">
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
  );
};

export default Project;