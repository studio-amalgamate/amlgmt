import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { settingsAPI } from '../services/api';

const InfoModal = ({ isOpen, onClose, onBack }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await settingsAPI.get();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isMobile = window.innerWidth < 1024;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        transition: 'background-color 0.5s ease'
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 md:top-8 md:right-8 text-white hover:opacity-70 transition-opacity"
        aria-label="Close"
      >
        <X size={32} strokeWidth={1.5} />
      </button>

      {/* Back button for mobile */}
      {isMobile && onBack && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBack();
          }}
          className="absolute top-6 left-6 text-white hover:opacity-70 transition-opacity flex items-center gap-2"
          aria-label="Back"
        >
          <ArrowLeft size={28} strokeWidth={1.5} />
        </button>
      )}

      <div 
        className="max-w-4xl px-8 md:px-16 text-white overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-3xl md:text-5xl mb-8 md:mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
          About
        </h1>
        
        <div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed opacity-90">
          <p>
            [Your Name] is a photographer based in [City], India. Specializing in portrait, 
            documentary, and editorial photography.
          </p>
          
          <p>
            With a focus on capturing authentic moments and telling compelling visual stories, 
            [Your Name] has worked with clients across fashion, editorial, and commercial sectors.
          </p>

          <div className="pt-8 md:pt-12 border-t border-white border-opacity-20 mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl mb-4 md:mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Contact
            </h2>
            <p>Email: your.email@example.com</p>
            <p>Phone: +91 XXXXX XXXXX</p>
            <p className="mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-70 transition-opacity underline"
              >
                Instagram
              </a>
            </p>
          </div>

          <div className="pt-8 md:pt-12 border-t border-white border-opacity-20 mt-8 md:mt-12">
            <h2 className="text-2xl md:text-3xl mb-4 md:mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Select Clients
            </h2>
            <p>Vogue India, GQ, Elle, Harper's Bazaar, National Geographic</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;