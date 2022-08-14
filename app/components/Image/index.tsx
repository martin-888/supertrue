import React, { useState } from 'react';

type ImageProps = Partial<HTMLImageElement> & {
  src: string;
  fallbackSrc: string;
}

export default function Image({ src, fallbackSrc, ...others }: ImageProps) {
  const [error, setError] = useState(false);

  return (
    <img
      src={!error || !fallbackSrc ? src : fallbackSrc}
      onError={() => setError(true)}
      {...others}
    />
  );
}

