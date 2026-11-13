import './hero-button.css';
import { RollingLabel } from './ButtonMotion.jsx';

export default function HeroButton({ href, light = false, children }) {
  return <a className={'button hero-button ' + (light ? 'button-light' : 'button-dark')} href={href}>
    <span className="hero-button-label" style={{ '--button-label-width': light ? '171px' : '146px' }}>
      <span className="visually-hidden">{children}</span>
      <RollingLabel className="hero-button-label-art"><img src={light ? '/assets/button-label-custom.svg' : '/assets/button-label-explore.svg'} alt="" /></RollingLabel>
    </span>
    <span className="hero-button-arrow-reveal" aria-hidden="true"><span className="hero-button-arrow-symbol"><img src={light ? '/assets/hero-button-arrow-dark.svg' : '/assets/hero-button-arrow-light.svg'} alt="" /></span></span>
  </a>;
}
