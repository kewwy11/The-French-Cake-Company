import './hero-button.css';
import { RollingLabel } from './ButtonMotion.jsx';
import { CTA_URL } from '../cta.js';

export default function HeroButton({ light = false, children }) {
  return <a className={'button hero-button ' + (light ? 'button-light' : 'button-dark')} href={CTA_URL}>
    <RollingLabel className="hero-button-label">{children}</RollingLabel>
    <span className="hero-button-arrow-reveal" aria-hidden="true"><span className="hero-button-arrow-symbol"><img src={light ? '/assets/hero-button-arrow-dark.svg' : '/assets/hero-button-arrow-light.svg'} alt="" /></span></span>
  </a>;
}
