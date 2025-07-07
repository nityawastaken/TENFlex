import React, { useState } from 'react';

function GigImage({ image }) {
  const [show, setShow] = useState(true);
  if (!image || !show) return null;
  return (
    <img
      className="gig-image"
      src={image}
      alt="Gig visual"
      style={{ maxHeight: '350px', width: '100%', objectFit: 'contain', background: '#181818' }}
      onError={() => setShow(false)}
    />
  );
}

export default GigImage;