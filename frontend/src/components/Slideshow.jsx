import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slideshow = ({ media, projectInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorSide, setCursorSide] = useState('left');
  const [isHovering, setIsHovering] = useState(false);

  // Sort media so videos come first
  const sortedMedia = [...media].sort((a, b) => {
    if (a.type === 'video' && b.type === 'image') return -1;
    if (a.type === 'image' && b.type === 'video') return 1;
    return 0;
  });

  const handleMouseMove = (e) => {
    const { clientX, currentTarget } = e;
    const { width } = currentTarget.getBoundingClientRect();
    const midpoint = width / 2;
    setCursorSide(clientX > midpoint ? 'right' : 'left');
  };

  const handleClick = () => {
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
    <div className="relative h-screen w-full">
      {/* Main slideshow area */}
      <div
        className="h-full w-full flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{
          cursor: isHovering
            ? cursorSide === 'right'
              ? 'e-resize'
              : 'w-resize'
            : 'default'
        }}
      >
        {currentMedia.type === 'image' ? (
          <img
            src={currentMedia.url}
            alt={currentMedia.alt}
            className="max-h-[85vh] w-auto object-contain"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          />
        ) : (
          <video
            src={currentMedia.url}
            className="max-h-[85vh] w-auto object-contain"
            autoPlay
            muted
            loop
            controls={isHovering}
            style={{ userSelect: 'none' }}
          />
        )}
      </div>

      {/* Project info overlay */}
      {projectInfo && (
        <div className="absolute bottom-8 left-8 text-charcoal">
          <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {projectInfo.title}
          </h2>
          <p className="text-sm opacity-70">
            {projectInfo.client} / {projectInfo.date} / {projectInfo.location}
          </p>
        </div>
      )}

      {/* Slide counter */}
      <div className="absolute bottom-8 right-8 text-sm opacity-50">
        {currentIndex + 1} / {sortedMedia.length}
      </div>
    </div>
  );
};

export default Slideshow;