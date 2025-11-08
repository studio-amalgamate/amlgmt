import React, { useState, useEffect } from 'react';
import Slideshow from '../components/Slideshow';
import { featuredAPI } from '../services/api';

const Home = () => {
  const [featuredImages, setFeaturedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedImages();
  }, []);

  const loadFeaturedImages = async () => {
    try {
      const data = await featuredAPI.getAll();
      setFeaturedImages(data);
    } catch (error) {
      console.error('Error loading featured images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lg:ml-64 h-screen flex items-center justify-center">
        <p className="text-xl opacity-50">Loading...</p>
      </div>
    );
  }

  if (featuredImages.length === 0) {
    return (
      <div className="lg:ml-64 h-screen flex items-center justify-center">
        <p className="text-xl opacity-50">No featured images yet</p>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Slideshow media={featuredImages} projectInfo={null} />
    </div>
  );
};

export default Home;
