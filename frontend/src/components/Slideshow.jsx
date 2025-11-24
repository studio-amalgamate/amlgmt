import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slideshow = ({ media, projectInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorSide, setCursorSide] = useState('left');
  const [isHovering, setIsHovering] = useState(false);
  const [isOverVideo, setIsOverVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sort media so videos come first
  const sortedMedia = [...media].sort((a, b) => {
    if (a.type === 'video' && b.type === 'image') return -1;
    if (a.type === 'image' && b.type === 'video') return 1;
    return 0;
  });

  const handleMouseMove = (e) => {
    if (isMobile) return;
    
    setCursorPosition({ x: e.clientX, y: e.clientY });
    
    // Check if mouse is over video element
    const target = e.target;
    const overVideo = target.tagName === 'VIDEO' || target.closest('video');
    
    setIsOverVideo(overVideo);
    
    if (overVideo) {
      // Over video: hide custom cursor, show default cursor, show controls
      setIsHovering(false);
      return;
    }
    
    // Outside video: show custom cursor, determine side
    setIsHovering(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    const midpoint = containerWidth / 2;
    setCursorSide(x > midpoint ? 'right' : 'left');
  };

  const handleClick = () => {
    if (isMobile) return;
    
    // Don't navigate if clicking directly on video element
    // Only prevent navigation if actually over the video, not just when video is displayed
    if (isOverVideo) return;
    
    if (cursorSide === 'right') {
      nextSlide();
    } else {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedMedia.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedMedia.length) % sortedMedia.length);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [media]);

  const currentMedia = sortedMedia[currentIndex];

  return (
    <>
      {/* Mobile Layout - Structured 100vh */}
      {isMobile ? (
        <div className="fixed inset-0 flex flex-col" style={{ height: '100vh', width: '100vw' }}>
          {/* Menu space (10vh) - handled by Sidebar.jsx */}
          <div style={{ height: '10vh' }}></div>

          {/* Image Slideshow (70vh) */}
          <div 
            className="flex items-center justify-center bg-white overflow-hidden"
            style={{ height: '70vh', width: '100vw' }}
            onMouseMove={handleMouseMove}
            onClick={!isMobile ? handleClick : undefined}
            onMouseEnter={() => currentMedia.type !== 'video' && setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{ cursor: currentMedia.type === 'video' ? 'default' : (isMobile ? 'default' : 'none'), height: '70vh', width: '100vw' }}
          >
            {currentMedia.type === 'image' ? (
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
                alt={currentMedia.alt}
                className="w-auto h-auto max-h-full max-w-full object-contain"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              />
            ) : (
              <video
                src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
                className="w-auto h-auto max-h-full max-w-full object-contain"
                autoPlay
                muted
                loop
                controls
                style={{ userSelect: 'none' }}
              />
            )}
          </div>

          {/* Navigation Buttons (8vh with 1.5vh padding top and bottom) */}
          <div 
            className="flex items-center justify-center gap-8 bg-white"
            style={{ height: '8vh', width: '100vw', paddingTop: '1.5vh', paddingBottom: '1.5vh' }}
          >
            <button
              onClick={prevSlide}
              className="text-charcoal hover:opacity-70 transition-opacity"
              aria-label="Previous"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#131314"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="text-charcoal hover:opacity-70 transition-opacity"
              aria-label="Next"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#131314"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Project Information (12vh) - left aligned */}
          <div 
            className="flex items-center bg-white px-6"
            style={{ height: '12vh', width: '100vw' }}
          >
            {projectInfo ? (
              <div className="text-charcoal text-left">
                <h2 className="text-base font-normal mb-1">
                  {projectInfo.title}
                </h2>
                <p className="text-xs opacity-70">
                  {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Desktop & Tablet Layout */
        <div className="relative h-screen w-full lg:flex lg:ml-0">
          {/* Desktop: Column 2 - Project Info (15vw with 2.5vw padding) */}
          {projectInfo && (
            <div className="hidden xl:flex items-end bg-white fixed" style={{ width: '15vw', left: '15vw', height: '100vh', padding: '2.5vw 0 2.5vw 2.5vw', zIndex: 30 }}>
              <div className="text-charcoal">
                <h2 className="h2 lowercase mb-2">
                  {projectInfo.title}
                </h2>
                <p className="p1 lowercase opacity-70">
                  {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
                </p>
              </div>
            </div>
          )}

          {/* Tablet: Column 2 - Project Info (25vw with 1.5vw padding) */}
          {projectInfo && (
            <div className="hidden lg:flex xl:hidden items-end bg-white fixed" style={{ width: '25vw', left: '15vw', height: '100vh', padding: '1.5vw 0 1.5vw 1.5vw', zIndex: 30 }}>
              <div className="text-charcoal">
                <h2 className="h3 lowercase mb-2">
                  {projectInfo.title}
                </h2>
                <p className="p1 lowercase opacity-70" style={{ fontSize: '14px' }}>
                  {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
                </p>
              </div>
            </div>
          )}

          {/* Desktop: Column 3 - Slideshow (70vw, starts after 30vw) */}
          <div className="relative h-screen xl:ml-[30vw] lg:ml-[40vw]" style={{ width: '100%' }}>
            <div
              className="h-full w-full flex flex-col items-center justify-center overflow-hidden px-4 md:px-8 lg:px-[7.5vw] xl:px-[10%]"
              onMouseMove={handleMouseMove}
              onClick={!isMobile ? handleClick : undefined}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setIsOverVideo(false);
              }}
              style={{ cursor: isOverVideo ? 'default' : 'none' }}
            >
              {/* Image */}
              <div className="flex items-center justify-center" style={{ flex: '1' }}>
                {currentMedia.type === 'image' ? (
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
                    alt={currentMedia.alt}
                    className="w-auto object-contain max-h-[70vh] max-w-full"
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                  />
                ) : (
                  <video
                    src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
                    className="w-auto object-contain max-h-[70vh] max-w-full"
                    autoPlay
                    muted
                    loop
                    controls
                    style={{ userSelect: 'none' }}
                  />
                )}
              </div>

              {/* Navigation Icons Below Image - Tablet Only */}
              <div className="hidden lg:flex xl:hidden items-center justify-center gap-8 pb-8">
                <button
                  onClick={prevSlide}
                  className="text-charcoal hover:opacity-70 transition-opacity"
                  aria-label="Previous"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#131314"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="text-charcoal hover:opacity-70 transition-opacity"
                  aria-label="Next"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#131314"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              {/* Custom Cursor Icons - Desktop Only */}
              {!isMobile && isHovering && (
                <div
                  className="fixed pointer-events-none z-50"
                  style={{
                    left: `${cursorPosition.x}px`,
                    top: `${cursorPosition.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {cursorSide === 'left' ? (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#131314"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  ) : (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#131314"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Slide counter - Desktop & Tablet */}
            <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 text-xs md:text-sm opacity-50">
              {currentIndex + 1} / {sortedMedia.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Slideshow;