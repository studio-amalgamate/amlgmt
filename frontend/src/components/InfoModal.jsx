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
        {/* Top 70vh - Black with 90% opacity and blur */}
        <div 
          className="absolute top-0 left-0 right-0"
          style={{
            height: '70vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
              {/* Company name at top - h1 */}
              <h1 className="h1 lowercase text-black" style={{ marginTop: '2rem' }}>
                {settings.company_name || 'amalgamate'}
              </h1>

              {/* Footer at bottom - p1 */}
              <div className="flex justify-between items-center text-black p1">
                <div>
                  {settings.instagram_url ? (
                    <a 
                      href={settings.instagram_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-70 transition-opacity lowercase"
                    >
                      instagram
                    </a>
                  ) : (
                    'instagram'
                  )}
                </div>
                <div className="flex items-center" style={{ gap: '8vw' }}>
                  <div className="lowercase">{settings.contact_email || 'mail@amalgamate.studio'}</div>
                  <div className="lowercase">{settings.contact_phone || '+91-9987192152'}</div>
                </div>
              </div>
            </div>

            {/* Right Column - 50% */}
            <div className="w-1/2 h-full flex">
              {/* Left sub-column - empty - 50% */}
              <div className="w-1/2" />

              {/* Right sub-column - content - 50% */}
              <div className="w-1/2 flex flex-col justify-between pr-12 py-8">
                {/* Paragraph at top (same margin as company name) - p1 */}
                <div style={{ marginTop: '2rem' }}>
                  <p className="text-black p1 lowercase" style={{ textAlign: 'justify', lineHeight: '1.8' }}>
                    {settings.about_paragraph || 
                      'we are a photography and creative direction studio crafting visual stories that move, inspire, and endure. our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. from concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
                  </p>
                </div>

                {/* About us label at bottom with line - p1 */}
                <div>
                  <hr className="border-t border-black mb-3" style={{ opacity: 0.3 }} />
                  <div className="text-black p1 lowercase">
                    about us
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
      {/* Top section - Black with 90% opacity and blur + close button */}
      <div 
        className="relative flex-1"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
        {/* Company name - h1 (mobile size) */}
        <h1 className="h1 lowercase text-black mb-6">
          {settings.company_name || 'amalgamate'}
        </h1>

        {/* About paragraph at top - p1 (mobile size) */}
        <p className="text-black p1 lowercase mb-6" style={{ lineHeight: '1.8' }}>
          {settings.about_paragraph || 
            'we are a photography and creative direction studio crafting visual stories that move, inspire, and endure. our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. from concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
        </p>

        {/* About us label at bottom with line - p1 (mobile size) */}
        <div className="mb-4">
          <hr className="border-t border-black mb-2" style={{ opacity: 0.3 }} />
          <div className="text-black p1 lowercase">
            about us
          </div>
        </div>

        {/* Footer - p1 (mobile size) */}
        <div className="text-black p1">
          <div className="flex justify-between mb-1 lowercase">
            <div>
              {settings.instagram_url ? (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  instagram
                </a>
              ) : (
                'instagram'
              )}
            </div>
            <div className="text-right">{settings.contact_phone || '+91-9987192152'}</div>
          </div>
          <div className="text-right lowercase">{settings.contact_email || 'mail@amalgamate.studio'}</div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
