import SiteImage from './SiteImage.jsx';
import useImageCycle from '../hooks/useImageCycle.js';

export default function ImageCycle({ slides, className = '' }) {
  const { ref, active, previous, running } = useImageCycle(slides.length);
  return <div ref={ref} className={`image-cycle ${className}${running ? '' : ' is-cycle-paused'}`} aria-label="Creations from our atelier">
    {slides.map((slide, index) => <div key={slide.src} className={`image-cycle-layer${index === active ? ' is-active' : ''}${index === previous ? ' is-previous' : ''}`} aria-hidden={index !== active}>
      <SiteImage {...slide} className="image-cycle-photo" />
    </div>)}
  </div>;
}
