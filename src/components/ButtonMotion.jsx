export function RollingLabel({ children, className = '' }) {
  return <span className={`rolling-label ${className}`}><span className="rolling-label-main">{children}</span><span className="rolling-label-copy" aria-hidden="true">{children}</span></span>;
}

export function RollingArrow({ dark = false }) {
  return <span className="rolling-arrow" aria-hidden="true"><img src={dark ? '/assets/button-arrow-dark.svg' : '/assets/button-arrow-light.svg'} alt="" /><img src={dark ? '/assets/button-arrow-dark.svg' : '/assets/button-arrow-light.svg'} alt="" /></span>;
}

export function CollectionLink({ name, tabIndex }) {
  return <a className="button button-dark collection-link" href="#cake-curator" tabIndex={tabIndex} aria-label={`Explore ${name} collection`}><RollingLabel>Explore collection</RollingLabel><RollingArrow /></a>;
}
