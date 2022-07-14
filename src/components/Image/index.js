import React, { useState } from 'react';

export default function Image({ src, fallbackSrc, ...others }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={!error || !fallbackSrc ? src : fallbackSrc}
      onError={() => setError(true)}
      {...others}
    />
  );
}

