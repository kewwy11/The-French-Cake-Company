import { useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';

const cakes = [
  { image: '/assets/bestseller-wedding.png', mobileImage: '/assets/bestseller-wedding-mobile.png', name: 'The floral celebration cake', note: 'Our most-loved wedding cake' },
  { image: '/assets/bestseller-purple.png', name: 'The velvet cake', note: 'A little drama for the table' },
  { image: '/assets/bestseller-third.png', name: 'The fresh baked collection', note: 'Made with care in our atelier' },
  { image: '/assets/bestseller-fourth.png', name: 'The atelier collection', note: 'For every sweet moment' },
];

export default function BestSellers() {
  const [index, setIndex] = useState(0);
  const track = useRef(null);
  const move = (by) => {
    const next = (index + by + cakes.length) % cakes.length;
    setIndex(next);
    const firstCard = track.current?.querySelector('.best-card');
    const gap = parseFloat(getComputedStyle(track.current).gap) || 0;
    track.current?.scrollTo({
      left: next * ((firstCard?.getBoundingClientRect().width || track.current.clientWidth) + gap),
      behavior: 'smooth',
    });
  };
  return <section className="best-sellers section-wrap" aria-labelledby="best-sellers-title">
    <div className="best-sellers-intro"><div className="section-eyebrow"><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet="/assets/about-marker-mobile.svg" /><img src="/assets/bestseller-marker.svg" alt="" /></picture>Our best sellers</div><DisplayHeading id="best-sellers-title" name="bestsellers">See what our customers are gushing over</DisplayHeading>
      <div className="slider-controls"><button className="round-arrow arrow-back" onClick={() => move(-1)} aria-label="Previous cakes"><img src="/assets/icon-chevron.svg" alt="" /></button><button className="round-arrow" onClick={() => move(1)} aria-label="Next cakes"><img src="/assets/icon-chevron.svg" alt="" /></button></div>
    </div>
    <div className="best-sellers-track" ref={track} aria-live="polite">{cakes.map((cake, cardIndex) => <article className={'best-card ' + (cardIndex === index ? 'selected' : '')} key={cake.name}>
      <SiteImage src={cake.image} mobileSrc={cake.mobileImage} alt={cake.name} /><div className="best-card-caption"><span>{cake.name}</span><small>{cake.note}</small></div>
    </article>)}</div>
  </section>;
}
