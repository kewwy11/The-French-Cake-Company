import './hero-button.css';

export default function HeroButton({ href, light = false, children }) {
  return <a className={'button hero-button ' + (light ? 'button-light' : 'button-dark')} href={href}>
    <span className="hero-button-label" style={{ '--button-label-width': light ? '171px' : '146px' }}>
      <span className="visually-hidden">{children}</span>
      <span className="hero-button-label-art" aria-hidden="true"><img src={light ? '/assets/button-label-custom.svg' : '/assets/button-label-explore.svg'} alt="" /></span>
    </span>
    <span className="hero-button-arrow-clip" aria-hidden="true">
      <span className="hero-button-arrow"><img src={light ? '/assets/button-arrow-dark.svg' : '/assets/button-arrow-light.svg'} alt="" /></span>
    </span>
  </a>;
}
