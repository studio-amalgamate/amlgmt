import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slideshow = ({ media, projectInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorSide, setCursorSide] = useState('left');
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const containerWidth = rect.width;
    const midpoint = containerWidth / 2;
    setCursorSide(x > midpoint ? 'right' : 'left');
  };

  const handleClick = () => {
    if (isMobile) return;
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
    <div className="relative h-screen w-full flex">
      {/* Project Info Wrapper - Full height, 2% left padding */}
      {projectInfo && (
        <div className="hidden lg:flex items-end pb-8" style={{ paddingLeft: '2%', minWidth: 'auto' }}>
          <div className="text-charcoal">
            <h2 className="text-2xl font-normal mb-2">
              {projectInfo.title}
            </h2>
            <p className="text-sm opacity-70">
              {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
            </p>
          </div>
        </div>
      )}

      {/* Slideshow Wrapper - Full height, 10% left and right padding */}
      <div className="flex-grow relative h-screen">
        <div
          className="h-full w-full flex items-center justify-center overflow-hidden px-4 md:px-8 lg:px-[10%]"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{ cursor: 'none' }}
        >
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
              controls={isHovering}
              style={{ userSelect: 'none' }}
            />
          )}

          {/* Custom Cursor Icons */}
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

        {/* Mobile navigation arrows */}
        {isMobile && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal bg-white bg-opacity-80 rounded-full p-2 shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal bg-white bg-opacity-80 rounded-full p-2 shadow-lg"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Mobile Project info */}
        {projectInfo && (
          <div className="lg:hidden absolute bottom-6 left-4 text-charcoal bg-white bg-opacity-80 px-3 py-2 rounded">
            <h2 className="text-base font-normal mb-1">
              {projectInfo.title}
            </h2>
            <p className="text-xs opacity-70">
              {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
            </p>
          </div>
        )}

        {/* Slide counter */}
        <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 text-xs md:text-sm opacity-50">
          {currentIndex + 1} / {sortedMedia.length}
        </div>
      </div>
    </div>
  );
};

export default Slideshow;