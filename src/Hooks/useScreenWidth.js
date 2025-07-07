"use client";

import { useState, useEffect } from 'react';

export default function useScreenWidth() {
  const [width, setWidth] = useState(0); // Start with 0 or undefined

  useEffect(() => {
    // This code runs only on the client
    const handleResize = () => setWidth(window.innerWidth);

    handleResize(); // Set initial width after mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}
