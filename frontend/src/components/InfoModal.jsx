import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { settingsAPI } from '../services/api';

const InfoModal = ({ isOpen, onClose }) => {
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

  // Desktop Layout
  if (!isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50"
        onClick={onClose}
      >
        {/* Top 70vh - Black with blur */}
        <div 
          className="absolute top-0 left-0 right-0"
          style={{
            height: '70vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(12px)',
          }}
        />

        {/* Bottom 30vh - White */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-white"
          style={{ height: '30vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex">
            {/* Left Column - 50% */}
            <div className="w-1/2 h-full flex flex-col justify-between px-12 py-8">
              {/* Company name at top */}
              <h1 className="text-7xl font-bold lowercase tracking-tight text-black">
                {settings.company_name || 'amalgamate'}
              </h1>

              {/* Footer at bottom */}
              <div className="flex justify-between items-center text-black" style={{ fontSize: '8px' }}>
                <div>
                  {settings.instagram_url ? (
                    <a 
                      href={settings.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity"
                    >
                      Instagram
                    </a>
                  ) : (
                    'Instagram'
                  )}
                </div>
                <div className="flex" style={{ gap: '150%' }}>
                  <div style={{ marginRight: '4vw' }}>{settings.contact_email || 'mail@amalgamate.studio'}</div>
                  <div>{settings.contact_phone || '+91-9987192152'}</div>
                </div>
              </div>
            </div>

            {/* Right Column - 50% */}
            <div className="w-1/2 h-full flex">
              {/* Left sub-column - empty - 50% */}
              <div className="w-1/2" />

              {/* Right sub-column - content - 50% */}
              <div className="w-1/2 flex flex-col justify-between pr-12 py-8">
                {/* Paragraph at top (same margin as company name) */}
                <p className="text-black text-justify leading-relaxed" style={{ fontSize: '8px' }}>
                  {settings.about_paragraph || 
                    'We are a photography and creative direction studio crafting visual stories that move, inspire, and endure. Our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. From concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
                </p>

                {/* About us label at bottom with line above */}
                <div>
                  <hr className="border-t border-black mb-2" style={{ opacity: 0.3 }} />
                  <div className="text-black uppercase tracking-wider font-medium" style={{ fontSize: '8px' }}>
                    About us
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout
  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col"
      style={{ height: '100vh', width: '100vw' }}
    >
      {/* Top section - Black with blur and close button */}
      <div 
        className="relative flex-1"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X size={28} strokeWidth={1.5} />
        </button>
      </div>

      {/* Bottom section - White with content */}
      <div 
        className="bg-white px-6 py-8 flex flex-col justify-between"
        style={{ minHeight: '40vh' }}
      >
        {/* Company name */}
        <h1 className="text-5xl font-bold lowercase tracking-tight text-black mb-8">
          {settings.company_name || 'amalgamate'}
        </h1>

        {/* About paragraph at top */}
        <p className="text-black leading-relaxed mb-8" style={{ fontSize: '8px' }}>
          {settings.about_paragraph || 
            'We are a photography and creative direction studio crafting visual stories that move, inspire, and endure. Our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. From concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
        </p>

        {/* About us label at bottom with line */}
        <div className="mb-4">
          <hr className="border-t border-black mb-2" style={{ opacity: 0.3 }} />
          <div className="text-black uppercase tracking-wider font-medium" style={{ fontSize: '8px' }}>
            About us
          </div>
        </div>

        {/* Footer */}
        <div className="text-black" style={{ fontSize: '8px' }}>
          <div className="flex justify-between mb-1">
            <div>
              {settings.instagram_url ? (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
              ) : (
                'Instagram'
              )}
            </div>
            <div className="text-right">{settings.contact_phone || '+91-9987192152'}</div>
          </div>
          <div className="text-right">{settings.contact_email || 'mail@amalgamate.studio'}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
