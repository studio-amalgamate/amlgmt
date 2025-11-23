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
              <div className="flex justify-between text-sm text-black">
                <div>{settings.copyright_text || '© amalgamate'}</div>
                <div className="flex gap-8">
                  <div>{settings.contact_email || 'mail@amalgamate.studio'}</div>
                  <div>{settings.contact_phone || '+91-9987192152'}</div>
                </div>
              </div>
            </div>

            {/* Right Column - 50% */}
            <div className="w-1/2 h-full flex">
              {/* Left sub-column - empty - 50% */}
              <div className="w-1/2" />

              {/* Right sub-column - content - 50% */}
              <div className="w-1/2 flex flex-col justify-center pr-12">
                <div className="space-y-4">
                  <h2 className="text-sm uppercase tracking-wider text-black font-medium">
                    About us
                  </h2>
                  <p className="text-sm leading-relaxed text-black text-justify">
                    {settings.about_paragraph || 
                      'We are a photography and creative direction studio crafting visual stories that move, inspire, and endure. Our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. From concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
                  </p>
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

        {/* About section */}
        <div className="space-y-3 mb-8">
          <h2 className="text-xs uppercase tracking-wider text-black font-medium">
            About us
          </h2>
          <p className="text-sm leading-relaxed text-black">
            {settings.about_paragraph || 
              'We are a photography and creative direction studio crafting visual stories that move, inspire, and endure. Our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. From concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
          </p>
        </div>

        {/* Footer */}
        <div className="space-y-2 text-xs text-black">
          <div className="flex justify-between">
            <div>{settings.copyright_text || '© amalgamate'}</div>
            <div className="text-right">{settings.contact_phone || '+91-9987192152'}</div>
          </div>
          <div className="text-right">{settings.contact_email || 'mail@amalgamate.studio'}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
