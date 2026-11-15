import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RollingLabel } from './ButtonMotion.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import './circular-menu.css';

export const navigationLinks = [
  { label: 'Cakes', href: '#occasions', artwork: 'cakes' },
  { label: 'Custom Orders', href: '#cake-curator', artwork: 'custom' },
  { label: 'Cake Finder', href: '#cake-curator', artwork: 'finder' },
  { label: 'Our Story', href: '#our-story', artwork: 'story' },
];

export default function CircularMenu({ open, setOpen, trigger }) {
  const panel = useRef(null);
  const surface = useRef(null);
  const locked = useRef(null);
  const closing = useRef(0);
  const closeComplete = useRef(null);
  const pendingLink = useRef(null);
  const origin = useRef({ x: 32, y: 78 });
  const [circle, setCircle] = useState({ x: 32, y: 78, radius: 0 });
  const reduced = useReducedMotion();
  const unlock = () => {
    const saved = locked.current;
    if (!saved) return;
    Object.assign(document.body.style, saved.body);
    document.documentElement.style.overflow = saved.overflow;
    document.getElementById('root').inert = saved.inert;
    locked.current = null;
    window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
  };
  useLayoutEffect(() => {
    const measure = () => {
      const r = (trigger.current.querySelector('.menu-icon-stack') || trigger.current).getBoundingClientRect();
      const x = r.width ? r.left + r.width / 2 : Math.min(origin.current.x, innerWidth);
      const y = r.height ? r.top + r.height / 2 : Math.min(origin.current.y, innerHeight);
      origin.current = { x, y };
      const radius = Math.max(Math.hypot(x,y), Math.hypot(innerWidth-x,y), Math.hypot(x,innerHeight-y), Math.hypot(innerWidth-x,innerHeight-y)) + 2;
      panel.current.style.setProperty('--menu-x', `${x}px`);
      panel.current.style.setProperty('--menu-y', `${y}px`);
      panel.current.style.setProperty('--menu-radius', `${radius}px`);
      setCircle({ x, y, radius });
    };
    const resize = () => {
      surface.current.style.transition = 'none';
      measure();
      getComputedStyle(surface.current).clipPath;
      surface.current.style.removeProperty('transition');
    };
    clearTimeout(closing.current);
    let focusFrame = 0;
    if (open) {
      closeComplete.current = null;
      measure();
      if (!locked.current) {
        const body = document.body.style;
        locked.current = { x: scrollX, y: scrollY, body: { position: body.position, top: body.top, left: body.left, right: body.right, width: body.width, overflow: body.overflow }, overflow: document.documentElement.style.overflow, inert: document.getElementById('root').inert };
        Object.assign(body, { position: 'fixed', top: `${-scrollY}px`, left: '0', right: '0', width: '100%', overflow: 'hidden' });
        document.documentElement.style.overflow = 'hidden';
      }
      document.getElementById('root').inert = true;
      focusFrame = requestAnimationFrame(() => panel.current.focus({ preventScroll: true }));
      window.addEventListener('resize', resize);
      window.visualViewport?.addEventListener('resize', resize);
    } else if (locked.current) {
      document.getElementById('root').inert = locked.current.inert;
      if (!pendingLink.current) trigger.current?.focus({ preventScroll: true });
      const finish = () => {
        if (!locked.current) return;
        clearTimeout(closing.current);
        unlock();
        if (pendingLink.current) {
          const href = pendingLink.current;
          pendingLink.current = null;
          history.pushState(null, '', href);
          document.querySelector(href)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
        }
      };
      closeComplete.current = finish;
      closing.current = setTimeout(finish, reduced ? 0 : 850);
    }
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
    };
  }, [open, reduced, trigger]);
  useLayoutEffect(() => () => { clearTimeout(closing.current); unlock(); }, []);
  const keyboard = event => {
    if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
    if (event.key !== 'Tab') return;
    const items = [...panel.current.querySelectorAll('button:not([tabindex="-1"]), a[href]')];
    if (event.shiftKey && (document.activeElement === items[0] || document.activeElement === panel.current)) {
      event.preventDefault(); items.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
      event.preventDefault(); items[0].focus();
    }
  };
  return createPortal(<div ref={panel} id="main-menu" className={`circular-menu-shell${open ? ' is-open' : ''}`} role="dialog" aria-modal={open ? 'true' : undefined} aria-label="Main navigation" aria-hidden={!open} inert={!open} tabIndex={-1} onKeyDown={keyboard}
    style={{ '--menu-x': `${circle.x}px`, '--menu-y': `${circle.y}px`, '--menu-radius': `${circle.radius}px` }}>
    <div ref={surface} className={`circular-menu${open ? ' is-open' : ''}`} onTransitionEnd={event => { if (!open && event.target === event.currentTarget && event.propertyName === 'clip-path') closeComplete.current?.(); }}>
    <nav className="circular-menu-links" aria-label="Main menu">{navigationLinks.map(({ label, href, artwork }, index) => <a href={href} key={href + artwork} onClick={event => { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); pendingLink.current = href; setOpen(false); }} style={{ '--menu-link-order': index }}>
      <span className="visually-hidden">{label}</span><span className="menu-link-mask" aria-hidden="true"><span className="menu-link-entry"><RollingLabel className="menu-link-label"><img src={`/assets/nav-${artwork}.png`} alt="" /></RollingLabel></span></span>
    </a>)}</nav></div>
    <button type="button" className="menu-close" aria-label="Close menu" onClick={() => setOpen(false)}><img src="/assets/menu-close.svg" alt="" /></button>
    <button type="button" tabIndex={-1} aria-hidden="true" className="menu-origin-toggle" onClick={() => setOpen(false)}><img className="origin-menu-glyph" src="/assets/mobile-menu.svg" alt="" /><img className="origin-close-glyph" src="/assets/menu-close.svg" alt="" /></button>
  </div>, document.body);
}
