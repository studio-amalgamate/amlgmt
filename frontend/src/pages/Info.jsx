import React from 'react';

const Info = () => {
  return (
    <div className="ml-64 h-screen flex items-center justify-center p-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          About
        </h1>
        
        <div className="space-y-6 text-base leading-relaxed opacity-80">
          <p>
            [Your Name] is a photographer based in [City], India. Specializing in portrait, 
            documentary, and editorial photography.
          </p>
          
          <p>
            With a focus on capturing authentic moments and telling compelling visual stories, 
            [Your Name] has worked with clients across fashion, editorial, and commercial sectors.
          </p>

          <div className="pt-8 border-t border-gray-200 mt-8">
            <h2 className="text-xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Contact
            </h2>
            <p>Email: your.email@example.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
            <p className="mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                Instagram
              </a>
            </p>
          </div>

          <div className="pt-8 border-t border-gray-200 mt-8">
            <h2 className="text-xl mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Select Clients
            </h2>
            <p>Vogue India, GQ, Elle, Harper's Bazaar, National Geographic</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;