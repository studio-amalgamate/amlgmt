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
      <div className="pt-20 lg:pt-0 lg:ml-64 h-screen flex items-center justify-center">
        <p className="text-xl opacity-50">Loading...</p>
      </div>
    );
  }

  if (featuredImages.length === 0) {
    return (
      <div className="pt-20 lg:pt-0 lg:ml-64 h-screen flex items-center justify-center">
        <p className="text-xl opacity-50">No featured images yet</p>
      </div>
    );
  }

  return (
    <div className="pt-20 lg:pt-0 h-screen" style={{ marginLeft: '0' }}>
      <div className="lg:ml-[15vw]" style={{ width: '100%', maxWidth: '100vw' }}>
        <Slideshow media={featuredImages} projectInfo={null} />
      </div>
    </div>
  );
};

export default Home;
