import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slideshow = ({ media, projectInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorSide, setCursorSide] = useState('left');
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imageOrientations, setImageOrientations] = useState({});

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

  // Detect image orientation
  useEffect(() => {
    if (isMobile) return; // Only for desktop

    sortedMedia.forEach((item, index) => {
      if (item.type === 'image' && !imageOrientations[index]) {
        const img = new Image();
        img.onload = () => {
          setImageOrientations(prev => ({
            ...prev,
            [index]: img.width > img.height ? 'landscape' : 'portrait'
          }));
        };
        img.src = `${process.env.REACT_APP_BACKEND_URL}${item.url}`;
      }
    });
  }, [sortedMedia, isMobile]);

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
    const orientation = imageOrientations[currentIndex];
    if (!isMobile && orientation === 'portrait' && currentIndex + 1 < sortedMedia.length) {
      // For portrait, skip by 2 if next is also available
      const nextOrientation = imageOrientations[currentIndex + 1];
      if (nextOrientation === 'portrait') {
        setCurrentIndex((prev) => (prev + 2) % sortedMedia.length);
        return;
      }
    }
    setCurrentIndex((prev) => (prev + 1) % sortedMedia.length);
  };

  const prevSlide = () => {
    const prevIndex = (currentIndex - 1 + sortedMedia.length) % sortedMedia.length;
    const prevOrientation = imageOrientations[prevIndex];
    
    if (!isMobile && prevOrientation === 'portrait' && prevIndex > 0) {
      const prevPrevOrientation = imageOrientations[prevIndex - 1];
      if (prevPrevOrientation === 'portrait') {
        setCurrentIndex((prev) => (prev - 2 + sortedMedia.length) % sortedMedia.length);
        return;
      }
    }
    setCurrentIndex(prevIndex);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [media]);

  const currentMedia = sortedMedia[currentIndex];
  const currentOrientation = imageOrientations[currentIndex];
  const nextMedia = currentIndex + 1 < sortedMedia.length ? sortedMedia[currentIndex + 1] : null;
  const nextOrientation = imageOrientations[currentIndex + 1];

  // On desktop, show 2 portrait images side by side
  const showDoublePortrait = !isMobile && currentOrientation === 'portrait' && nextOrientation === 'portrait' && nextMedia;

  return (
    <div className="relative h-screen w-full">
      {/* Main slideshow area */}
      <div
        className="h-full w-full flex items-center justify-center overflow-hidden px-4 md:px-8"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          cursor: !isMobile && isHovering
            ? cursorSide === 'right'
              ? 'e-resize'
              : 'w-resize'
            : 'default'
        }}
      >
        {showDoublePortrait ? (
          // Show two portrait images side by side
          <div className="flex gap-8 items-center justify-center h-full">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
              alt={currentMedia.alt}
              className="max-h-[50vh] w-auto object-contain"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}${nextMedia.url}`}
              alt={nextMedia.alt}
              className="max-h-[50vh] w-auto object-contain"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
            />
          </div>
        ) : (
          // Show single image or video
          <>
            {currentMedia.type === 'image' ? (
              <img
                src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
                alt={currentMedia.alt}
                className="max-h-[70vh] lg:max-h-[50vh] w-auto max-w-full object-contain"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
              />
            ) : (
              <video
                src={`${process.env.REACT_APP_BACKEND_URL}${currentMedia.url}`}
                className="max-h-[70vh] lg:max-h-[50vh] w-auto max-w-full object-contain"
                autoPlay
                muted
                loop
                controls={isHovering}
                style={{ userSelect: 'none' }}
              />
            )}
          </>
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

      {/* Project info overlay - changed to sans-serif */}
      {projectInfo && (
        <div className="absolute bottom-6 left-4 md:bottom-8 md:left-8 text-charcoal">
          <h2 className="text-xl md:text-2xl font-normal mb-2">
            {projectInfo.title}
          </h2>
          <p className="text-xs md:text-sm opacity-70">
            {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
          </p>
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 text-xs md:text-sm opacity-50">
        {currentIndex + 1} / {sortedMedia.length}
      </div>
    </div>
  );
};

export default Slideshow;