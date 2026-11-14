import { useEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import useAutoplay from '../hooks/useAutoplay.js';

const stories = [
  { image: '/assets/testimonial-cake.png', mobileImage: '/assets/testimonial-cake-mobile.png', alt: 'Sculptural floral celebration cake with pink roses', avatar: '/assets/customer-avatar.png', name: 'Rebecca Mikaelsson', event: 'Birthday fiesta', quote: 'Everyone at the party loved the cake! Asides me (the celebrant) it was the most talked about thing. Thank you for making my day!' },
  { image: '/assets/testimonial-cookies.png', alt: 'Individually wrapped Elevee Club cookies with burgundy ribbons', avatar: '/assets/testimonial-elevee-avatar.png', imageFirst: true, name: 'Elevee Club', event: 'Annual Meet', quote: 'The personalised cookies were such a lovely touch at our annual meet. Our logo looked beautiful, the presentation was thoughtful, and our members loved every bite. Thank you for making our gathering feel extra special!' },
  { image: '/assets/testimonial-superhero.png', alt: 'A tiered superhero birthday cake', avatar: '/assets/testimonial-john-avatar.png', name: 'John Cameroon', event: 'Superhero themed bash', quote: 'The superhero cake brought the whole party to life! From the bold colours to all the little details, it was everything we hoped for. It tasted just as amazing as it looked. Thank you for making our celebration unforgettable!' },
];

function Story({ story }) {
  const photo = <SiteImage src={story.image} mobileSrc={story.mobileImage} alt={story.alt} className="testimonial-photo" loading="eager" />;
  return <>{story.imageFirst && photo}<article className="review-card">
    <div className="review-quote"><img className="quote-mark" src="/assets/testimonial-quote.png" alt="" /><p>{story.quote}</p></div>
    <div className="reviewer"><SiteImage src={story.avatar} alt="" className="review-avatar" loading="eager" /><div><b>{story.name}</b><span>{story.event}</span></div></div>
  </article>{!story.imageFirst && photo}</>;
}

export default function Testimonial() {
  const [slide, setSlide] = useState({ active: 0, previous: null, direction: 1, sequence: 0 });
  const motion = useRef({ active: 0, busy: false, queue: [] });
  const section = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!reduced) return;
    motion.current.busy = false;
    motion.current.queue = [];
    setSlide(current => ({ ...current, previous: null }));
  }, [reduced]);
  const advance = () => {
    const state = motion.current;
    if (state.busy || !state.queue.length) return;
    const direction = state.queue.shift();
    const previous = state.active;
    state.active = (state.active + direction + stories.length) % stories.length;
    state.busy = !reduced;
    setSlide(current => ({ active: state.active, previous: reduced ? null : previous, direction, sequence: current.sequence + 1 }));
  };
  const move = direction => { motion.current.queue.push(direction); advance(); };
  const autoplay = useAutoplay({ ref: section, delay: 10000, resetKey: slide.sequence, onAdvance: () => { if (!motion.current.busy) move(1); } });
  const complete = () => {
    motion.current.busy = false;
    setSlide(current => ({ ...current, previous: null }));
    advance();
  };
  useEffect(() => {
    if (slide.previous === null) return;
    // Browsers can cancel animationend when a tab or its motion settings change.
    const timer = setTimeout(complete, 1000);
    return () => clearTimeout(timer);
  }, [slide.sequence, slide.previous]);
  const finish = event => {
    if (event.target !== event.currentTarget || event.animationName !== 'testimonial-sweep') return;
    complete();
  };
  return <section ref={section} className="testimonial section-wrap">
    <div className="testimonial-heading">
      <div><div className="section-eyebrow"><i />The cake curator</div><DisplayHeading name="testimonial">The proof is in the celebration</DisplayHeading></div>
      <div className="slider-controls"><button type="button" className="round-arrow arrow-back" aria-label="Previous story" onClick={() => move(-1)}><img src="/assets/icon-chevron.svg" alt="" /></button><button type="button" className="round-arrow" aria-label="Next story" onClick={() => move(1)}><img src="/assets/icon-chevron.svg" alt="" /></button></div>
    </div>
    <div className="testimonial-stage" aria-roledescription="carousel" aria-label="Customer celebrations">
      {stories.map((story, index) => <div key={index} className={`testimonial-content${index === slide.active ? ' is-current' : ''}${index === slide.previous ? ' is-outgoing' : ''}${index === slide.active && slide.previous !== null ? ' is-entering' : ''} ${slide.direction < 0 ? 'sweep-from-left' : 'sweep-from-right'}`} aria-hidden={index !== slide.active} inert={index !== slide.active} onAnimationEnd={finish}><Story story={story} /></div>)}
    </div>
    <span className="visually-hidden" role="status" aria-live={autoplay ? 'off' : 'polite'}>Celebration {slide.active + 1} of {stories.length}</span>
  </section>;
}
