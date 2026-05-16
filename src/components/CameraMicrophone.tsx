import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

const CameraMicrophone: React.FC = () => {
  const { isCameraOn, videoRef } = useApp();

  const containerRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({
    x: window.innerWidth - 340,
    y: 20,
  });

  const [isDragging, setIsDragging] = useState(false);

  const dragData = useRef({
    offsetX: 0,
    offsetY: 0,
  });

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    setIsDragging(true);

    const rect = containerRef.current.getBoundingClientRect();

    dragData.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  };

  // Mouse Move
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragData.current.offsetX;
    const newY = e.clientY - dragData.current.offsetY;

    // Prevent outside viewport
    const maxX = window.innerWidth - 350;
    const maxY = window.innerHeight - 250;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  // Mouse Up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      className={`inset-0
        fixed
        z-50
        w-[320px]
        select-none
        ${isCameraOn ? "block" : "hidden"}
      `}
    >
      {/* Drag Header */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-4 py-2 text-sm font-medium text-white bg-gray-900 cursor-move rounded-t-2xl"
      >
        <div className="flex items-center w-full gap-2">
      
          {/* Drag Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 9h.01M8 15h.01M12 9h.01M12 15h.01M16 9h.01M16 15h.01"
            />
          </svg>

          <span>Camera Preview</span>

          {/* Helper Text */}
          <span className="text-[10px] text-gray-400 ml-auto">
            Drag to move
          </span>
        </div>
      </div> 

      {/* Video */}
      <div
        className="overflow-hidden border rounded-b shadow-2xl bg-black/90 backdrop-blur-lg"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="
            w-full
            h-auto
            max-h-[240px]
            object-cover
          "
        />
      </div>
    </div>
  );
};

export default CameraMicrophone;