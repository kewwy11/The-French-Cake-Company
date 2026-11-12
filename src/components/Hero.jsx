import { useEffect, useRef, useState } from 'react';
import { heroSlides, HERO_INTERVAL } from '../hero-slides.js';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import HeroButton from './HeroButton.jsx';

const links = [
  ['Cakes', '#occasions'],
  ['Custom orders', '#cake-curator'],
  ['Cake finder', '#cake-curator'],
  ['Our story', '#our-story'],
];

export default function Hero({ isRevealed = true }) {
  const hero = useRef(null);
  const [{ active, previous }, setSlide] = useState({ active: 0, previous: null });
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const selectSlide = (index) => setSlide(current => current.active === index ? current : { active: index, previous: current.active });
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!isRevealed || reducedMotion) return;
    let timer;
    const schedule = () => {
      clearTimeout(timer);
      if (document.hidden) return;
      timer = setTimeout(() => {
        if (hero.current?.getBoundingClientRect().bottom > 0) selectSlide((active + 1) % heroSlides.length);
        else schedule();
      }, HERO_INTERVAL);
    };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', schedule); };
  }, [isRevealed, reducedMotion, active]);
  const [menuOpen, setMenuOpen] = useState(false);
  return <section ref={hero} className={"hero " + (isRevealed ? "is-revealed" : "")} id="top" aria-label="The French Cake Company">
    {heroSlides.map((slide, index) => <SiteImage key={slide.src} {...slide} className={"hero-photo hero-slide" + (index === active ? " is-active" : "") + (index === previous ? " is-previous" : "")} loading="eager" />)}
    <div className="hero-shade" />
    <header className="site-header">
      <button className="menu-toggle icon-button" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
      <nav className={'main-nav ' + (menuOpen ? 'is-open' : '')} aria-label="Main navigation">
        {links.map(([label, href]) => <a href={href} key={label} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <a className="brand-mark" href="#top" aria-label="The French Cake Company home">
        <img className="brand-mark-image" src="/assets/brand-mark.png" alt="" />
      </a>
      <div className="header-tools">
        <button aria-label="Search" className="icon-button"><img src="/assets/icon-search.svg" alt="" /></button>
        <button aria-label="Shopping bag" className="icon-button"><img src="/assets/icon-bag.svg" alt="" /></button>
        <button aria-label="Your account" className="icon-button account-icon"><img src="/assets/icon-user.svg" alt="" /></button>
        <button aria-label="Language" className="icon-button language-chip"><img src="/assets/flag-uk.png" alt="" /></button>
      </div>
    </header>
    <div className="hero-copy">
      <div className="hero-reveal hero-reveal-kicker"><p className="hero-kicker">Every celebration deserves</p></div>
      <div className="hero-reveal hero-reveal-title"><DisplayHeading as="h1" name="hero">Extraordinary</DisplayHeading></div>
      <div className="hero-reveal hero-reveal-script"><p className="hero-script"><span className="visually-hidden">Cakes</span><picture aria-hidden="true"><img src="/assets/hero-cakes-uppercase.png" alt="" /></picture></p></div>
      <div className="hero-reveal hero-reveal-actions"><div className="hero-actions"><HeroButton href="#occasions">Explore our cakes</HeroButton><HeroButton href="#cake-curator" light>Request custom cake</HeroButton></div></div>
    </div>
    <div className="hero-pagination" role="group" aria-label="Hero slides">{heroSlides.map((slide, index) => <button key={slide.src} type="button" aria-label={"Show slide " + (index + 1) + ": " + slide.alt} aria-current={index === active ? "true" : undefined} onClick={() => selectSlide(index)} />)}</div>
    <a href="#metrics" className="scroll-cue" aria-label="Scroll to the next section"><img src="/assets/hero-progress.svg" alt="" /></a>
  </section>;
}
