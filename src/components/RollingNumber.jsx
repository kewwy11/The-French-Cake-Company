import { useEffect, useRef, useState } from 'react';
import './rolling-number.css';

// Digit windows use the existing Figma artwork, preserving its font and spacing.
const layouts = {
  '15': { width: 43, height: 29, cuts: [0, 10, 28, 43] },
  '2000': { width: 91, height: 30, cuts: [0, 17, 36, 56, 76, 91] },
  '50000': { width: 119, height: 33, cuts: [0, 17, 36, 44, 64, 84, 104, 119] },
  '120': { width: 47, height: 30, cuts: [0, 11, 27, 47] },
};
const glyphs = [
  { asset: '2000', x: 37, width: 18, height: 30 },
  { asset: '15', x: 0, width: 9, height: 29 },
  { asset: '2000', x: 0, width: 17, height: 30 },
  { asset: '50000', x: 0, width: 17, height: 33 },
];
const REVOLUTIONS = 3;
const artwork = (asset, x, width, height) => ({
  width, height,
  backgroundImage: `url('/assets/stat-${asset}.png')`,
  backgroundPosition: `-${x}px 0`,
});

export default function RollingNumber({ value, asset, enabled, order }) {
  const root = useRef(null);
  const [settled, setSettled] = useState(false);
  const layout = layouts[asset];
  const slots = [...value];
  useEffect(() => {
    if (!enabled) return;
    const element = root.current;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = [];
    let disposed = false;
    let visible = false;
    let run = 0;
    const clear = () => {
      animations.forEach(animation => animation.cancel());
      animations.length = 0;
    };
    const play = () => {
      const currentRun = ++run;
      clear();
      setSettled(false);
      element.querySelectorAll('.odometer-reel').forEach((reel, index) => {
        animations.push(reel.animate([
          { transform: 'translateY(0)' },
          { transform: `translateY(-${glyphs.length * REVOLUTIONS * layout.height}px)` },
        ], { duration: 1900 + index * 110, delay: order * 90 + index * 65, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }));
      });
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (!disposed && currentRun === run) setSettled(true);
      }).catch(() => {});
    };
    const preferenceChanged = () => {
      if (media.matches) {
        ++run;
        clear();
        setSettled(true);
      } else if (visible) play();
    };
    media.addEventListener('change', preferenceChanged);
    if (media.matches) setSettled(true);
    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting && entry.intersectionRatio >= .45;
      if (nextVisible && !visible && !media.matches) play();
      else if (!nextVisible && visible) animations.forEach(animation => animation.pause());
      visible = nextVisible;
    }, { threshold: [0, .45, 1] });
    observer.observe(element.closest('.metric'));
    return () => {
      disposed = true;
      ++run;
      observer.disconnect();
      media.removeEventListener('change', preferenceChanged);
      clear();
    };
  }, [enabled, asset, layout.height, order]);

  return <span ref={root} className="rolling-number" data-settled={settled} aria-hidden="true" style={{ '--number-width': layout.width + 'px', '--number-height': layout.height + 'px' }}>
    <span className="rolling-number-art">
      {slots.map((character, index) => {
        const x = layout.cuts[index];
        const width = layout.cuts[index + 1] - x;
        const final = <span className="odometer-glyph" style={artwork(asset, x, width, layout.height)} />;
        return <span className="odometer-slot" key={index} style={{ width, height: layout.height }}>
          {/\d/.test(character) ? <span className="odometer-reel" style={{ '--roll-end': `-${glyphs.length * REVOLUTIONS * layout.height}px` }}>
            {Array.from({ length: glyphs.length * REVOLUTIONS }, (_, row) => {
              const glyph = glyphs[(row + index) % glyphs.length];
              return <span className="odometer-row" key={row} style={{ height: layout.height }}><span className="odometer-glyph" style={artwork(glyph.asset, glyph.x, glyph.width, glyph.height)} /></span>;
            })}
            <span className="odometer-row" style={{ height: layout.height }}>{final}</span>
          </span> : final}
        </span>;
      })}
    </span>
  </span>;
}
