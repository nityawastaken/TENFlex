import React, { useState } from 'react';

function GigImage({ image }) {
  const [show, setShow] = useState(true);
  if (!image || !show) return null;
  return (
    <img
      className="gig-image bg-gradient-to-br from-[#2a1e54] via-[#1a0d2b] to-[#3a1e4f]"
      src={image}
      alt="Gig visual"
      style={{ maxHeight: '350px', width: '100%', objectFit: 'contain',  }}
      onError={() => setShow(false)}
    />
  );
}

export default GigImage;