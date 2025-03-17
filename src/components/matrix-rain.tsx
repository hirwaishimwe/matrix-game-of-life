"use client";

import { useEffect, useState } from "react";

interface RainDrop {
  id: number;
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  fontSize: number;
  delay: number;
  glowIntensity: number;
}

export function MatrixRain() {
  const [raindrops, setRaindrops] = useState<RainDrop[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side rendering to avoid hydration mismatch
    setIsClient(true);

    // Create matrix characters (Japanese Katakana and other symbols)
    const matrixChars = Array.from({ length: 150 }, () => {
      // Mix of Katakana, binary, and special characters for Matrix effect
      const charType = Math.random();
      if (charType < 0.7) {
        // Katakana characters
        return String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
      } else if (charType < 0.85) {
        // Binary (0 and 1)
        return Math.random() < 0.5 ? "0" : "1";
      } else {
        // Special characters that look 'digital'
        const specialChars = ['$', '%', '#', '@', '&', '+', '*', '/', '=', '>'];
        return specialChars[Math.floor(Math.random() * specialChars.length)];
      }
    });

    // Create more raindrops for a denser effect
    const initialRaindrops = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percent
      y: Math.random() * 10 - 10, // start above the viewport
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      speed: 0.5 + Math.random() * 2.0, // varied speeds
      opacity: 0.1 + Math.random() * 0.6, // varied opacity
      fontSize: 10 + Math.floor(Math.random() * 8), // varied font sizes
      delay: Math.random() * 5,
      glowIntensity: 0.3 + Math.random() * 0.7, // varied glow intensity
    }));

    setRaindrops(initialRaindrops);

    // Animation loop
    let animationFrameId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      if (lastTime === 0) {
        lastTime = time;
      }
      const deltaTime = time - lastTime;
      lastTime = time;

      // Update raindrops
      setRaindrops((prevRaindrops) =>
        prevRaindrops.map((drop) => {
          // Only start moving after delay
          if (drop.delay > 0) {
            return {
              ...drop,
              delay: drop.delay - deltaTime / 1000,
            };
          }

          // Move raindrop down
          const newY = drop.y + (drop.speed * deltaTime) / 50;

          // If raindrop is out of viewport, reset it at the top with new properties
          if (newY > 110) {
            return {
              ...drop,
              y: -10,
              x: Math.random() * 100,
              char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
              speed: 0.5 + Math.random() * 2.0,
              opacity: 0.1 + Math.random() * 0.6,
              fontSize: 10 + Math.floor(Math.random() * 8),
              delay: Math.random() * 2,
              glowIntensity: 0.3 + Math.random() * 0.7,
            };
          }

          // Occasionally change the character for digital effect
          const newChar =
            Math.random() < 0.02
              ? matrixChars[Math.floor(Math.random() * matrixChars.length)]
              : drop.char;

          // Occasionally change the glow intensity for pulsing effect
          const newGlowIntensity =
            Math.random() < 0.05
              ? 0.3 + Math.random() * 0.7
              : drop.glowIntensity;

          return {
            ...drop,
            y: newY,
            char: newChar,
            glowIntensity: newGlowIntensity,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    // Only start animation on client side
    if (isClient) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isClient]);

  // Return nothing during server-side rendering to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="absolute font-mono"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
            opacity: drop.delay <= 0 ? drop.opacity : 0,
            fontSize: `${drop.fontSize}px`,
            color: `rgba(0, ${Math.floor(200 * drop.glowIntensity)}, 0, ${drop.opacity})`,
            textShadow: `0 0 ${3 + Math.floor(5 * drop.glowIntensity)}px rgba(0, 255, 0, ${0.5 * drop.glowIntensity})`,
            fontWeight: "bold",
            transform: "scaleY(1.2)",
          }}
        >
          {drop.char}
        </div>
      ))}
    </div>
  );
}
