import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import { CollectionLink } from './ButtonMotion.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import useMobileReveal from '../hooks/useMobileReveal.js';

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
  const [moving, setMoving] = useState(false);
  const viewport = useRef(null);
  const track = useRef(null);
  const motion = useRef({ position: count + initialIndex, step: 0, alignment: 0, frame: 0, queue: [], moving: false, dragging: false, from: null, velocity: 0, direction: 0 });
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const automatic = useMobileReveal(viewport, { selector: '.best-card.is-main', resetKey: index, enabled: !moving });
  const revealed = moving ? null : hovered ?? focused ?? touched ?? (automatic.active ? Number(automatic.active.dataset.slide) : null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const state = motion.current;
    const measure = () => {
      const width = track.current.firstElementChild.getBoundingClientRect().width;
      const step = width + parseFloat(getComputedStyle(track.current).gap);
      const alignment = mirror && !matchMedia('(max-width: 760px)').matches ? Math.max(0, viewport.current.clientWidth - width) : 0;
      if (Math.abs(state.step - step) < .1 && Math.abs(state.alignment - alignment) < .1) return;
      cancelAnimationFrame(state.frame);
      state.position += state.moving ? state.direction : 0;
      state.moving = false;
      state.dragging = false;
      state.from = null;
      gesture.current = null;
      state.queue = [];
      setMoving(false);
      state.position = count + ((state.position % count) + count) % count;
      state.step = step;
      state.alignment = alignment;
      setIndex(state.position % count);
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
      setMoving(true);
      setHovered(null);
      setFocused(null);
      setTouched(null);
      automatic.dismiss();
      const by = state.queue.shift();
      state.direction = by;
      const keepFocus = track.current.contains(document.activeElement) && document.activeElement.matches(':focus-visible');
      const dragged = state.from !== null;
      const from = state.from ?? -state.position * state.step + state.alignment;
      const to = -(state.position + by) * state.step + state.alignment;
      const velocity = state.velocity;
      state.from = null;
      state.velocity = 0;
      const finish = () => {
        state.position = count + ((state.position + by) % count + count) % count;
        // Rebase to an identical copy at the same visible position.
        track.current.style.transform = `translate3d(${-state.position * state.step + state.alignment}px,0,0)`;
        setHovered(current => current === null ? null : count + current % count);
        setIndex(state.position % count);
        state.moving = false;
        setMoving(false);
        if (keepFocus && !state.queue.length) track.current.querySelector(`[data-slide="${state.position}"]`).focus({ preventScroll: true });
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
        if (dragged) {
          // Continue from the finger's exact position and release velocity.
          if (elapsed >= .65) { finish(); return; }
          const w = 20, damping = .9, wd = w * Math.sqrt(1 - damping * damping);
          const v = Math.abs(to - from) > 1 ? Math.max(-20, Math.min(20, velocity * 1000 / (to - from))) : 0;
          progress = 1 - Math.exp(-damping * w * elapsed) * (Math.cos(wd * elapsed) + (damping * w - v) / wd * Math.sin(wd * elapsed));
        } else if (elapsed < .085) {
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
  const pointerDown = event => {
    suppressClick.current = false;
    if (event.pointerType === 'mouse' || !event.isPrimary || !matchMedia('(max-width: 760px)').matches) return;
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, time: event.timeStamp, velocity: 0, dragging: false, target: event.target };
  };
  const pointerMove = event => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    const dx = event.clientX - g.x, dy = event.clientY - g.y;
    if (!g.dragging) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dy) >= Math.abs(dx)) { gesture.current = null; return; }
      const state = motion.current;
      cancelAnimationFrame(state.frame);
      g.from = new DOMMatrixReadOnly(getComputedStyle(track.current).transform).m41;
      g.base = Math.round((state.alignment - g.from) / state.step);
      state.position = g.base;
      state.direction = 0;
      state.queue = [];
      state.dragging = state.moving = g.dragging = true;
      setMoving(true); setHovered(null); setFocused(null); setTouched(null); automatic.dismiss();
      viewport.current.setPointerCapture(event.pointerId);
    }
    const dt = event.timeStamp - g.time;
    if (dt > 0) g.velocity = .35 * g.velocity + .65 * Math.max(-2.5, Math.min(2.5, (event.clientX - g.lastX) / dt));
    g.lastX = event.clientX; g.time = event.timeStamp;
    g.offset = g.from + dx;
    track.current.style.transform = `translate3d(${g.offset}px,0,0)`;
  };
  const pointerEnd = (event, cancelled = false) => {
    const g = gesture.current;
    if (!g || g.id !== event.pointerId) return;
    gesture.current = null;
    if (g.dragging) {
      suppressClick.current = true;
      const state = motion.current;
      const velocity = cancelled || event.timeStamp - g.time > 100 ? 0 : g.velocity;
      const projected = (state.alignment - g.offset - velocity * 140) / state.step;
      const target = Math.max(g.base - 2, Math.min(g.base + 2, Math.round(projected)));
      state.from = g.offset;
      state.velocity = velocity;
      state.dragging = state.moving = false;
      state.queue = [];
      move(target - g.base);
    } else if (!cancelled && !motion.current.moving && !g.target.closest('a')) {
      const card = g.target.closest('[data-slide]');
      if (card) { const n = Number(card.dataset.slide); automatic.dismiss(); setTouched(revealed === n ? null : n); }
    }
    if (viewport.current.hasPointerCapture(event.pointerId)) viewport.current.releasePointerCapture(event.pointerId);
  };
  return <section id={id} className={`best-sellers section-wrap${mirror ? ' newest-releases' : ''}${moving ? ' is-moving' : ''}`} aria-labelledby={`${id}-title`} aria-roledescription="carousel">
    <div className="best-sellers-intro"><div className="section-eyebrow"><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/about-marker-mobile.svg" /><img src="/assets/bestseller-marker.svg" alt="" /></picture>{eyebrow}</div><DisplayHeading id={`${id}-title`} name={headingName} mobileSrc={mirror ? `/assets/title-${headingName}-desktop.png` : undefined}>{title}</DisplayHeading>
      <div className="slider-controls"><button type="button" className="round-arrow arrow-back" onClick={() => move(-1)} aria-label="Previous cakes"><img src="/assets/icon-chevron.svg" alt="" /></button><button type="button" className="round-arrow" onClick={() => move(1)} aria-label="Next cakes"><img src="/assets/icon-chevron.svg" alt="" /></button></div>
    </div>
    <div className="best-sellers-viewport" ref={viewport} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event => pointerEnd(event)} onPointerCancel={event => pointerEnd(event, true)} onClickCapture={event => { if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); } suppressClick.current = false; }} onDragStart={event => event.preventDefault()} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}>
      <div className="best-sellers-track" ref={track}>{slides.map((cake, physicalIndex) => <article className={`best-card${physicalIndex === count + index ? ' is-main' : ''}${revealed === physicalIndex ? ' is-revealed' : ''}`} data-slide={physicalIndex} key={physicalIndex} tabIndex={physicalIndex === count + index ? 0 : -1} aria-hidden={physicalIndex < count || physicalIndex >= count * 2 ? true : undefined} aria-label={cake.name} onPointerEnter={event => { if (event.pointerType !== 'touch' && !motion.current.moving) { setHovered(physicalIndex); setFocused(null); setTouched(null); } }} onPointerLeave={() => setHovered(current => current === physicalIndex ? null : current)} onFocus={event => { if (!motion.current.moving && event.target.matches(':focus-visible')) setFocused(physicalIndex); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(current => current === physicalIndex ? null : current); }}>
        <SiteImage src={cake.image} mobileSrc={cake.mobileImage} alt={cake.name} />
        <div className="best-card-details"><p>{cake.name}</p><CollectionLink name={cake.name} tabIndex={physicalIndex >= count && physicalIndex < count * 2 && (physicalIndex === count + index || revealed === physicalIndex) ? 0 : -1} /></div>
      </article>)}</div>
    </div>
    <span className="visually-hidden" role="status" aria-live="polite">Cake {index + 1} of {count}: {items[index].name}</span>
  </section>;
}
