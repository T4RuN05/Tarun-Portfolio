import React, { useRef, useEffect } from 'react';
import { useTheme } from "next-themes";

const AsciiBlackHole = ({ imageUrl }) => {
  const canvasRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Alpha: false optimizes performance for solid backgrounds
    const ctx = canvas.getContext('2d', { alpha: false }); 
    
    let animationFrameId = null;
    let isVisible = true;
    let imgData = null;
    let cols = 0;
    let rows = 0;
    
    const CELL_SIZE = 6; // High density
    // Ordered by visual density, strictly using code/cyber symbols
    const CHARS = " .,-'`:;~^+!=*?()[]{}<>\\/|&#%@";
    
    // State for optimization and trailing effects
    let baseCanvas = null;
    let cellData = [];
    let heatmap = new Float32Array(0);
    let activeCells = new Set();
    
    const mouse = { x: -1000, y: -1000 };
    
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      activateCellsAroundMouse();
    };
    
    const activateCellsAroundMouse = () => {
      const radius = 50; // Interaction radius (decreased for tighter proximity)
      const centerCol = Math.floor(mouse.x / CELL_SIZE);
      const centerRow = Math.floor(mouse.y / CELL_SIZE);
      const cellRadius = Math.ceil(radius / CELL_SIZE);
      
      for (let r = -cellRadius; r <= cellRadius; r++) {
        for (let c = -cellRadius; c <= cellRadius; c++) {
          const dist = Math.sqrt(c*c + r*r);
          if (dist <= cellRadius) {
            const col = centerCol + c;
            const row = centerRow + r;
            if (col >= 0 && col < cols && row >= 0 && row < rows) {
              const idx = row * cols + col;
              // Heat is highest in center, fading to edges
              const heat = 1.0 - (dist / cellRadius);
              heatmap[idx] = Math.max(heatmap[idx] || 0, heat);
              activeCells.add(idx);
            }
          }
        }
      }
      
      if (activeCells.size > 0 && isVisible && !animationFrameId) {
        render(); // Wake up loop
      }
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && activeCells.size > 0 && !animationFrameId && baseCanvas) {
        render();
      } else if (!isVisible && animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }, { threshold: 0.01 });
    observer.observe(canvas.parentElement);

    const image = new Image();
    image.src = imageUrl;
    
    const init = () => {
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;
      
      cols = Math.floor(width / CELL_SIZE);
      rows = Math.floor(height / CELL_SIZE);

      // Prevent crash if container is hidden or too small to render cells
      if (width === 0 || height === 0 || cols === 0 || rows === 0) return;
      
      const dpr = Math.min(window.devicePixelRatio || 1, 2); 
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      canvas.logicalWidth = width;
      canvas.logicalHeight = height;

      cellData = new Array(cols * rows);
      heatmap = new Float32Array(cols * rows);
      activeCells.clear();

      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = cols;
      hiddenCanvas.height = rows;
      const hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
      
      const imgRatio = image.width / image.height;
      const canvasRatio = cols / rows;
      
      let drawWidth = cols;
      let drawHeight = rows;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > canvasRatio) {
        drawWidth = rows * imgRatio;
        offsetX = (cols - drawWidth) / 2;
      } else {
        drawHeight = cols / imgRatio;
        offsetY = (rows - drawHeight) / 2;
      }
      
      hiddenCtx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      imgData = hiddenCtx.getImageData(0, 0, cols, rows).data;
      
      // PRE-RENDER PASS: Draw the static background once
      baseCanvas = document.createElement('canvas');
      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;
      const baseCtx = baseCanvas.getContext('2d', { alpha: false });
      baseCtx.scale(dpr, dpr);
      
      baseCtx.fillStyle = isLight ? '#ffffff' : '#030303';
      baseCtx.fillRect(0, 0, width, height);
      baseCtx.font = `bold ${CELL_SIZE}px monospace`;
      baseCtx.textAlign = 'center';
      baseCtx.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const imgIdx = idx * 4;
          
          const r = imgData[imgIdx];
          const g = imgData[imgIdx + 1];
          const b = imgData[imgIdx + 2];
          
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          let activeBrightness = brightness;
          let activeR = r;
          let activeG = g;
          let activeB = b;
          
          const posX = x * CELL_SIZE + CELL_SIZE / 2;
          const posY = y * CELL_SIZE + CELL_SIZE / 2;
          
          const normalizedX = x / cols;
          const normalizedY = y / rows;

          // Organic Mathematical Mask (Continuous Weight 0.0 to 1.0)
          // Instead of hard cuts, we calculate a smooth opacity mask for the accretion disk
          let diskWeight = 0.0;
          if (normalizedX > 0.5) {
              // Right side ellipse
              const dx = (normalizedX - 0.75) / 0.35;
              const dy = (normalizedY - 0.5) / 0.45;
              const distSq = dx * dx + dy * dy;
              if (distSq <= 1.0) {
                  // Smooth bell-curve fade from center to the ellipse boundary
                  diskWeight = 1.0 - Math.pow(distSq, 1.5);
              }
          } else {
              // Left side diagonal arm
              // Shifted the mathematical centerline down slightly (+0.02) to pull the top edge away from stray pixels
              const expectedY = 0.52 - 0.64 * (normalizedX - 0.5);
              
              // Thinned the core even more to ensure absolute tightness
              const thickness = 0.05 + (normalizedX * 0.10); 
              const dy = Math.abs(normalizedY - expectedY);
              
              if (dy < thickness) {
                  // Smooth radial fade outward from the centerline of the arm
                  const radialFade = 1.0 - Math.pow(dy / thickness, 1.5);
                  
                  // Smooth horizontal fade at the tip (x=0.25 fading to 0 at x=0.08)
                  let tipFade = 1.0;
                  if (normalizedX < 0.25) {
                      tipFade = Math.max(0, (normalizedX - 0.08) / 0.17);
                      tipFade = Math.pow(tipFade, 1.5); // easing
                  }
                  
                  diskWeight = radialFade * tipFade;
              }
          }

          // Hard kill for true void (to prevent pure 0,0,0 from blowing up)
          if (brightness < 0.025) {
             cellData[idx] = { r: 0, g: 0, b: 0, brightness: 0, char: ' ', posX, posY };
             continue;
          }
          
          // Smooth Targeted Shadow Lift
          // The boost amount is scaled by the continuous diskWeight
          if (diskWeight > 0 && brightness < 0.15) {
             let maxBoost = 0.25; 
             
             // The left arm gets a much heavier max boost
             if (normalizedX < 0.5) {
                 const leftBoost = 1 - (normalizedX / 0.5); 
                 maxBoost = 0.25 + (leftBoost * 0.65); 
             }
             
             // Apply the organically fading boost
             const appliedBoost = maxBoost * diskWeight;
             activeBrightness = Math.min(1.0, activeBrightness + appliedBoost);
             
             // Scale up the true RGB values
             if (brightness > 0) {
                 const scale = activeBrightness / Math.max(0.015, brightness);
                 activeR = Math.min(255, Math.floor(r * scale));
                 activeG = Math.min(255, Math.floor(g * scale));
                 activeB = Math.min(255, Math.floor(b * scale));
             }
          }

          // Deep Void Cleaner
          // If a pixel is completely outside the accretion disk mask, aggressively kill it
          // unless it is a genuinely bright star (> 15% brightness). This removes stray dust.
          if (diskWeight === 0 && activeBrightness < 0.15) {
             cellData[idx] = { r: 0, g: 0, b: 0, brightness: 0, char: ' ', posX, posY };
             continue;
          }

          // Organic Void Killer
          // Because 'appliedBoost' fades smoothly to 0 at the edges of the shape, 
          // 'activeBrightness' organically dips below 0.025, creating a beautiful dithered fade out!
          if (activeBrightness < 0.025) {
             cellData[idx] = { r: 0, g: 0, b: 0, brightness: 0, char: ' ', posX, posY };
             continue;
          }
          
          // To prevent uniform repeating characters and create a true cyber effect,
          // we map the brightness to a base index, then pick randomly from a "window"
          // of nearby characters using a stable spatial hash.
          const baseCharIndex = Math.floor(activeBrightness * (CHARS.length - 1));
          const hashChar = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const randomCharOffset = Math.floor((hashChar - Math.floor(hashChar)) * 7) - 3; // Mix of 7 nearby symbols
          
          let charIndex = Math.max(0, Math.min(CHARS.length - 1, baseCharIndex + randomCharOffset));
          const char = CHARS[charIndex];
          
          // Save cell data for rapid access in the render loop
          cellData[idx] = { r: activeR, g: activeG, b: activeB, brightness: activeBrightness, char, posX, posY };
          
          let baseR, baseG, baseB, baseAlpha;
          if (isLight) {
              // Light mode: High brightness = dark ink. Low brightness = fades into white canvas.
              baseR = Math.floor(240 - activeBrightness * 200);
              baseG = Math.floor(245 - activeBrightness * 200);
              baseB = Math.floor(255 - activeBrightness * 200);
              baseAlpha = Math.max(0, activeBrightness * 1.5); 
          } else {
              // Dark mode: High brightness = bright text. Low brightness = fades into black canvas.
              baseR = Math.floor(activeBrightness * 120 + 30);
              baseG = Math.floor(activeBrightness * 125 + 30);
              baseB = Math.floor(activeBrightness * 135 + 40);
              baseAlpha = 0.3 + (activeBrightness * 0.4); 
          }
          
          baseCtx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${baseAlpha})`;
          baseCtx.fillText(char, posX, posY);
        }
      }
    };

    image.onload = () => {
      init();
      window.addEventListener('resize', init);
      render();
    };

    const render = () => {
      if (!baseCanvas) {
         if (isVisible) animationFrameId = requestAnimationFrame(render);
         else animationFrameId = null;
         return;
      }

      // 1. O(1) Background Clear: Stamp the pre-rendered canvas
      ctx.drawImage(baseCanvas, 0, 0, canvas.logicalWidth, canvas.logicalHeight);
      
      ctx.font = `bold ${CELL_SIZE}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 2. O(N) Active Cell Rendering: Only process cells in the heat trail
      for (const idx of activeCells) {
        let heat = heatmap[idx];
        
        // Decay rate (0.92 gives a beautiful long comet tail, 0.8 is short)
        heat *= 0.92; 
        
        if (heat < 0.02) {
          heatmap[idx] = 0;
          activeCells.delete(idx);
          continue; // The base canvas already has the default state for this cell
        }
        
        heatmap[idx] = heat;
        
        const cell = cellData[idx];
        if (cell.brightness < 0.05) continue; 
        
        // Clear the space so we can draw over the base canvas
        ctx.fillStyle = isLight ? '#ffffff' : '#030303';
        ctx.fillRect(cell.posX - CELL_SIZE/2, cell.posY - CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
        
        // Spatial hash to determine solid block glitch effect
        const hash = Math.sin(cell.posX * 12.9898 + cell.posY * 78.233) * 43758.5453;
        const randomVal = hash - Math.floor(hash);
        
        // High heat = very high chance to turn into a solid block
        const isActivated = randomVal > (1 - heat * 0.8);
        
        if (isActivated) {
          // Solid background block in true color
          ctx.fillStyle = `rgba(${cell.r}, ${cell.g}, ${cell.b}, ${Math.min(1, heat * 1.5)})`;
          ctx.fillRect(cell.posX - CELL_SIZE/2, cell.posY - CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
          
          // Inverted text
          ctx.fillStyle = '#030303';
          ctx.fillText(cell.char, cell.posX, cell.posY);
        } else {
          // Calculate the metallic base color to interpolate from
          let baseR, baseG, baseB, baseAlpha;
          if (isLight) {
              baseR = Math.floor(240 - cell.brightness * 200);
              baseG = Math.floor(245 - cell.brightness * 200);
              baseB = Math.floor(255 - cell.brightness * 200);
              baseAlpha = Math.max(0, cell.brightness * 1.5);
          } else {
              baseR = Math.floor(cell.brightness * 120 + 30);
              baseG = Math.floor(cell.brightness * 125 + 30);
              baseB = Math.floor(cell.brightness * 135 + 40);
              baseAlpha = 0.3 + (cell.brightness * 0.4);
          }

          // Interpolate color from metallic grey to true color based on heat
          const blend = Math.min(1, heat * 1.2); 
          const curR = Math.floor(baseR + (cell.r - baseR) * blend);
          const curG = Math.floor(baseG + (cell.g - baseG) * blend);
          const curB = Math.floor(baseB + (cell.b - baseB) * blend);
          const curAlpha = baseAlpha + (1 - baseAlpha) * blend;

          ctx.fillStyle = `rgba(${curR}, ${curG}, ${curB}, ${curAlpha})`;
          ctx.fillText(cell.char, cell.posX, cell.posY);
        }
      }

      if (activeCells.size > 0 || (activeCells.size === 0 && animationFrameId !== null)) {
         // If size is 0, we do one last render to clear the final decayed cells, then sleep
         const shouldSleepNext = activeCells.size === 0;
         
         if (isVisible && !shouldSleepNext) {
            animationFrameId = requestAnimationFrame(render);
         } else {
            animationFrameId = null;
         }
      } else {
         animationFrameId = null;
      }
    };

    return () => {
      window.removeEventListener('resize', init);
      observer.disconnect();
      if (canvas) {
          canvas.removeEventListener('mousemove', handleMouseMove);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [imageUrl, isLight]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white dark:bg-[#030303] pointer-events-auto">
      <canvas ref={canvasRef} className="block w-full h-full touch-none" />
    </div>
  );
};

export default AsciiBlackHole;
