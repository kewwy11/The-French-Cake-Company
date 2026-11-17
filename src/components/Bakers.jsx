import { useCallback, useEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import { BAKER_CARD_DURATION, bakerPullProgress } from '../baker-motion.js';
const bakers = [
  ['/assets/baker-one.png', 'Jose Denoso in the atelier', 'Jose Denoso', 'Chief Connoisseur', '15 years'],
  ['/assets/baker-two.png', 'A member of our atelier team', 'Camille Laurent', 'Celebration Cake Baker', '8 years'],
  ['/assets/baker-three.png', 'A baker decorating a cake', 'Amara Okafor', 'Cake Artist', '6 years'],
  ['/assets/baker-four.png', 'A baker in the atelier', 'Daniel Moreau', 'Pastry Chef', '4 years'],
];
export default function Bakers() {
  const gallery = useRef(null);
  const track = useRef(null);
  const paused = useRef(false);
  const interaction = useRef({ hovered: null, focused: null });
  const [activeCard, setActiveCard] = useState(null);
  const [mainCard, setMainCard] = useState(null);
  const main = useRef(null);
  const showMain = useCallback(index => {
    if (main.current !== index) { main.current = index; setMainCard(index); }
  }, []);
  const [visibleCards, setVisibleCards] = useState([0, 1, 2]);
  const engage = (kind, index) => {
    interaction.current[kind] = index;
    const active = interaction.current.hovered ?? interaction.current.focused;
    paused.current = active !== null;
    setActiveCard(active);
  };
  const reduced = useReducedMotion();
  useEffect(() => {
    const visible = new Set();
    const pickMain = () => {
      const bounds = gallery.current.getBoundingClientRect();
      if (bounds.top >= innerHeight || bounds.bottom <= 0) { showMain(null); return; }
      let closest = null, distance = Infinity;
      [...track.current.children].forEach((card, index) => {
        const r = card.getBoundingClientRect();
        const fromCenter = Math.abs(r.left + r.width / 2 - (bounds.left + bounds.width / 2));
        if (r.right > bounds.left && r.left < bounds.right && fromCenter < distance) { closest = index % bakers.length; distance = fromCenter; }
      });
      showMain(closest);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const index = Number(entry.target.dataset.baker);
        if (entry.isIntersecting && entry.intersectionRatio >= .35) visible.add(index);
        else visible.delete(index);
      });
      setVisibleCards([...visible]);
      pickMain();
    }, { root: gallery.current, threshold: [0, .35] });
    [...track.current.children].forEach(card => observer.observe(card));
    const viewport = new IntersectionObserver(pickMain);
    viewport.observe(gallery.current);
    gallery.current.addEventListener('scroll', pickMain, { passive: true });
    return () => { observer.disconnect(); viewport.disconnect(); gallery.current?.removeEventListener('scroll', pickMain); };
  }, [reduced, showMain]);
  useEffect(() => {
    const element = track.current;
    if (reduced) { element.style.transform = 'translate3d(0,0,0)'; return; }
    let frame = 0, visible = false, previous = 0, elapsed = 0, cycle = 0, playback = 0;
    const measure = () => {
      cycle = element.children[bakers.length].offsetLeft - element.children[0].offsetLeft;
      paint();
    };
    const paint = () => {
      if (!cycle) return;
      const phase = elapsed / BAKER_CARD_DURATION;
      const position = (Math.floor(phase) + bakerPullProgress(phase % 1)) * cycle / bakers.length;
      element.style.transform = `translate3d(${-position % cycle}px,0,0)`;
      if (visible) {
        const step = cycle / bakers.length;
        const centered = Math.round((position % cycle + gallery.current.clientWidth / 2 - element.children[0].offsetWidth / 2) / step);
        showMain(centered % bakers.length);
      }
    };
    measure();
    const tick = time => {
      frame = 0;
      if (!visible || document.hidden) { previous = 0; return; }
      const elapsedFrame = previous ? Math.min((time - previous) / 1000, .04) : 0;
      previous = time;
      if (paused.current) { playback = 0; frame = requestAnimationFrame(tick); return; }
      playback = Math.min(1, playback + elapsedFrame / .65);
      const resume = playback * playback * (3 - 2 * playback);
      elapsed = (elapsed + elapsedFrame * resume) % (BAKER_CARD_DURATION * bakers.length);
      paint();
      frame = requestAnimationFrame(tick);
    };
    const syncPlayback = () => {
      if (visible && !document.hidden) {
        if (!frame) frame = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
    };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) showMain(null); else paint(); syncPlayback(); });
    observer.observe(gallery.current);
    const resize = new ResizeObserver(measure);
    resize.observe(gallery.current);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); document.removeEventListener('visibilitychange', syncPlayback); };
  }, [reduced, showMain]);
  return <section className="bakers section-wrap">
    <div className="bakers-heading"><div className="section-eyebrow"><i />Meet our bakers</div><DisplayHeading name="bakers">A little artistry, a lot of heart</DisplayHeading></div>
    <div className="baker-gallery" ref={gallery} tabIndex={reduced ? 0 : undefined} role="region" aria-label="Our bakers"><div className="baker-track" ref={track}>{[...bakers, ...bakers].map(([image, alt, title, detail, specialty], index) => <article className={`baker-card${(activeCard !== null ? activeCard === index : mainCard === index % bakers.length) ? ' is-revealed' : ''}`} key={image + index} data-baker={index} aria-hidden={!visibleCards.includes(index)} tabIndex={visibleCards.includes(index) ? 0 : -1} onPointerEnter={event => { if (event.pointerType !== 'touch') engage('hovered', index); }} onPointerLeave={() => engage('hovered', null)} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) engage('focused', index); }} onBlur={() => engage('focused', null)}>
      <SiteImage src={image} alt={alt} />
      <div className="baker-details"><div><p>{title}</p><span>{detail}</span></div><span>{specialty}</span></div>
    </article>)}</div></div>
  </section>;
}
