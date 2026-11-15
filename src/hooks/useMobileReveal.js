import { useCallback, useEffect, useRef, useState } from 'react';

// Pick one main card and start its clock once, rather than restarting the
// delay at every intersection threshold while the visitor scrolls.
export default function useMobileReveal(container, { selector, resetKey, enabled = true, delay = 1000 }) {
  const [active, setActive] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const state = useRef({ candidate: null, blocked: null, timer: 0 });
  const dismiss = useCallback(() => {
    clearTimeout(state.current.timer);
    state.current.blocked = state.current.candidate;
    setActive(null);
  }, []);
  useEffect(() => {
    const mobile = matchMedia('(max-width: 760px)');
    const record = state.current;
    let frame = 0, disposed = false;
    record.candidate = null;
    record.blocked = null;
    setActive(null);
    const measure = () => {
      frame = 0;
      let next = null, distance = Infinity;
      if (enabled && mobile.matches && !document.hidden) {
        const bounds = container.current.getBoundingClientRect();
        container.current.querySelectorAll(selector).forEach(card => {
          const r = card.getBoundingClientRect();
          const width = Math.max(0, Math.min(r.right, bounds.right, innerWidth) - Math.max(r.left, bounds.left, 0));
          const height = Math.max(0, Math.min(r.bottom, bounds.bottom, innerHeight) - Math.max(r.top, bounds.top, 0));
          const visible = width * height / (r.width * r.height);
          const fromCenter = Math.abs(r.top + r.height / 2 - innerHeight / 2);
          if (visible >= .55 && fromCenter < distance) { next = card; distance = fromCenter; }
        });
      }
      if (record.candidate === next) return;
      clearTimeout(record.timer);
      record.candidate = next;
      setCandidate(next);
      record.blocked = null;
      setActive(null);
      if (next) record.timer = setTimeout(() => {
        if (!disposed && record.candidate === next && record.blocked !== next) setActive(next);
      }, delay);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    const resize = new ResizeObserver(schedule);
    resize.observe(container.current);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    mobile.addEventListener('change', schedule);
    return () => {
      disposed = true;
      clearTimeout(record.timer);
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      mobile.removeEventListener('change', schedule);
    };
  }, [container, selector, resetKey, enabled, delay]);
  return { active, candidate, dismiss };
}
