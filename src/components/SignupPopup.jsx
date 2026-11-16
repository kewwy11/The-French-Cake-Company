import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import DisplayHeading from './DisplayHeading.jsx';
import ImageCycle from './ImageCycle.jsx';
import { RollingArrow, RollingLabel } from './ButtonMotion.jsx';
import { CTA_URL } from '../cta.js';
import './signup-popup.css';

const slides = [
  { src: '/assets/popup-confetti.png', alt: 'A sparkling pink celebration cake on a pedestal', loading: 'eager' },
  { src: '/assets/popup-cupcakes.png', alt: 'Cherry-topped cupcakes with colourful sprinkles', loading: 'eager' },
  { src: '/assets/popup-candles.png', alt: 'A blue and yellow celebration cake with candles', loading: 'eager' },
];

export default function SignupPopup({ ready }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  useEffect(() => {
    if (!ready) return;
    let timer;
    const show = () => {
      // Give the hero six seconds, and never interrupt another open overlay.
      if (document.hidden || document.querySelector('[aria-modal="true"], dialog[open]')) {
        timer = setTimeout(show, 250);
      } else setOpen(true);
    };
    timer = setTimeout(show, 6000);
    return () => clearTimeout(timer);
  }, [ready]);
  useLayoutEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const focus = document.activeElement;
    const x = scrollX, y = scrollY;
    const body = document.body.style;
    const saved = { position: body.position, top: body.top, left: body.left, right: body.right, width: body.width, overflow: body.overflow };
    const overflow = document.documentElement.style.overflow;
    Object.assign(body, { position: 'fixed', top: `${-y}px`, left: '0', right: '0', width: '100%', overflow: 'hidden' });
    document.documentElement.style.overflow = 'hidden';
    element.showModal();
    element.focus({ preventScroll: true });
    return () => {
      element.close();
      Object.assign(body, saved);
      document.documentElement.style.overflow = overflow;
      window.scrollTo({ left: x, top: y, behavior: 'instant' });
      if (focus?.isConnected) focus.focus({ preventScroll: true });
    };
  }, [open]);
  const keyboard = event => {
    if (event.key !== 'Tab') return;
    const items = [...dialog.current.querySelectorAll('button, input, a[href]')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  };
  if (!open) return null;
  return createPortal(<dialog ref={dialog} tabIndex={-1} className="signup-popup" aria-labelledby="signup-title" onKeyDown={keyboard} onCancel={event => { event.preventDefault(); setOpen(false); }} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
    <div className="signup-card">
      <ImageCycle slides={slides} className="signup-photos" />
      <div className="signup-content">
        <div className="signup-introduction">
          <header className="signup-header"><div><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/popup-dot-mobile.svg" /><img src="/assets/popup-dot-desktop.svg" alt="" /></picture><span>The French Cake Company</span></div><button type="button" className="signup-close" aria-label="Close email signup" onClick={() => setOpen(false)}><picture><source media="(max-width: 760px)" srcSet="/assets/popup-close-mobile.svg" /><img src="/assets/popup-close-desktop.svg" alt="" /></picture></button></header>
          <div className="signup-mobile-photos" aria-hidden="true" />
          <div className="signup-copy"><DisplayHeading name="popup" id="signup-title">The wow that you can eat</DisplayHeading><p>Join our sweet list for cake inspiration, new creations and little delights from The French Cake Company.</p></div>
        </div>
        <div className="signup-form-group"><form onSubmit={event => { event.preventDefault(); window.location.assign(CTA_URL); }}><label className="visually-hidden" htmlFor="signup-email">Enter your email address</label><input id="signup-email" name="email" type="email" autoComplete="email" required placeholder="Enter your email address" /><button type="submit" className="button button-light"><RollingLabel>Join the sweet list</RollingLabel><RollingArrow dark /></button></form><p>A little sweetness, never spam. Unsubscribe anytime.</p></div>
      </div>
    </div>
  </dialog>, document.body);
}
