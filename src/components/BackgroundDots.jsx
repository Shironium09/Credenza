import { useEffect, useRef, useCallback } from "react";

function BackgroundDots() {

  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef(null);

  const DOT_SPACING = 28;
  const DOT_BASE_RADIUS = 1;
  const DOT_BASE_OPACITY = 0.15;
  const GLOW_RADIUS = 140;
  const GLOW_COLOR = { r: 168, g: 85, b: 247 };

  const handleMouseMove = useCallback((e) => {

    mouseRef.current = { x: e.clientX, y: e.clientY };

  }, []);

  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

    };

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {

      const { width, height } = canvas;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const startX = DOT_SPACING / 2;
      const startY = DOT_SPACING / 2;

      for (let x = startX; x < width; x += DOT_SPACING) {

        for (let y = startY; y < height; y += DOT_SPACING) {

          const dx = x - mx;
          const dy = y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let radius = DOT_BASE_RADIUS;
          let opacity = DOT_BASE_OPACITY;
          let glowSize = 0;

          if (dist < GLOW_RADIUS) {

            const intensity = 1 - dist / GLOW_RADIUS;
            const easedIntensity = intensity * intensity;

            radius = DOT_BASE_RADIUS + easedIntensity * 2;
            opacity = DOT_BASE_OPACITY + easedIntensity * 0.85;
            glowSize = easedIntensity * 12;

          }

          if (glowSize > 0) {

            ctx.shadowBlur = glowSize;
            ctx.shadowColor = `rgba(${GLOW_COLOR.r}, ${GLOW_COLOR.g}, ${GLOW_COLOR.b}, ${opacity})`;

          } else {

            ctx.shadowBlur = 0;
            ctx.shadowColor = "transparent";

          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GLOW_COLOR.r}, ${GLOW_COLOR.g}, ${GLOW_COLOR.b}, ${opacity})`;
          ctx.fill();

        }

      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      animFrameRef.current = requestAnimationFrame(draw);

    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {

      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    };

  }, [handleMouseMove]);

  return (

    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />

  );

}

export default BackgroundDots;
