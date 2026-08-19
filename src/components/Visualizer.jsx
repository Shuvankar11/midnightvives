import React, { useEffect, useRef } from 'react';

export default function Visualizer({ analyser, isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas resizing
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Buffer for analyser data
    const bufferLength = analyser ? analyser.frequencyBinCount : 64;
    const dataArray = new Uint8Array(bufferLength);

    // Animation variables
    let phase = 0;

    // Render loop
    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear with transparency for visual trail effect
      ctx.fillStyle = 'rgba(18, 18, 18, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const hasActiveContext = analyser && isPlaying;

      if (hasActiveContext) {
        analyser.getByteFrequencyData(dataArray);

        const barCount = dataArray.length;
        const barWidth = (width / barCount) * 1.5;
        let x = 0;

        for (let i = 0; i < barCount; i++) {
          const percent = dataArray[i] / 255;
          const barHeight = percent * height * 0.8;

          // Electric green theme matching Spotify look
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#1db954'); // Spotify Green
          gradient.addColorStop(0.6, '#1ed760'); // Lighter Green
          gradient.addColorStop(1, '#a7f3d0'); // Emerald tint

          ctx.fillStyle = gradient;
          
          // Draw bar
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight - 2, barWidth - 4, barHeight + 2, [3, 3, 0, 0]);
          ctx.fill();

          // White cap on top for premium visual appeal
          if (barHeight > 5) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, height - barHeight - 3, barWidth - 4, 1.5);
          }

          x += barWidth;
        }
      } else {
        // Calm dual-sine wave when paused
        phase += 0.04;
        ctx.strokeStyle = 'rgba(29, 185, 84, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        const points = 80;
        const sliceWidth = width / points;
        let x = 0;

        for (let i = 0; i < points; i++) {
          const y = height / 2 + Math.sin(x * 0.02 + phase) * 10 * Math.sin(x * 0.005);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();

        // Secondary subtle wave
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < points; i++) {
          const y = height / 2 + Math.cos(x * 0.015 - phase * 0.7) * 6 * Math.sin(x * 0.008);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      id="visualizer-canvas"
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'block',
        borderRadius: '6px'
      }} 
    />
  );
}
