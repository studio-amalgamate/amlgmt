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
        {/* Top 60vh - Black with 90% opacity and blur */}
        <div 
          className="absolute top-0 left-0 right-0"
          style={{
            height: '60vh',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(12px)',
          }}
        />

        {/* Bottom 40vh - White */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-white"
          style={{ height: '40vh', padding: '40px 0' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full flex px-12">
            {/* Left Column - 50% */}
            <div className="w-1/2 h-full flex flex-col justify-between">
              {/* Company name at top - h1 */}
              <h1 className="h1">
                {settings.company_name || 'amalgamate'}
              </h1>

              {/* Footer at bottom - p2 */}
              <div className="flex justify-between items-center p2">
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
                <div className="flex items-center" style={{ gap: '8vw' }}>
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
              <div className="w-1/2 flex flex-col justify-between pr-12">
                {/* Paragraph at top - p1 */}
                <div>
                  <p className="p1" style={{ textAlign: 'justify' }}>
                    {settings.about_paragraph || 
                      'we are a photography and creative direction studio crafting visual stories that move, inspire, and endure. our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. from concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
                  </p>
                </div>

                {/* About us label at bottom with line - p1 */}
                <div>
                  <hr className="border-t border-black mb-3" style={{ opacity: 0.3 }} />
                  <div className="p1">
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
      {/* Top section - 50vh - Black with 90% opacity and blur + close button */}
      <div 
        className="relative"
        style={{
          height: '50vh',
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

      {/* Bottom section - 50vh - White with content */}
      <div 
        className="bg-white flex flex-col justify-between"
        style={{ height: '50vh', padding: '40px 24px' }}
      >
        {/* Company name - h1 (mobile size 60px) */}
        <h1 className="h1">
          {settings.company_name || 'amalgamate'}
        </h1>

        {/* About paragraph - p1 (mobile size 14px) */}
        <p className="p1" style={{ flex: 1, marginTop: '20px', marginBottom: '20px' }}>
          {settings.about_paragraph || 
            'we are a photography and creative direction studio crafting visual stories that move, inspire, and endure. our work spans photography, film, and print, blending fine art sensibility with a contemporary edge. from concept to execution, we collaborate closely with designers, artists, and individuals to create imagery that feels timeless and emotional and is guided by a deep respect for light, composition and story telling.'}
        </p>

        {/* About us label with line - p1 (mobile size 14px) */}
        <div className="mb-4">
          <hr className="border-t border-black mb-2" style={{ opacity: 0.3 }} />
          <div className="p1">
            about us
          </div>
        </div>

        {/* Footer - p2 (mobile size 14px italic) */}
        <div className="p2 flex justify-between items-center">
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
          <div className="text-center">
            {settings.contact_email || 'mail@amalgamate.studio'}
          </div>
          <div className="text-right">
            {settings.contact_phone || '+91-9987192152'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
