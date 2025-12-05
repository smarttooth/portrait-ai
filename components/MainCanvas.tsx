import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { FilterConfig } from '../types';

interface MainCanvasProps {
  imageSrc: string;
  activeFilter: FilterConfig;
}

export interface MainCanvasHandle {
  download: () => void;
  getDataURL: () => string;
}

const MainCanvas = forwardRef<MainCanvasHandle, MainCanvasProps>(({ imageSrc, activeFilter }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    download: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const link = document.createElement('a');
      link.download = `portrait-pro-${activeFilter.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    },
    getDataURL: () => {
       const canvas = canvasRef.current;
       if (!canvas) return '';
       return canvas.toDataURL('image/png');
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      // Set canvas to full resolution of the image
      // But we need to fit it into the container for display via CSS
      
      // For high DPI screens, we might want to cap max resolution if needed, 
      // but for download quality, let's keep original unless it's huge.
      const MAX_DIMENSION = 2048; 
      let width = img.width;
      let height = img.height;
      
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
          } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
          }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw
      ctx.clearRect(0, 0, width, height);
      
      ctx.filter = activeFilter.cssFilter;
      ctx.drawImage(img, 0, 0, width, height);
      
      ctx.filter = 'none';
      if (activeFilter.overlayColor) {
        ctx.globalCompositeOperation = activeFilter.overlayBlend || 'source-over';
        ctx.fillStyle = activeFilter.overlayColor;
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
      }
    };
  }, [imageSrc, activeFilter]);

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full object-contain shadow-lg"
      />
    </div>
  );
});

export default React.memo(MainCanvas);
