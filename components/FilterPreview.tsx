import React, { useEffect, useRef } from 'react';
import { FilterConfig } from '../types';

interface FilterPreviewProps {
  filter: FilterConfig;
  imageSrc: string; // The base image to preview
  isSelected: boolean;
  onClick: (filter: FilterConfig) => void;
}

const FilterPreview: React.FC<FilterPreviewProps> = ({ filter, imageSrc, isSelected, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    
    img.onload = () => {
      // Draw small preview
      canvas.width = 100;
      canvas.height = 100;
      
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Apply CSS filter
      ctx.filter = filter.cssFilter;
      
      // Draw image (center crop strategy simplified for square preview)
      // Calculate aspect ratio
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width / 2) - (img.width / 2) * scale;
      const y = (canvas.height / 2) - (img.height / 2) * scale;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      // Reset filter for overlay
      ctx.filter = 'none';

      // Apply overlay if exists
      if (filter.overlayColor) {
        ctx.globalCompositeOperation = filter.overlayBlend || 'source-over';
        ctx.fillStyle = filter.overlayColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Reset composite
        ctx.globalCompositeOperation = 'source-over';
      }
    };
  }, [filter, imageSrc]);

  return (
    <button 
      onClick={() => onClick(filter)}
      className={`flex flex-col items-center space-y-2 transition-transform hover:scale-105 focus:outline-none`}
    >
      <div className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 ${isSelected ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-gray-700'}`}>
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
      <span className={`text-xs font-medium ${isSelected ? 'text-purple-400' : 'text-gray-400'}`}>
        {filter.name}
      </span>
    </button>
  );
};

export default React.memo(FilterPreview);
