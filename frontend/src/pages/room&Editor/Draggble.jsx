/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import Draggable from "react-draggable";

 function DraggableWrapper({ children, handle, bounds, defaultPosition }) {
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState(defaultPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false); // Declare isDragging state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest(handle)) {
      setIsDragging(true); // Set isDragging to true when dragging starts
    }
  }, [handle]);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        e.preventDefault();
        setPosition((prev) => ({
          x: prev.x + e.movementX,
          y: prev.y + e.movementY,
        }));
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false); // Set isDragging to false when dragging stops
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  const onDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <Draggable
      handle={handle}
      bounds={bounds}
      position={position}  // Controlled position for Draggable
      onDrag={onDrag}  // Update position on drag
    >
      <div
        style={{
          cursor: "grab",  // Default cursor style
        }}
      >
        {children}
      </div>
    </Draggable>
  );
}

export default DraggableWrapper