import React from 'react';

export default function SiteImage({ src, mobileSrc, alt = '', className = '', position, loading = 'lazy' }) {
  return <div className={'site-image ' + className} style={position ? { '--image-position': position } : undefined}>
    <picture>
      {mobileSrc && <source media="(max-width: 760px)" srcSet={mobileSrc} />}
      <img src={src} alt={alt} loading={loading} />
    </picture>
  </div>;
}
