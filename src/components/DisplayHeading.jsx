export default function DisplayHeading({ as: Tag = 'h2', children, name, className = '', id }) {
  return <Tag id={id} className={`display-heading ${className}`}>
    <span className="visually-hidden">{children}</span>
    <picture aria-hidden="true">
      <source media="(max-width: 760px)" srcSet={`/assets/title-${name}-mobile.png`} />
      <img src={`/assets/title-${name}-desktop.png`} alt="" />
    </picture>
  </Tag>;
}
