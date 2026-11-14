import { useEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
const bakers = [
  ['/assets/baker-one.png', '/assets/baker-one-mobile.png', 'The pastry chef at work', 'Pastry chef'],
  ['/assets/baker-two.png', undefined, 'A member of our atelier team', 'Our atelier team'],
  ['/assets/baker-three.png', undefined, 'A baker decorating a cake', 'Cake artist'],
  ['/assets/baker-four.png', undefined, 'A baker in the atelier', 'Cake artist'],
];
export default function Bakers() {
  const gallery = useRef(null);
  const track = useRef(null);
  const paused = useRef(false);
  const interaction = useRef({ hovered: null, focused: null });
  const [activeCard, setActiveCard] = useState(null);
  const engage = (kind, index) => {
    interaction.current[kind] = index;
    const active = interaction.current.hovered ?? interaction.current.focused;
    paused.current = active !== null;
    setActiveCard(active);
  };
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = track.current;
    if (reduced) { element.style.transform = 'translate3d(0,0,0)'; return; }
    let frame = 0, visible = false, previous = 0, elapsed = 0, position = 0, velocity = 0, step = 0, playback = 1;
    const measure = () => {
      const next = element.children[1].offsetLeft - element.children[0].offsetLeft;
      if (step) { position *= next / step; velocity *= next / step; }
      step = next;
    };
    measure();
    const tick = time => {
      frame = 0;
      if (!visible || document.hidden) { previous = 0; return; }
      const elapsedFrame = previous ? Math.min((time - previous) / 1000, .04) : 0;
      previous = time;
      if (paused.current) { playback = 0; frame = requestAnimationFrame(tick); return; }
      playback = Math.min(1, playback + elapsedFrame / .45);
      const dt = elapsedFrame * playback;
      elapsed += dt;
      // A forward-moving target has a gentle pull/glide cadence. The same
      // damped spring as the best sellers follows it without stopping the track.
      const phase = elapsed / 5.5;
      const target = step * (phase - .055 * Math.sin(phase * Math.PI * 2));
      const substeps = 4;
      for (let i = 0; i < substeps; i++) {
        const h = dt / substeps;
        const force = 144 * (target - position) - 17.28 * velocity;
        velocity += force * h;
        position += velocity * h;
      }
      const cycle = step * bakers.length;
      // Rebase both spring and target together so the seam never accumulates error.
      if (position >= cycle) { position -= cycle; elapsed -= 5.5 * bakers.length; }
      element.style.transform = `translate3d(${-position}px,0,0)`;
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
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncPlayback(); });
    observer.observe(gallery.current);
    const resize = new ResizeObserver(measure);
    resize.observe(gallery.current);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); resize.disconnect(); document.removeEventListener('visibilitychange', syncPlayback); };
  }, [reduced]);
  return <section className="bakers section-wrap">
    <div className="bakers-heading"><div className="section-eyebrow"><i />Meet our bakers</div><DisplayHeading name="bakers">A little artistry, a lot of heart</DisplayHeading></div>
    <div className="baker-gallery" ref={gallery} tabIndex={reduced ? 0 : undefined} role="region" aria-label="Our bakers"><div className="baker-track" ref={track}>{[...bakers, ...bakers].map(([image, mobileImage, alt], index) => <article className={`baker-card${activeCard === index ? ' is-revealed' : ''}`} key={image + index} aria-hidden={index >= bakers.length} tabIndex={index < bakers.length ? 0 : -1} onPointerEnter={event => { if (event.pointerType !== 'touch') engage('hovered', index); }} onPointerLeave={() => engage('hovered', null)} onFocus={event => { if (event.currentTarget.matches(':focus-visible')) engage('focused', index); }} onBlur={() => engage('focused', null)}>
      <SiteImage src={image} mobileSrc={mobileImage} alt={index >= bakers.length ? '' : alt} />
      <div className="baker-details"><div><p>Jose Denoso</p><span>Chief Connoisseur</span></div><span>15years</span></div>
    </article>)}</div></div>
  </section>;
}
