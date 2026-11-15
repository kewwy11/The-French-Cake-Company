import { useEffect, useRef, useState } from 'react';
import SiteImage from './SiteImage.jsx';
import DisplayHeading from './DisplayHeading.jsx';
import { RollingLabel, RollingArrow } from './ButtonMotion.jsx';
import useMobileReveal from '../hooks/useMobileReveal.js';

const occasions = [
  ['Weddings', '/assets/occasion-weddings.png', '/assets/occasion-weddings-mobile.png', 'wedding'],
  ['Birthdays', '/assets/occasion-birthdays.png', '/assets/occasion-birthdays-mobile.png', 'birthday'],
  ['Cupcakes & cookies', '/assets/occasion-cupcakes.png', '/assets/occasion-cupcakes-mobile.png', 'cupcakes'],
  ['Baby & milestones', '/assets/occasion-milestones.png', '/assets/occasion-milestones-mobile.png', 'milestones'],
];

export default function Occasions() {
  const section = useRef(null);
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const automatic = useMobileReveal(section, { selector: '.occasion-visual' });
  useEffect(() => { setSelected(null); }, [automatic.candidate]);
  const active = hovered ?? focused ?? selected ?? (automatic.active ? Number(automatic.active.closest('.occasion-card').dataset.occasion) : null);
  return <section ref={section} className="occasions section-wrap" id="occasions">
    <div className="occasion-heading"><div className="section-eyebrow"><i />Categories</div><DisplayHeading name="occasions">Find your reason to celebrate</DisplayHeading></div>
    <div className="occasion-grid">{occasions.map(([name, image, mobileImage, mood], index) => <article className={`occasion-card${active === index ? ' is-revealed' : ''}`} data-occasion={index} key={name}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(index); }}
      onPointerLeave={() => setHovered(null)}
      onFocusCapture={event => { if (event.target.matches(':focus-visible')) setFocused(index); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}>
      <div className="occasion-visual"><SiteImage src={image} mobileSrc={mobileImage} alt={`${name} cake`} className={`occasion-image ${mood}`} />
        <button type="button" className="occasion-toggle" aria-label={`Preview ${name} collection`} aria-expanded={active === index} onClick={() => { automatic.dismiss(); setHovered(null); setFocused(null); setSelected(active === index ? null : index); }} />
        <a href="#cake-curator" className="occasion-cta button button-dark" tabIndex={active === index ? 0 : -1} aria-label={`Explore ${name} collection`}><RollingLabel>Explore collection</RollingLabel><RollingArrow /></a>
      </div><span>{name}</span>
    </article>)}</div>
  </section>;
}
