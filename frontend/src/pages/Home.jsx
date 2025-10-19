import React from 'react';
import Slideshow from '../components/Slideshow';
import { getFeaturedImages } from '../mock';

const Home = () => {
  const featuredImages = getFeaturedImages();

  return (
    <div className="lg:ml-64 h-screen">
      <Slideshow media={featuredImages} projectInfo={null} />
    </div>
  );
};

export default Home;