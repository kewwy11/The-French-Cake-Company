import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import { CollectionLink } from './ButtonMotion.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';

const cakes = [
  { image: '/assets/bestseller-wedding.png', mobileImage: '/assets/bestseller-wedding-mobile.png', name: 'The Catholic', note: 'Our most-loved wedding cake' },
  { image: '/assets/bestseller-purple.png', name: 'The velvet cake', note: 'A little drama for the table' },
  { image: '/assets/bestseller-third.png', name: 'The fresh baked collection', note: 'Made with care in our atelier' },
  { image: '/assets/bestseller-fourth.png', name: 'The atelier collection', note: 'For every sweet moment' },
];
const count = cakes.length;
// Identical copies allow both ends to pass continuously through the viewport.
const slides = Array.from({ length: count * 3 }, (_, i) => cakes[i % count]);

export default function BestSellers() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [activity, setActivity] = useState(0);
  const interaction = useRef({ hovered: false, focused: false });
  const autoPreview = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);
  const motion = useRef({ position: count, step: 0, frame: 0, queue: [], moving: false });
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const state = motion.current;
    const measure = () => {
      cancelAnimationFrame(state.frame);
      state.moving = false;
      state.queue = [];
      state.position = count + ((state.position % count) + count) % count;
      state.step = track.current.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track.current).gap);
      track.current.style.transform = `translate3d(${-state.position * state.step}px,0,0)`;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    return () => { observer.disconnect(); cancelAnimationFrame(state.frame); };
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      setInView(entries[0].isIntersecting && entries[0].intersectionRatio >= .55 && !document.hidden);
    }, { threshold: [0, .55] });
    observer.observe(viewport.current);
    const visibility = () => {
      if (document.hidden) setInView(false);
      else { observer.unobserve(viewport.current); observer.observe(viewport.current); }
    };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    const card = track.current.querySelector(`[data-slide="${count + index}"]`);
    interaction.current = {
      hovered: inView && matchMedia('(hover: hover)').matches && card.matches(':hover'),
      focused: inView && card.contains(document.activeElement),
    };
    const interacting = interaction.current.hovered || interaction.current.focused;
    setEngaged(interacting);
    setRevealed(interacting);
    if (!inView || reduced || interacting || motion.current.moving) return;
    // One automatic preview per visit. Expiry never restarts this timer.
    autoPreview.current = setTimeout(() => setRevealed(true), 4000);
    return () => clearTimeout(autoPreview.current);
  }, [index, inView, reduced]);
  useEffect(() => {
    if (!revealed || engaged) return;
    const timer = setTimeout(() => setRevealed(false), 5000);
    return () => clearTimeout(timer);
  }, [revealed, engaged, activity]);
  const interact = (physicalIndex, type, value) => {
    if (physicalIndex !== count + index || motion.current.moving) return;
    interaction.current[type] = value;
    setEngaged(interaction.current.hovered || interaction.current.focused);
    if (value) setRevealed(true);
  };
  const move = (direction) => {
    const state = motion.current;
    state.queue.push(direction);
    if (state.moving) return;
    const advance = () => {
      if (!state.queue.length || !track.current) return;
      state.moving = true;
      clearTimeout(autoPreview.current);
      setRevealed(false);
      const by = state.queue.shift();
      const keepFocus = track.current.contains(document.activeElement);
      const from = -state.position * state.step;
      const to = -(state.position + by) * state.step;
      const finish = () => {
        state.position = count + ((state.position + by) % count + count) % count;
        // Rebase to an identical copy at the same visible position.
        track.current.style.transform = `translate3d(${-state.position * state.step}px,0,0)`;
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
  return <section className="best-sellers section-wrap" aria-labelledby="best-sellers-title" aria-roledescription="carousel">
    <div className="best-sellers-intro"><div className="section-eyebrow"><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/about-marker-mobile.svg" /><img src="/assets/bestseller-marker.svg" alt="" /></picture>Our best sellers</div><DisplayHeading id="best-sellers-title" name="bestsellers">See what our customers are gushing over</DisplayHeading>
      <div className="slider-controls"><button className="round-arrow arrow-back" onClick={() => move(-1)} aria-label="Previous cakes"><img src="/assets/icon-chevron.svg" alt="" /></button><button className="round-arrow" onClick={() => move(1)} aria-label="Next cakes"><img src="/assets/icon-chevron.svg" alt="" /></button></div>
    </div>
    <div className="best-sellers-viewport" ref={viewport} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }} onTouchStart={event => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
      touch.current = null;
    }}>
      <div className="best-sellers-track" ref={track}>{slides.map((cake, physicalIndex) => <article className={`best-card${physicalIndex === count + index ? ' is-main' : ''}${revealed && physicalIndex === count + index ? ' is-revealed' : ''}`} data-slide={physicalIndex} key={physicalIndex} tabIndex={physicalIndex === count + index ? 0 : -1} inert={physicalIndex < count || physicalIndex >= count * 2} aria-label={cake.name} onPointerEnter={event => { if (event.pointerType !== 'touch') interact(physicalIndex, 'hovered', true); }} onPointerLeave={() => interact(physicalIndex, 'hovered', false)} onFocus={() => interact(physicalIndex, 'focused', true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) interact(physicalIndex, 'focused', false); }} onPointerDown={() => { if (physicalIndex === count + index && !motion.current.moving) { setRevealed(true); setActivity(value => value + 1); } }}>
        <SiteImage src={cake.image} mobileSrc={cake.mobileImage} alt={cake.name} />
        <div className="best-card-details"><p>{cake.name}</p><CollectionLink name={cake.name} tabIndex={physicalIndex === count + index ? 0 : -1} /></div>
      </article>)}</div>
    </div>
    <span className="visually-hidden" role="status" aria-live="polite">Cake {index + 1} of {count}: {cakes[index].name}</span>
  </section>;
}
