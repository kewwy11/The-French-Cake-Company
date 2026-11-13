import { useCallback, useRef, useState } from 'react';
import { HERO_INTERVAL } from '../hero-slides.js';
import useAutoplay from './useAutoplay.js';

export default function useImageCycle(count, enabled = true) {
  const ref = useRef(null);
  const [{ active, previous }, setSlide] = useState({ active: 0, previous: null });
  const selectSlide = useCallback(index => setSlide(current => current.active === index ? current : { active: index, previous: current.active }), []);
  const running = useAutoplay({ ref, delay: HERO_INTERVAL, enabled, resetKey: active, onAdvance: () => setSlide(current => ({ active: (current.active + 1) % count, previous: current.active })) });
  return { ref, active, previous, selectSlide, running };
}
