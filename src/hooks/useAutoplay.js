import { useEffect, useRef, useState } from 'react';
import useReducedMotion from './useReducedMotion.js';

export default function useAutoplay({ ref, delay, onAdvance, resetKey, enabled = true }) {
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  const reduced = useReducedMotion();
  const advance = useRef(onAdvance);
  useEffect(() => { advance.current = onAdvance; }, [onAdvance]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: 0 });
    observer.observe(ref.current);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [ref]);
  const running = enabled && visible && pageVisible && !reduced;
  useEffect(() => {
    if (!running) return;
    let timer;
    let cancelled = false;
    const schedule = () => {
      timer = setTimeout(() => {
        advance.current();
        // Keep scheduling even when an advance is deferred by an interaction.
        // A state change restarts this clock through resetKey.
        if (!cancelled) schedule();
      }, delay);
    };
    schedule();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [running, delay, resetKey]);
  return running;
}
