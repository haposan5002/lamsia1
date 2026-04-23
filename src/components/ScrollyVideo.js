'use client';
import { useEffect, useRef, useState } from 'react';

export default function ScrollyVideo({ scrollYProgress }) {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const frameCount = 100;

  useEffect(() => {
    let isCancelled = false;
    
    // Preload images sequentially to avoid slamming the Next.js dev server
    const loadImages = async () => {
      const loadedImages = new Array(frameCount).fill(null);
      
      for (let i = 0; i < frameCount; i++) {
        if (isCancelled) break;
        
        const img = new Image();
        const paddedIndex = i.toString().padStart(4, '0');
        
        // Wait for the image to load before requesting the next one
        await new Promise((resolve) => {
          img.onload = () => {
            if (i === 0 && canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            resolve();
          };
          img.onerror = resolve; // continue if error
          img.src = `/sequence/frame_${paddedIndex}.jpg`;
        });
        
        loadedImages[i] = img;
        
        // Update state progressively every 10 frames or on the first frame
        if (i === 0 || (i + 1) % 10 === 0 || i === frameCount - 1) {
          setImages([...loadedImages]);
        }
      }
    };

    loadImages();
    
    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || images.length === 0) return;

    const ctx = canvasRef.current.getContext('2d');

    const render = (latest) => {
      // Calculate which frame to show based on scroll progress (0 to 1)
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(latest * frameCount)
      );

      const img = images[frameIndex];
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };

    // Initial render
    render(scrollYProgress.get());

    // Subscribe to scroll changes
    const unsubscribe = scrollYProgress.on('change', render);

    return () => unsubscribe();
  }, [scrollYProgress, images]);

  return (
    <canvas
      ref={canvasRef}
      className="scrolly-canvas"
      width={1920}
      height={1080}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
    />
  );
}
