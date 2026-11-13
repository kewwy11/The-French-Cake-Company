import { useState } from 'react';
import DisplayHeading from './DisplayHeading.jsx';
import SiteImage from './SiteImage.jsx';
import { RollingLabel, RollingArrow } from './ButtonMotion.jsx';
const services = [
  { title: 'Wedding design & tasting', asset: 'wedding', detail: 'Plan a bespoke tiered cake with design guidance, a personalised quote and an optional tasting box.', href: null },
  { title: 'Corporate event cakes', asset: 'corporate', detail: 'Make your brand part of the celebration with logo cakes, branded cupcakes and decorated cookies.', href: null },
  { title: 'Birthdays & private parties', asset: 'birthday', detail: 'Choose a cake for birthdays, christenings or family parties, then personalise the theme, photo and flavour.', href: null },
];
export default function Services() {
  const [open, setOpen] = useState(-1);
  return <section className="services section-wrap">
    <div className="services-intro"><div className="section-eyebrow"><i />Our services</div><DisplayHeading name="services">Services we offer</DisplayHeading></div>
    <div className="service-list">{services.map(({ title, asset, detail, href }, i) => <article className={'service-row ' + (open === i ? 'is-preview' : '')} key={title} onMouseEnter={() => setOpen(i)} onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setOpen(-1); }} onFocusCapture={() => setOpen(i)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(-1); }} onKeyDown={event => { if (event.key === 'Escape') setOpen(-1); }}>
      <div className="service-row-heading"><button className="service-preview-trigger" type="button" aria-expanded={open === i} aria-controls={`service-preview-${asset}`} onClick={() => setOpen(i)}><RollingLabel className="service-number">0{i + 1}</RollingLabel><span className="service-title"><span className="visually-hidden">{title}</span><RollingLabel><picture aria-hidden="true"><source media="(max-width: 760px)" srcSet={`/assets/service-${asset}-mobile.png`} /><img src={`/assets/service-${asset}-desktop.png`} alt="" /></picture></RollingLabel></span></button>
      <a className="service-action" href={href || undefined} role={href ? undefined : 'link'} tabIndex={0} aria-disabled={!href} aria-label={`Open ${title}`}><RollingLabel>Open</RollingLabel></a></div>
      <aside className="service-preview" id={`service-preview-${asset}`} inert={open !== i} aria-label={title}>
        <div className="service-preview-clip"><div className="service-preview-card"><SiteImage src={`/assets/service-preview-${asset}.png`} alt={title} /><p>{detail}</p><a className="service-discover" href={href || undefined} role={href ? undefined : 'link'} tabIndex={0} aria-disabled={!href}><RollingLabel>Discover service</RollingLabel><RollingArrow dark /></a></div></div>
      </aside>
    </article>)}</div>
  </section>;
}
