import { useEffect, useRef } from 'react';
import { heroSlides } from '../hero-slides.js';
import './opening-sequence.css';

// One shared clock keeps the stagger, photo hold, and hero handoff coordinated.
const TIMING = {
  title: 1250, titleStagger: 1250,
  firstPhoto: 2700, photoStagger: 400, photoEntrance: 1250,
  zoom: 5300, zoomDuration: 1900,
};
const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
const PHOTO_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

export default function OpeningSequence({ onComplete }) {
  const root = useRef(null);
  useEffect(() => {
    const element = root.current;
    const animations = [];
    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const previousRootOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const finish = () => { if (!cancelled) onComplete(); };
    const onPreference = () => { if (media.matches) finish(); };
    media.addEventListener('change', onPreference);
    // A failed asset or a backgrounded tab must never trap the visitor in the intro.
    const fallback = setTimeout(finish, 17000);
    const animate = (node, frames, options) => {
      const animation = node.animate(frames, { fill: 'both', ...options });
      animations.push(animation);
      return animation;
    };
    async function play() {
      await Promise.all([...element.querySelectorAll('.opening-line img')].map(img => img.decode().catch(() => {})));
      if (cancelled) return;
      if (media.matches || !element.animate) { finish(); return; }
      const clock = document.timeline.currentTime;
      const lines = [...element.querySelectorAll('.opening-line img')];
      lines.forEach((line, index) => {
        animate(line, [
          { transform: 'translateY(115%)' }, { transform: 'translateY(0)' },
        ], { duration: TIMING.title, delay: index * TIMING.titleStagger, easing: PHOTO_EASE });
      });
      // Show the title while the larger photos decode, so slow connections never start on a blank screen.
      await Promise.all([...element.querySelectorAll('.opening-photo img')].map(img => img.decode().catch(() => {})));
      if (cancelled) return;
      const photoOffset = Math.max(0, document.timeline.currentTime - clock + 100 - TIMING.firstPhoto);
      const cards = [...element.querySelectorAll('.opening-photo')];
      cards.forEach((card, index) => {
        const rotation = index === 0 ? -14.48 : index === 1 ? 14.48 : 0;
        animate(card, [
          { opacity: 0, transform: 'translateY(85vh) rotate(' + (rotation + (index === 1 ? 18 : -18)) + 'deg)' },
          { opacity: 1, transform: 'translateY(0) rotate(' + rotation + 'deg)' },
        ], { duration: TIMING.photoEntrance, delay: TIMING.firstPhoto + photoOffset + index * TIMING.photoStagger, easing: PHOTO_EASE });
      });
      const front = element.querySelector('.opening-front');
      const target = document.querySelector('.hero-slide:first-child picture');
      const from = { left: front.offsetLeft, top: front.offsetTop, width: front.offsetWidth, height: front.offsetHeight };
      const to = target.getBoundingClientRect();
      const zoom = animate(front, [
        { left: from.left + 'px', top: from.top + 'px', width: from.width + 'px', height: from.height + 'px' },
        { left: to.left + 'px', top: to.top + 'px', width: to.width + 'px', height: to.height + 'px' },
      ], { duration: TIMING.zoomDuration, delay: TIMING.zoom + photoOffset, easing: EASE });
      if (matchMedia('(max-width: 760px)').matches) {
        animate(element.querySelector('.opening-mobile-image'), [
          { opacity: 0 }, { opacity: 1 },
        ], { duration: 1250, delay: TIMING.zoom + photoOffset + 250, easing: 'ease-in-out' });
      }
      // Every animation starts on the same document timeline, including delayed ones.
      animations.forEach(animation => { animation.startTime = clock; });
      await zoom.finished;
      finish();
    }
    play().catch(finish);
    return () => {
      cancelled = true;
      clearTimeout(fallback);
      media.removeEventListener('change', onPreference);
      animations.forEach(animation => animation.cancel());
      history.scrollRestoration = previousScrollRestoration;
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [onComplete]);
  return <div ref={root} className="opening-sequence" aria-label="Welcome to The French Cake Company" role="status">
    <div className="opening-title" aria-label="The French Cake Company">
      <span className="opening-line"><img src="/assets/intro-the.png" alt="" /></span>
      <span className="opening-line"><img src="/assets/intro-company.png" alt="" /></span>
    </div>
    <div className="opening-photo opening-left" aria-hidden="true"><img src={heroSlides[2].src} alt="" /></div>
    <div className="opening-photo opening-right" aria-hidden="true"><img src={heroSlides[1].src} alt="" /></div>
    <div className="opening-photo opening-front" aria-hidden="true"><picture><img src={heroSlides[0].src} alt="" /></picture><img className="opening-mobile-image" src={heroSlides[0].mobileSrc} alt="" /></div>
  </div>;
}
