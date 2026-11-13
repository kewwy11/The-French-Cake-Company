import { useLayoutEffect, useRef } from 'react';
import useReducedMotion from '../hooks/useReducedMotion.js';

function StoryWords({ children }) {
  return children.split(' ').map((word, i) => <span key={i}><span className="story-word">{word}</span>{' '}</span>);
}

export default function BrandStory() {
  const copy = useRef(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const element = copy.current;
    let lines = [];
    let frame = 0;
    const paint = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top;
      lines.forEach(line => {
        const progress = reduced ? 1 : Math.max(0, Math.min(1, (innerHeight * .78 - top - line.offset) / (innerHeight * .22)));
        line.words.forEach(word => word.style.setProperty('--line-reveal', `${progress * 100}%`));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const measure = () => {
      const top = element.getBoundingClientRect().top;
      lines = [];
      element.querySelectorAll('.story-word').forEach(word => {
        const offset = Math.round(word.getBoundingClientRect().top - top);
        let line = lines.find(item => Math.abs(item.offset - offset) < 2);
        if (!line) { line = { offset, words: [] }; lines.push(line); }
        line.words.push(word);
      });
      paint();
    };
    measure();
    let disposed = false;
    document.fonts.ready.then(() => { if (!disposed) measure(); });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    return () => { disposed = true; observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', measure); };
  }, [reduced]);
  return <section className="brand-story section-wrap" id="our-story">
    <div className="section-eyebrow about-label"><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/about-marker-mobile.svg" /><img src="/assets/about-marker.svg" alt="" /></picture><img className="about-desktop-title" src="/assets/about-title-desktop.png" alt="" aria-hidden="true" /><span className="about-mobile-title" aria-hidden="true">About us</span><span className="visually-hidden">About us</span></div>
    <div className="story-copy" ref={copy}><p className="story-lead"><StoryWords>Born from a love of beautiful things, and butter.</StoryWords></p><p><StoryWords>The French Cake Company was built on a single belief: that a cake isn't just a dessert it's the centrepiece of your most cherished moments. Based in Braine-le-Château, our atelier is where traditional French pastry techniques meet bold, modern artistry.</StoryWords></p></div>
  </section>;
}
