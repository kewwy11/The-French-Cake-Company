import { useRef, useState } from 'react';
import { heroSlides } from '../hero-slides.js';
import useImageCycle from '../hooks/useImageCycle.js';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import HeroButton from './HeroButton.jsx';
import CircularMenu, { navigationLinks } from './CircularMenu.jsx';
import { MotionLink } from './ButtonMotion.jsx';

export default function Hero({ isRevealed = true }) {
  const { ref: hero, active, previous, selectSlide, running } = useImageCycle(heroSlides.length, isRevealed);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTrigger = useRef(null);
  return <section ref={hero} className={"hero " + (isRevealed ? "is-revealed" : "") + (running ? '' : ' is-cycle-paused')} id="top" aria-label="The French Cake Company">
    {heroSlides.map((slide, index) => <SiteImage key={slide.src} {...slide} className={"hero-photo hero-slide" + (index === active ? " is-active" : "") + (index === previous ? " is-previous" : "")} loading="eager" />)}
    <div className="hero-shade" />
    <header className="site-header">
      <button ref={menuTrigger} type="button" className="menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="main-menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(current => !current)}><span className="menu-icon-stack"><img className="menu-open-glyph" src="/assets/mobile-menu.svg" alt="" /><img className="menu-close-glyph" src="/assets/menu-close.svg" alt="" /></span></button>
      <nav className="main-nav" aria-label="Main navigation">
        {navigationLinks.map(({ label, href }) => <MotionLink href={href} key={label}>{label}</MotionLink>)}
      </nav>
      <a className="brand-mark" href="#top" aria-label="The French Cake Company home">
        <img className="brand-mark-image" src="/assets/brand-mark.png" alt="" />
      </a>
      <div className="header-tools">
        <button aria-label="Search" className="icon-button"><picture><source media="(max-width: 760px)" srcSet="/assets/mobile-search.svg" /><img src="/assets/icon-search.svg" alt="" /></picture></button>
        <button aria-label="Shopping bag" className="icon-button"><picture><source media="(max-width: 760px)" srcSet="/assets/mobile-bag.svg" /><img src="/assets/icon-bag.svg" alt="" /></picture></button>
        <button aria-label="Your account" className="icon-button account-icon"><img src="/assets/icon-user.svg" alt="" /></button>
        <button aria-label="Language" className="icon-button language-chip"><img src="/assets/flag-uk.png" alt="" /></button>
      </div>
    </header>
    <div className="hero-copy">
      <div className="hero-statement">
      <div className="hero-reveal hero-reveal-kicker"><p className="hero-kicker">Every celebration deserves</p></div>
      <div className="hero-reveal hero-reveal-title"><DisplayHeading as="h1" name="hero">Extraordinary</DisplayHeading></div>
      <div className="hero-reveal hero-reveal-script"><p className="hero-script"><span className="visually-hidden">Cakes</span><span className="hero-cakes-mobile" aria-hidden="true">Cakes</span><picture aria-hidden="true"><img src="/assets/hero-cakes-uppercase.png" alt="" /></picture></p></div>
      </div>
      <div className="hero-reveal hero-reveal-actions"><div className="hero-actions"><HeroButton href="#occasions">Explore our cakes</HeroButton><HeroButton href="#cake-curator" light>Request custom cake</HeroButton></div></div>
    </div>
    <div className="hero-pagination" role="group" aria-label="Hero slides">{heroSlides.map((slide, index) => <button key={slide.src} type="button" aria-label={"Show slide " + (index + 1) + ": " + slide.alt} aria-current={index === active ? "true" : undefined} onClick={() => selectSlide(index)} />)}</div>
    <a href="#metrics" className="scroll-cue" aria-label="Scroll to the next section"><img src="/assets/hero-progress.svg" alt="" /></a>
    <CircularMenu open={menuOpen} setOpen={setMenuOpen} trigger={menuTrigger} />
  </section>;
}
