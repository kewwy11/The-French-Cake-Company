import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import { CollectionLink } from './ButtonMotion.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';

const cakes = [
  { image: '/assets/best-seller-one.png', name: 'The Santorini cake' },
  { image: '/assets/best-seller-two.png', name: 'The orchid bloom' },
  { image: '/assets/best-seller-three.png', name: 'The cupcake garden' },
  { image: '/assets/best-seller-four.png', name: 'The atelier collection' },
  { image: '/assets/best-seller-five.webp', name: 'The cookie stack' },
];
export default function BestSellers({ items = cakes, id = 'best-sellers', eyebrow = 'Our best sellers', title = 'See what our customers are gushing over', headingName = 'bestsellers', mirror = false, initialIndex = 0 }) {
  const count = items.length;
  const slides = Array.from({ length: count * 3 }, (_, i) => items[i % count]);
  const [index, setIndex] = useState(initialIndex);
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [touched, setTouched] = useState(null);
  const revealed = hovered ?? focused ?? touched;
  const viewport = useRef(null);
  const track = useRef(null);
  const motion = useRef({ position: count + initialIndex, step: 0, alignment: 0, frame: 0, queue: [], moving: false });
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const state = motion.current;
    const measure = () => {
      cancelAnimationFrame(state.frame);
      state.moving = false;
      state.queue = [];
      state.position = count + ((state.position % count) + count) % count;
      const width = track.current.firstElementChild.getBoundingClientRect().width;
      state.step = width + parseFloat(getComputedStyle(track.current).gap);
      state.alignment = mirror ? Math.max(0, viewport.current.clientWidth - width) : 0;
      track.current.style.transform = `translate3d(${-state.position * state.step + state.alignment}px,0,0)`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    return () => { observer.disconnect(); cancelAnimationFrame(state.frame); };
  }, [count, mirror]);
  useEffect(() => {
    const clearTouch = event => {
      if (!viewport.current.contains(event.target)) setTouched(null);
    };
    document.addEventListener('pointerdown', clearTouch);
    return () => document.removeEventListener('pointerdown', clearTouch);
  }, []);
  const move = (direction) => {
    const state = motion.current;
    state.queue.push(direction);
    if (state.moving) return;
    const advance = () => {
      if (!state.queue.length || !track.current) return;
      state.moving = true;
      setHovered(null);
      setFocused(null);
      setTouched(null);
      const by = state.queue.shift();
      const keepFocus = track.current.contains(document.activeElement);
      const from = -state.position * state.step + state.alignment;
      const to = -(state.position + by) * state.step + state.alignment;
      const finish = () => {
        state.position = count + ((state.position + by) % count + count) % count;
        // Rebase to an identical copy at the same visible position.
        track.current.style.transform = `translate3d(${-state.position * state.step + state.alignment}px,0,0)`;
        setHovered(current => current === null ? null : count + current % count);
        setIndex(state.position % count);
        if (keepFocus) track.current.querySelector(`[data-slide="${state.position}"]`).focus({ preventScroll: true });
        state.moving = false;
        advance();
      };
      if (reduced) { finish(); return; }
      const started = performance.now();
      const resistance = .018;
      const damping = .72;
      const frequency = 12;
      const root = Math.sqrt(1 - damping * damping);
      const damped = frequency * root;
      // Finish at the second crossing: one overshoot and return, no oscillation.
      const settle = (2 * Math.PI - Math.atan(root / damping)) / damped;
      const tick = now => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
        const elapsed = (now - started) / 1000;
        let progress;
        if (elapsed < .085) {
          const t = elapsed / .085;
          progress = -resistance * t * t * (3 - 2 * t);
        } else {
          const t = elapsed - .085;
          if (t >= settle) { finish(); return; }
          const spring = 1 - Math.exp(-damping * frequency * t) * (Math.cos(damped * t) + damping / root * Math.sin(damped * t));
          progress = -resistance + (1 + resistance) * spring;
        }
        track.current.style.transform = `translate3d(${from + (to - from) * progress}px,0,0)`;
        state.frame = requestAnimationFrame(tick);
      };
      state.frame = requestAnimationFrame(tick);
    };
    advance();
  };
  const touch = useRef(null);
  return <section id={id} className={`best-sellers section-wrap${mirror ? ' newest-releases' : ''}`} aria-labelledby={`${id}-title`} aria-roledescription="carousel">
    <div className="best-sellers-intro"><div className="section-eyebrow"><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/about-marker-mobile.svg" /><img src="/assets/bestseller-marker.svg" alt="" /></picture>{eyebrow}</div><DisplayHeading id={`${id}-title`} name={headingName} mobileSrc={mirror ? `/assets/title-${headingName}-desktop.png` : undefined}>{title}</DisplayHeading>
      <div className="slider-controls"><button className="round-arrow arrow-back" onClick={() => move(-1)} aria-label="Previous cakes"><img src="/assets/icon-chevron.svg" alt="" /></button><button className="round-arrow" onClick={() => move(1)} aria-label="Next cakes"><img src="/assets/icon-chevron.svg" alt="" /></button></div>
    </div>
    <div className="best-sellers-viewport" ref={viewport} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
      touch.current = null;
    }}>
      <div className="best-sellers-track" ref={track}>{slides.map((cake, physicalIndex) => <article className={`best-card${physicalIndex === count + index ? ' is-main' : ''}${revealed === physicalIndex ? ' is-revealed' : ''}`} data-slide={physicalIndex} key={physicalIndex} tabIndex={physicalIndex === count + index ? 0 : -1} aria-hidden={physicalIndex < count || physicalIndex >= count * 2 ? true : undefined} aria-label={cake.name} onPointerEnter={event => { if (event.pointerType !== 'touch') { setHovered(physicalIndex); setFocused(null); setTouched(null); } }} onPointerLeave={() => setHovered(current => current === physicalIndex ? null : current)} onFocus={event => { if (event.target.matches(':focus-visible')) setFocused(physicalIndex); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(current => current === physicalIndex ? null : current); }} onPointerDown={event => { if (event.pointerType === 'touch' && !event.target.closest('a')) setTouched(current => current === physicalIndex ? null : physicalIndex); }}>
        <SiteImage src={cake.image} mobileSrc={cake.mobileImage} alt={cake.name} />
        <div className="best-card-details"><p>{cake.name}</p><CollectionLink name={cake.name} tabIndex={physicalIndex >= count && physicalIndex < count * 2 && (physicalIndex === count + index || revealed === physicalIndex) ? 0 : -1} /></div>
      </article>)}</div>
    </div>
    <span className="visually-hidden" role="status" aria-live="polite">Cake {index + 1} of {count}: {items[index].name}</span>
  </section>;
}
