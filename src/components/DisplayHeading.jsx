export default function DisplayHeading({ as: Tag = 'h2', children, name, mobileSrc, className = '', id }) {
  return <Tag id={id} className={`display-heading ${className}`}>
    <span className="visually-hidden">{children}</span>
    <picture aria-hidden="true">
      <source media="(max-width: 760px)" srcSet={mobileSrc?.replace(/\.png$/, '.svg') || `/assets/title-${name}-mobile.svg`} />
      <img src={`/assets/title-${name}-desktop.svg`} alt="" />
    </picture>
  </Tag>;
}
